# Recetario de la clase

**Autor:** Ariel Vique · **Fecha:** 01/12/2026

Aplicación web full-stack para gestionar recetas (crear, listar, filtrar por categoría, editar y eliminar) con persistencia en SQLite y una interfaz web responsive. Permite alternar entre modo claro y modo oscuro y maneja imágenes por URL con respaldo local.

**URL pública:** 

## Tecnologías

HTML, CSS, JavaScript, Node.js 22.x (22.13 o superior), Express y SQLite.

## Cómo ejecutarlo

1. Instalar Node.js 22.13 o superior.
2. `npm install`
3. `npm start`
4. Abrir http://localhost:3000

## Estructura de carpetas

- `server.js`: servidor Express, validación de datos y rutas de la API REST.
- `db.js`: conexión a SQLite, creación de la tabla `recetas` y carga inicial de ejemplo.
- `recetas.db`: base de datos local SQLite (generada al ejecutar y excluida de Git).
- `package.json`: configuración del proyecto, dependencias y scripts (`start`).
- `.gitignore`: archivos y carpetas ignorados por Git (como `node_modules` y `*.db`).
- `README.md`: documentación principal del proyecto.
- `docs/topologia.md`: documentación de la topología y flujo del sistema.
- `public/index.html`: estructura HTML5 del formulario y listado de recetas.
- `public/css/estilos.css`: estilos, variables de tema, grilla y diseño responsive.
- `public/js/app.js`: lógica de interfaz, consumo de la API, filtros y persistencia de tema.
- `public/img/logo.jpg`: imagen del encabezado de la aplicación.
- `public/img/sin-imagen.jpg`: imagen por defecto cuando falta o falla la URL de una receta.

## API

| Método | Ruta | Qué hace | Respuesta |
| --- | --- | --- | --- |
| GET | /api/recetas | Lista todas las recetas ordenadas de la más nueva a la más antigua | `200` con array JSON de recetas |
| POST | /api/recetas | Valida y crea una nueva receta | `201` con la receta creada o `400` con `{ "error": "..." }` |
| PUT | /api/recetas/:id | Valida y actualiza una receta existente por ID | `200` con la receta actualizada, `400` o `404` |
| DELETE | /api/recetas/:id | Elimina una receta por ID | `204` sin contenido o `404` |

## Topología

Ver [docs/topologia.md](docs/topologia.md).

## Relación con el proyecto modelo

Se tomó como referencia la estructura general cliente-servidor con Express, SQLite y API REST del modelo «Libros recomendados», adaptando el dominio a recetas, aplicando las reglas de validación propias y programando la interfaz y la lógica del frontend con una distribución propia.

## Imágenes

- `public/img/logo.jpg`: generada con IA para el encabezado del proyecto.
- `public/img/sin-imagen.jpg`: generada con IA como imagen por defecto ante ausencia o error de carga.
- Receta precargada de torta frita: imagen por URL externa desde Wikimedia Commons (`https://upload.wikimedia.org/wikipedia/commons/7/7f/TortaFrita.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original`)