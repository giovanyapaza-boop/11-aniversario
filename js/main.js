// ============ TEMPORIZADORES (múltiples) ============
const temporizadores = document.querySelectorAll('.temporizador');

function actualizarTodos() {
    const ahora = new Date().getTime();

    temporizadores.forEach(cont => {
        const fecha = new Date(cont.dataset.fecha).getTime();
        const distancia = fecha - ahora;

        const diasEl     = cont.querySelector('[data-temp="dias"]');
        const horasEl    = cont.querySelector('[data-temp="horas"]');
        const minutosEl  = cont.querySelector('[data-temp="minutos"]');
        const segundosEl = cont.querySelector('[data-temp="segundos"]');

        if (distancia < 0) {
            diasEl.textContent = '00';
            horasEl.textContent = '00';
            minutosEl.textContent = '00';
            segundosEl.textContent = '00';
            return;
        }

        const dias     = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas    = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos  = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        diasEl.textContent     = String(dias).padStart(2, '0');
        horasEl.textContent    = String(horas).padStart(2, '0');
        minutosEl.textContent  = String(minutos).padStart(2, '0');
        segundosEl.textContent = String(segundos).padStart(2, '0');
    });
}

setInterval(actualizarTodos, 1000);
actualizarTodos();


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