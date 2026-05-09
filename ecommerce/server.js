import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mainStore',
    password: 'Gladys2091@',
    port: 5432,
});

app.post('/registro', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await pool.query(
            'INSERT INTO usuarios(name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );
        res.json({ message: "Usuario creado", user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al registrarse: " + err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            const validatePassword = await bcrypt.compare(password, user.rows[0].password);
            if (validatePassword) {
                res.json({ message: 'Login Exitoso', user: user.rows[0] });
            } else {
                res.status(401).json({ error: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/productos', async (req, res) => {
    const { nombre, categoria, precio, imagen_url, descripcion } = req.body;
    try {
        const nuevoProduct = await pool.query(
            'INSERT INTO productos (nombre, categoria, precio, imagen_url, descripcion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, categoria, precio, imagen_url, descripcion]
        );
        res.json(nuevoProduct.rows[0]);
    } catch (err) {
        console.error("❌ Error en la base de datos al insertar producto:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { precio, nombre, categoria } = req.body;
    try {
        await pool.query(
            'UPDATE productos SET nombre = $1, precio = $2, categoria = $3 WHERE id = $4',
            [nombre, precio, categoria, id]
        );
        res.json('Producto actualizado');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/pedidos', async (req, res) => {
    const { usuario_id, nombre_cliente, total, metodo, items } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const nuevoPedido = await client.query(
            'INSERT INTO pedidos (usuario_id, nombre_cliente, total, estado, metodo, fecha) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
            [usuario_id, nombre_cliente, total, 'pendiente', metodo]
        );

        const pedidoId = nuevoPedido.rows[0].id;

        for (const item of items) {
            await client.query(
                'INSERT INTO detalle_pedidos (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5, $6)',
                [pedidoId, item.id, item.nombre, item.cantidad, item.precio, item.precio * item.cantidad]
            );
        }

        await client.query('COMMIT');
        res.json({ message: 'Pedido creado', pedido: nuevoPedido.rows[0] });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

app.get('/pedidos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await pool.query(
            'SELECT * FROM pedidos WHERE id = $1', [id]
        );
        if (pedido.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        const items = await pool.query(
            `SELECT nombre_producto AS nombre, cantidad, precio_unitario AS precio, subtotal
       FROM detalle_pedidos WHERE pedido_id = $1`, [id]
        );
        res.json({ ...pedido.rows[0], items: items.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
app.get('/dashboard', async (req, res) => {
  try {
    const ingresos = await pool.query(
      `SELECT COALESCE(SUM(total), 0) AS total FROM pedidos`
    );

    const pedidoActual = await pool.query(
      `SELECT COUNT(*) AS total FROM pedidos
       WHERE DATE(fecha) = CURRENT_DATE`
    );

    const productos = await pool.query(
      `SELECT COUNT(*) AS total FROM productos`
    );

    const usuarios = await pool.query(
      `SELECT COUNT(*) AS total FROM usuarios`
    );

    // ✅ actividad = últimos pedidos (no productos)
    const actividad = await pool.query(
      `SELECT id, nombre_cliente, total, estado, fecha
       FROM pedidos
       ORDER BY fecha DESC
       LIMIT 3`
    );

    // ✅ stockBajo = últimos 4 productos (faltaba)
    const stockBajo = await pool.query(
      `SELECT id, nombre, imagen_url
       FROM productos
       ORDER BY id DESC
       LIMIT 4`
    );

    res.json({
      ingresos:   Number(ingresos.rows[0].total),
      pedidosHoy: Number(pedidoActual.rows[0].total),
      productos:  Number(productos.rows[0].total),
      usuarios:   Number(usuarios.rows[0].total),
      actividad:  actividad.rows,   // ✅ pedidos
      stockBajo:  stockBajo.rows,   // ✅ productos
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));