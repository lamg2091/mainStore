import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcrypt";
import cors from "cors";
import "dotenv/config";
import nodemailer from "nodemailer";
import crypto from "crypto";
const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mainStore",
  password: "2091",
  port: 5432,
});

app.post("/registro", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query(
      "INSERT INTO usuarios(name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword],
    );
    res.json({ message: "Usuario creado", user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Error al registrarse: " + err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (user.rows.length > 0) {
      const validatePassword = await bcrypt.compare(
        password,
        user.rows[0].password,
      );
      if (validatePassword) {
        res.json({ message: "Login Exitoso", user: user.rows[0] });
      } else {
        res.status(401).json({ error: "Contraseña incorrecta" });
      }
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("🚨 ERROR REAL AQUÍ:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/productos", async (req, res) => {
  const { nombre, categoria, precio, imagen_url, descripcion } = req.body;
  try {
    const nuevoProduct = await pool.query(
      "INSERT INTO productos (nombre, categoria, precio, imagen_url, descripcion) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, categoria, precio, imagen_url, descripcion],
    );
    res.json(nuevoProduct.rows[0]);
  } catch (err) {
    console.error("❌ Error en la base de datos al insertar producto:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { precio, nombre, categoria } = req.body;
  try {
    await pool.query(
      "UPDATE productos SET nombre = $1, precio = $2, categoria = $3 WHERE id = $4",
      [nombre, precio, categoria, id],
    );
    res.json("Producto actualizado");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM productos WHERE id = $1", [id]);
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/pedidos", async (req, res) => {
  const { usuario_id, nombre_cliente, total, metodo, items } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const nuevoPedido = await client.query(
      "INSERT INTO pedidos (usuario_id, nombre_cliente, total, estado, metodo, fecha) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [usuario_id, nombre_cliente, total, "pendiente", metodo],
    );

    const pedidoId = nuevoPedido.rows[0].id;

    for (const item of items) {
      await client.query(
        "INSERT INTO detalle_pedidos (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          pedidoId,
          item.id,
          item.nombre,
          item.cantidad,
          item.precio,
          item.precio * item.cantidad,
        ],
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Pedido creado", pedido: nuevoPedido.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.get("/pedidos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pedidos ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/pedidos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await pool.query("SELECT * FROM pedidos WHERE id = $1", [
      id,
    ]);
    if (pedido.rows.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    const items = await pool.query(
      `SELECT nombre_producto AS nombre, cantidad, precio_unitario AS precio, subtotal
       FROM detalle_pedidos WHERE pedido_id = $1`,
      [id],
    );
    res.json({ ...pedido.rows[0], items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/dashboard", async (req, res) => {
  try {
    const ingresos = await pool.query(
      `SELECT COALESCE(SUM(total), 0) AS total FROM pedidos`,
    );

    const pedidoActual = await pool.query(
      `SELECT COUNT(*) AS total FROM pedidos
       WHERE DATE(fecha) = CURRENT_DATE`,
    );

    const productos = await pool.query(
      `SELECT COUNT(*) AS total FROM productos`,
    );

    const usuarios = await pool.query(`SELECT COUNT(*) AS total FROM usuarios`);

    const actividad = await pool.query(
      `SELECT id, nombre_cliente, total, estado, fecha
       FROM pedidos
       ORDER BY fecha DESC
       LIMIT 3`,
    );

    const stockBajo = await pool.query(
      `SELECT id, nombre, imagen_url
       FROM productos
       ORDER BY id DESC
       LIMIT 4`,
    );

    res.json({
      ingresos: Number(ingresos.rows[0].total),
      pedidosHoy: Number(pedidoActual.rows[0].total),
      productos: Number(productos.rows[0].total),
      usuarios: Number(usuarios.rows[0].total),
      actividad: actividad.rows,
      stockBajo: stockBajo.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/login-admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminQuery = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND rol = 'admin'",
      [email],
    );

    if (adminQuery.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "El administrador no existe o no tiene permisos" });
    }

    const admin = adminQuery.rows[0];
    const validarContraseña = await bcrypt.compare(password, admin.password);

    if (!validarContraseña) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      message: "Bienvenido admin",
      token: "un-token-seguro-jwt-aqui",
    });
  } catch (error) {
    console.error("🚨 Error real en /login-admin:", error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor: " + error.message });
  }
});


app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await pool.query("SELECT id FROM usuarios WHERE email = $1", [
    email,
  ]);
  if (user.rows.length === 0)
    return res.json({ message: "Si existe, se envió el correo" });
 
  const token = crypto.randomBytes(32).toString('hex');
  const expire = new Date(Date.now() + 3600000);
 
  await pool.query(
    "UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
    [token, expire, user.rows[0].id],
  );

  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
 
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Restablecer contraseña",
    html: `<a href="${process.env.FRONTEND_URL}/restablecer/${token}">Restablecer contraseña</a>`,
  });
  res.json({ message: "Si existe, se envió el correo" });
});
 

app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("🔎 Token recibido desde el frontend:", token);
 
  const todos = await pool.query(
    "SELECT id, email, reset_token, reset_token_expires, NOW() as ahora FROM usuarios WHERE reset_token IS NOT NULL"
  );
  console.log("🔎 Usuarios con reset_token guardado en la BD:", todos.rows);
 
  const user = await pool.query(
    "SELECT id FROM usuarios WHERE reset_token = $1 AND reset_token_expires > NOW()",
    [token],
  );
  console.log("🔎 Coincidencias encontradas:", user.rows.length);
 
  if (user.rows.length === 0)
    return res.status(400).json({ error: "Enlace inválido o expirado" });
 
  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query(
    "UPDATE usuarios SET password = $1, reset_token = NULL WHERE id = $2",
    [hashed, user.rows[0].id],
  );
 
  res.json({ message: "Contraseña actualizada" });
});
 
const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
