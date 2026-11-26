const IMAGEN_POR_DEFECTO = 'img/sin-imagen.jpg';
const CLAVE_TEMA = 'recetario_tema';

const btnTema = document.getElementById('btn-tema');
const formReceta = document.getElementById('form-receta');
const tituloForm = document.getElementById('titulo-form');
const inputNombre = document.getElementById('nombre');
const selectCategoria = document.getElementById('categoria');
const inputTiempo = document.getElementById('tiempo');
const inputImagen = document.getElementById('imagen');
const inputPreparacion = document.getElementById('preparacion');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const parrafoMensaje = document.getElementById('mensaje');
const parrafoContador = document.getElementById('contador');
const filtroCategoria = document.getElementById('filtro-categoria');
const listaRecetas = document.getElementById('lista-recetas');

let recetas = [];
let idEditando = null;

function aplicarTema(esOscuro) {
  document.body.classList.toggle('oscuro', esOscuro);
  btnTema.textContent = esOscuro ? 'Modo claro' : 'Modo oscuro';
  localStorage.setItem(CLAVE_TEMA, esOscuro ? 'oscuro' : 'claro');
}

function cargarTemaInicial() {
  const guardado = localStorage.getItem(CLAVE_TEMA);
  aplicarTema(guardado === 'oscuro');
}

function mostrarMensaje(texto) {
  parrafoMensaje.textContent = texto;
}

function limpiarFormulario() {
  idEditando = null;
  formReceta.reset();
  tituloForm.textContent = 'Agregar receta';
  btnGuardar.textContent = 'Guardar';
  btnCancelar.hidden = true;
}

function llenarFormularioParaEditar(receta) {
  idEditando = receta.id;
  inputNombre.value = receta.nombre || '';
  selectCategoria.value = receta.categoria || 'Entrada';
  inputTiempo.value = receta.tiempo ?? '';
  inputImagen.value = receta.imagen || '';
  inputPreparacion.value = receta.preparacion || '';
  tituloForm.textContent = 'Editar receta';
  btnGuardar.textContent = 'Actualizar';
  btnCancelar.hidden = false;
  mostrarMensaje('');
  inputNombre.focus();
}

function crearTarjetaReceta(receta) {
  const li = document.createElement('li');
  li.className = 'tarjeta-receta';

  const img = document.createElement('img');
  const urlLimpia = typeof receta.imagen === 'string' ? receta.imagen.trim() : '';
  img.src = urlLimpia !== '' ? urlLimpia : IMAGEN_POR_DEFECTO;
  img.alt = receta.nombre || 'Receta';
  img.addEventListener('error', () => {
    if (img.src !== new URL(IMAGEN_POR_DEFECTO, window.location.href).href) {
      img.src = IMAGEN_POR_DEFECTO;
    }
  });

  const cuerpo = document.createElement('div');
  cuerpo.className = 'cuerpo-tarjeta';

  const h3 = document.createElement('h3');
  h3.textContent = receta.nombre;

  const pCategoria = document.createElement('p');
  pCategoria.textContent = `Categoría: ${receta.categoria}`;

  const pTiempo = document.createElement('p');
  pTiempo.textContent = `Tiempo: ${receta.tiempo} min`;

  const pPreparacion = document.createElement('p');
  pPreparacion.textContent = receta.preparacion || '';

  const acciones = document.createElement('div');
  acciones.className = 'acciones-tarjeta';

  const btnEditar = document.createElement('button');
  btnEditar.type = 'button';
  btnEditar.textContent = 'Editar';
  btnEditar.addEventListener('click', () => llenarFormularioParaEditar(receta));

  const btnEliminar = document.createElement('button');
  btnEliminar.type = 'button';
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.addEventListener('click', () => eliminarReceta(receta.id));

  acciones.append(btnEditar, btnEliminar);
  cuerpo.append(h3, pCategoria, pTiempo, pPreparacion, acciones);
  li.append(img, cuerpo);

  return li;
}

function renderizarRecetas() {
  const categoriaElegida = filtroCategoria.value;
  const filtradas =
    categoriaElegida === 'Todas'
      ? recetas
      : recetas.filter((r) => r.categoria === categoriaElegida);

  listaRecetas.textContent = '';

  for (const receta of filtradas) {
    listaRecetas.appendChild(crearTarjetaReceta(receta));
  }

  const cantidad = filtradas.length;
  parrafoContador.textContent =
    cantidad === 1 ? '1 receta visible' : `${cantidad} recetas`;
}

async function cargarRecetas() {
  try {
    const respuesta = await fetch('/api/recetas');
    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar las recetas.');
    }
    recetas = await respuesta.json();
    renderizarRecetas();
  } catch (error) {
    mostrarMensaje(error.message);
  }
}

async function guardarReceta(evento) {
  evento.preventDefault();

  const datos = {
    nombre: inputNombre.value.trim(),
    categoria: selectCategoria.value,
    tiempo: Number(inputTiempo.value),
    imagen: inputImagen.value.trim(),
    preparacion: inputPreparacion.value.trim()
  };

  const esEdicion = idEditando !== null;
  const url = esEdicion ? `/api/recetas/${idEditando}` : '/api/recetas';
  const metodo = esEdicion ? 'PUT' : 'POST';

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const cuerpo = respuesta.status === 204 ? null : await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(cuerpo && cuerpo.error ? cuerpo.error : 'Error al guardar.');
      return;
    }

    await cargarRecetas();
    limpiarFormulario();
    mostrarMensaje(esEdicion ? 'Receta actualizada.' : 'Receta guardada.');
  } catch {
    mostrarMensaje('Error de conexión con el servidor.');
  }
}

async function eliminarReceta(id) {
  try {
    const respuesta = await fetch(`/api/recetas/${id}`, {
      method: 'DELETE'
    });

    if (!respuesta.ok && respuesta.status !== 204) {
      const cuerpo = await respuesta.json().catch(() => ({}));
      mostrarMensaje(cuerpo.error || 'No se pudo eliminar la receta.');
      return;
    }

    if (idEditando === id) {
      limpiarFormulario();
    }

    await cargarRecetas();
    mostrarMensaje('Receta eliminada.');
  } catch {
    mostrarMensaje('Error de conexión con el servidor.');
  }
}

btnTema.addEventListener('click', () => {
  const estaOscuro = document.body.classList.contains('oscuro');
  aplicarTema(!estaOscuro);
});

filtroCategoria.addEventListener('change', renderizarRecetas);
formReceta.addEventListener('submit', guardarReceta);
btnCancelar.addEventListener('click', () => {
  limpiarFormulario();
  mostrarMensaje('');
});

cargarTemaInicial();
cargarRecetas();