/* ============ TEMPORIZADORES (múltiples) ============ */

const temporizadores = document.querySelectorAll('.temporizador');

/* Crear los mensajes de estado si todavía no existen */
function prepararMensajes(contador) {
    if (!contador.querySelector('.evento-en-marcha')) {
        const mensajeMarcha = document.createElement('div');

        mensajeMarcha.className = 'evento-en-marcha';
        mensajeMarcha.innerHTML =
            '<i class="fa-solid fa-circle-play"></i> EVENTO EN MARCHA';

        contador.appendChild(mensajeMarcha);
    }

    if (!contador.querySelector('.evento-realizado')) {
        const mensajeFinal = document.createElement('div');

        mensajeFinal.className = 'evento-realizado';
        mensajeFinal.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> EVENTO REALIZADO';

        contador.appendChild(mensajeFinal);
    }
}

/* Mostrar que el evento está en marcha */
function iniciarEvento(contador) {
    prepararMensajes(contador);

    contador.classList.add('en-marcha');
    contador.classList.remove('finalizado');

    // El botón sigue habilitado durante el evento.
    // No se modifica el cronograma ni su data-modal.
}

/* Finalizar el evento a medianoche del día siguiente */
function finalizarEvento(contador) {
    if (contador.classList.contains('finalizado')) {
        return;
    }

    prepararMensajes(contador);

    contador.classList.remove('en-marcha');
    contador.classList.add('finalizado');

    const tarjeta = contador.closest('.evento-card');
    const boton = tarjeta?.querySelector('.evento-btn-cronograma');

    if (boton) {
        boton.disabled = true;
        boton.removeAttribute('data-modal');

        boton.innerHTML =
            '<i class="fa-solid fa-lock"></i> Cronograma cerrado';

        boton.setAttribute(
            'aria-label',
            'Cronograma cerrado: evento realizado'
        );
    }
}

/* Actualizar todos los contadores */
function actualizarTodos() {
    const ahora = new Date();

    temporizadores.forEach(contador => {
        const fechaInicio = new Date(contador.dataset.fecha);

        // Si la fecha no es válida, no procesar esta tarjeta.
        if (Number.isNaN(fechaInicio.getTime())) {
            console.error(
                'Fecha no válida en el temporizador:',
                contador.dataset.fecha
            );
            return;
        }

        // El evento termina a las 00:00 del día siguiente.
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + 1);
        fechaFin.setHours(0, 0, 0, 0);

        // ESTADO 3: el evento ya terminó.
        if (ahora >= fechaFin) {
            finalizarEvento(contador);
            return;
        }

        // ESTADO 2: el evento está en marcha.
        if (ahora >= fechaInicio) {
            iniciarEvento(contador);
            return;
        }

        // ESTADO 1: el evento todavía no comienza.
        contador.classList.remove('en-marcha', 'finalizado');

        const boton = contador
            .closest('.evento-card')
            ?.querySelector('.evento-btn-cronograma');

        // Mantener habilitado el botón antes del evento.
        if (boton && boton.innerHTML.includes('Cronograma cerrado')) {
            boton.disabled = false;
            boton.innerHTML =
                '<i class="fa-solid fa-calendar-days"></i> Ver Cronograma';
            boton.removeAttribute('aria-label');
        }

        const distancia = fechaInicio.getTime() - ahora.getTime();

        const dias = Math.floor(
            distancia / (1000 * 60 * 60 * 24)
        );

        const horas = Math.floor(
            (distancia % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutos = Math.floor(
            (distancia % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const segundos = Math.floor(
            (distancia % (1000 * 60)) / 1000
        );

        const diasEl = contador.querySelector('[data-temp="dias"]');
        const horasEl = contador.querySelector('[data-temp="horas"]');
        const minutosEl = contador.querySelector('[data-temp="minutos"]');
        const segundosEl = contador.querySelector('[data-temp="segundos"]');

        if (diasEl) diasEl.textContent = String(dias).padStart(2, '0');
        if (horasEl) horasEl.textContent = String(horas).padStart(2, '0');
        if (minutosEl) minutosEl.textContent = String(minutos).padStart(2, '0');
        if (segundosEl) segundosEl.textContent = String(segundos).padStart(2, '0');
    });
}

/* Ejecutar al cargar y actualizar cada segundo */
actualizarTodos();
setInterval(actualizarTodos, 1000);


// ============ MODALES (múltiples) ============
const botonesAbrir = document.querySelectorAll('[data-modal]');
const botonesCerrar = document.querySelectorAll('[data-cerrar]');
const overlays = document.querySelectorAll('.modal-overlay');

botonesAbrir.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.modal;
        document.getElementById(id).classList.add('activo');
    });
});

botonesCerrar.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal-overlay').classList.remove('activo');
    });
});

overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('activo');
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        overlays.forEach(o => o.classList.remove('activo'));
    }
});

// ============ CARRUSEL DE HISTORIAS ============
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('carruselDots');
const btnPrev = document.getElementById('prevHistoria');
const btnNext = document.getElementById('nextHistoria');

let slideActual = 0;

// Crear dots
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('activo');
    dot.addEventListener('click', () => irASlide(i));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function irASlide(indice) {
    slides[slideActual].classList.remove('activa');
    dots[slideActual].classList.remove('activo');

    slideActual = (indice + slides.length) % slides.length;

    slides[slideActual].classList.add('activa');
    dots[slideActual].classList.add('activo');
}

function siguiente() { irASlide(slideActual + 1); }
function anterior()  { irASlide(slideActual - 1); }

btnNext.addEventListener('click', siguiente);
btnPrev.addEventListener('click', anterior);

// Autoplay cada 6 segundos
let autoplay = setInterval(siguiente, 6000);

// Pausar autoplay al pasar el mouse
const carrusel = document.querySelector('.carrusel');
carrusel.addEventListener('mouseenter', () => clearInterval(autoplay));
carrusel.addEventListener('mouseleave', () => {
    autoplay = setInterval(siguiente, 6000);
});

// Mostrar el primero
slides[0].classList.add('activa');