const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const db = new DatabaseSync(path.join(__dirname, 'recetas.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS recetas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    tiempo INTEGER NOT NULL,
    imagen TEXT,
    preparacion TEXT
  )
`);

const total = db.prepare('SELECT COUNT(*) AS cantidad FROM recetas').get();

if (total.cantidad === 0) {
  const insertar = db.prepare(`
    INSERT INTO recetas (nombre, categoria, tiempo, imagen, preparacion)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertar.run(
    'Torta frita',
    'Postre',
    30,
    'https://upload.wikimedia.org/wikipedia/commons/7/7f/TortaFrita.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
    'Harina, grasa, sal y agua.'
  );

  insertar.run(
    'Agua con limón',
    'Bebida',
    5,
    '',
    'Exprimir limón en agua fría y servir.'
  );
}

module.exports = db;