const express = require('express');
const path = require('node:path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const CATEGORIAS_VALIDAS = ['Entrada', 'Plato principal', 'Postre', 'Bebida'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function validarReceta(body) {
  if (!body || typeof body !== 'object') {
    return 'Datos invalidos.';
  }

  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  if (!nombre || nombre.length > 80) {
    return 'El nombre es obligatorio y debe tener hasta 80 caracteres.';
  }

  const categoria = typeof body.categoria === 'string' ? body.categoria.trim() : '';
  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
    return 'La categoria debe ser Entrada, Plato principal, Postre o Bebida.';
  }

  const tiempo = Number(body.tiempo);
  if (!Number.isInteger(tiempo) || tiempo < 1 || tiempo > 600) {
    return 'El tiempo debe ser un numero entero entre 1 y 600.';
  }

  const imagen = typeof body.imagen === 'string' ? body.imagen.trim() : '';
  if (imagen !== '' && !/^https?:\/\//i.test(imagen)) {
    return 'La imagen debe comenzar con http:// o https://.';
  }

  const preparacion = typeof body.preparacion === 'string' ? body.preparacion.trim() : '';
  if (preparacion.length > 500) {
    return 'La preparacion debe tener hasta 500 caracteres.';
  }

  return null;
}

app.get('/api/recetas', (req, res) => {
  const recetas = db.prepare('SELECT * FROM recetas ORDER BY id DESC').all();
  res.status(200).json(recetas);
});

app.post('/api/recetas', (req, res) => {
  const error = validarReceta(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const nombre = req.body.nombre.trim();
  const categoria = req.body.categoria.trim();
  const tiempo = Number(req.body.tiempo);
  const imagen = typeof req.body.imagen === 'string' ? req.body.imagen.trim() : '';
  const preparacion = typeof req.body.preparacion === 'string' ? req.body.preparacion.trim() : '';

  const info = db
    .prepare(
      `INSERT INTO recetas (nombre, categoria, tiempo, imagen, preparacion)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(nombre, categoria, tiempo, imagen, preparacion);

  const creada = db.prepare('SELECT * FROM recetas WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(creada);
});

app.put('/api/recetas/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID invalido.' });
  }

  const existente = db.prepare('SELECT * FROM recetas WHERE id = ?').get(id);
  if (!existente) {
    return res.status(404).json({ error: 'Receta no encontrada.' });
  }

  const error = validarReceta(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const nombre = req.body.nombre.trim();
  const categoria = req.body.categoria.trim();
  const tiempo = Number(req.body.tiempo);
  const imagen = typeof req.body.imagen === 'string' ? req.body.imagen.trim() : '';
  const preparacion = typeof req.body.preparacion === 'string' ? req.body.preparacion.trim() : '';

  db.prepare(
    `UPDATE recetas
     SET nombre = ?, categoria = ?, tiempo = ?, imagen = ?, preparacion = ?
     WHERE id = ?`
  ).run(nombre, categoria, tiempo, imagen, preparacion, id);

  const actualizada = db.prepare('SELECT * FROM recetas WHERE id = ?').get(id);
  res.status(200).json(actualizada);
});

app.delete('/api/recetas/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID invalido.' });
  }

  const existente = db.prepare('SELECT id FROM recetas WHERE id = ?').get(id);
  if (!existente) {
    return res.status(404).json({ error: 'Receta no encontrada.' });
  }

  db.prepare('DELETE FROM recetas WHERE id = ?').run(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});