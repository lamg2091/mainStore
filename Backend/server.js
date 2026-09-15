import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcrypt";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mainstore",
  password: "miclave123",
  port: 5432,
});

// REGISTRO
app.post("/registro", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query(
      "INSERT INTO usuarios(nombre, apellido, email, contrasena_hash) VALUES ($1, $2, $3, $4) RETURNING id_usuario, nombre, email",
      [name, "Sin apellido", email, hashedPassword],
    );
    res.json({ message: "Usuario creado", user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Error al registrarse: " + err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (user.rows.length > 0) {
      const validatePassword = await bcrypt.compare(
        password,
        user.rows[0].contrasena_hash,
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

// OBTENER PRODUCTOS (Corregido: c.nombre en lugar de nombre_categoria)
app.get("/productos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id_producto AS id, p.nombre, p.descripcion, p.precio, 
             p.imagen_principal AS imagen_url, nombre_categoria AS categoria 
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id_producto DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("🚨 ERROR REAL AQUÍ:", err);
    res.status(500).json({ error: err.message });
  }
});

// OBTENER CATEGORÍAS (Recomendado para tu select dinámico)
app.get("/categorias", async (req, res) => {
  try {
    const result = await pool.query("SELECT id_categoria, nombre FROM categorias ORDER BY nombre ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREAR PRODUCTO
app.post("/productos", async (req, res) => {
  const { nombre, id_categoria, precio, imagen_url, descripcion } = req.body;
  try {
    const nuevoProduct = await pool.query(
      "INSERT INTO productos (nombre, id_categoria, precio, imagen_principal, descripcion) VALUES ($1, $2, $3, $4, $5) RETURNING id_producto AS id, nombre, precio",
      [nombre, id_categoria || null, precio, imagen_url, descripcion],
    );
    res.json(nuevoProduct.rows[0]);
  } catch (err) {
    console.error("❌ Error en la base de datos al insertar producto:", err);
    res.status(500).json({ error: err.message });
  }
});

// ACTUALIZAR PRODUCTO
app.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { precio, nombre, id_categoria } = req.body;
  try {
    await pool.query(
      "UPDATE productos SET nombre = $1, precio = $2, id_categoria = $3 WHERE id_producto = $4",
      [nombre, precio, id_categoria, id],
    );
    res.json("Producto actualizado");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ELIMINAR PRODUCTO
app.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM productos WHERE id_producto = $1", [id]);
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREAR PEDIDO
app.post("/pedidos", async (req, res) => {
  const { usuario_id, total, metodo, items } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const nuevoPedido = await client.query(
      "INSERT INTO pedidos (id_usuario, total, estado, metodo_pago, creado_en) VALUES ($1, $2, $3, $4, NOW()) RETURNING id_pedido AS id, total, estado, creado_en AS fecha",
      [usuario_id, total, "pendiente", metodo],
    );

    const pedidoId = nuevoPedido.rows[0].id;

    for (const item of items) {
      await client.query(
        "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)",
        [
          pedidoId,
          item.id,
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

// OBTENER PEDIDOS
app.get("/pedidos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_pedido AS id, id_usuario, estado, metodo_pago AS metodo, total, creado_en AS fecha 
      FROM pedidos ORDER BY id_pedido DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OBTENER PEDIDO POR ID (Corregido: dp.subtotal en lugar de dp.subtitle)
app.get("/pedidos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await pool.query(
      "SELECT id_pedido AS id, id_usuario, estado, metodo_pago AS metodo, total, creado_en AS fecha FROM pedidos WHERE id_pedido = $1",
      [id]
    );
    if (pedido.rows.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    const items = await pool.query(
      `SELECT p.nombre, dp.cantidad, dp.precio_unitario AS precio, dp.subtotal AS subtotal
       FROM detalle_pedido dp
       JOIN productos p ON dp.id_producto = p.id_producto
       WHERE dp.id_pedido = $1`,
      [id],
    );
    res.json({ ...pedido.rows[0], items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DASHBOARD
app.get("/dashboard", async (req, res) => {
  try {
    const ingresos = await pool.query(`SELECT COALESCE(SUM(total), 0) AS total FROM pedidos`);

    const pedidoActual = await pool.query(
      `SELECT COUNT(*) AS total FROM pedidos WHERE DATE(creado_en) = CURRENT_DATE`
    );

    const productos = await pool.query(`SELECT COUNT(*) AS total FROM productos`);

    const usuarios = await pool.query(`SELECT COUNT(*) AS total FROM usuarios`);

    const actividad = await pool.query(`
      SELECT id_pedido AS id, total, estado, creado_en AS fecha
      FROM pedidos
      ORDER BY creado_en DESC
      LIMIT 3
    `);

    const stockBajo = await pool.query(`
      SELECT id_producto AS id, nombre, imagen_principal AS imagen_url
      FROM productos
      ORDER BY id_producto DESC
      LIMIT 4
    `);

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

// LOGIN ADMIN
app.post("/login-admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminQuery = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );

    if (adminQuery.rows.length === 0) {
      return res.status(400).json({ message: "El administrador no existe" });
    }

    const admin = adminQuery.rows[0];
    const validarContraseña = await bcrypt.compare(password, admin.contrasena_hash);

    if (!validarContraseña) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      message: "Bienvenido admin",
      token: "un-token-seguro-jwt-aqui",
    });
  } catch (error) {
    console.error("🚨 Error real en /login-admin:", error);
    res.status(500).json({ message: "Error interno en el servidor: " + error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));