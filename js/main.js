// Importación de funciones para manejo de idioma y actualización de textos
import { getCurrentLang, setCurrentLang } from "./lang.js";
import { updateLanguage } from "./update-language.js";
//import "./scroll.js";

let postsOriginales = [];
let postsFiltrados = [];
let paginaActual = 1;
const postsPorPagina = 5;

let forzarRestaurarScroll = false;
let scrollAntesDeActualizar = 0;

// Al cargar el DOM, inicializa el idioma, carga los posts y configura el selector de idioma y búsqueda
document.addEventListener("DOMContentLoaded", () => {
  let currentLang = getCurrentLang();

  cargarPosts(currentLang);
  updateLanguage(currentLang);

  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "es" ? "en" : "es";
      setCurrentLang(currentLang);
      cargarPosts(currentLang);
      updateLanguage(currentLang);
    });
  }

  const inputBusqueda = document.getElementById("busqueda-posts");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", () => {
      const texto = inputBusqueda.value.toLowerCase();
      postsFiltrados = postsOriginales.filter(
        (post) =>
          post.title.toLowerCase().includes(texto) ||
          post.subtitle.toLowerCase().includes(texto) ||
          post.description.toLowerCase().includes(texto)
      );
      paginaActual = 1;
      mostrarPostsFiltrados(postsFiltrados);
    });
  }
});

/**
 * Carga los posts desde el archivo correspondiente al idioma seleccionado.
 * Intenta restaurar la página anterior si está guardada.
 */
function cargarPosts(idiomaSeleccionado) {
  const archivoPosts =
    idiomaSeleccionado === "es"
      ? "./posts/posts_es.json"
      : "./posts/posts_en.json";

  fetch(archivoPosts)
    .then((response) => response.json())
    .then((data) => {
      data.reverse(); // Invertir el orden de los posts
      postsOriginales = data;
      postsFiltrados = data;
      paginaActual = 1;
      // Restaurar la página si fue guardada anteriormente
      const paginaGuardada = localStorage.getItem("paginaAnterior");
      if (paginaGuardada) {
        paginaActual = parseInt(paginaGuardada);
        localStorage.removeItem("paginaAnterior");
      }
      mostrarPostsFiltrados(postsFiltrados);
    })
    .catch((error) => {
      console.error("Error cargando los posts:", error);
    });
}

/**
 * Muestra los posts correspondientes a la página actual y genera la paginación.
 * Guarda el número de página actual y configura el scroll al último post visitado.
 */
function mostrarPostsFiltrados(posts, scrollAlUltimo = false) {
  if (forzarRestaurarScroll) {
    scrollAntesDeActualizar = window.scrollY;
  }

  const contenedorEntradas = document.getElementById("contenedor-entradas");
  const paginacionSuperior = document.getElementById("paginacion-superior");
  const postsWrapper = document.getElementById("posts-wrapper");
  const paginacionInferior = document.getElementById("paginacion-inferior");

  let scrollTarget = null;
  const paginadoresExistentes =
    contenedorEntradas.querySelectorAll("div > div");
  const yaTienePaginacionSuperior =
    paginadoresExistentes.length > 0 &&
    paginadoresExistentes[0].contains(
      document.querySelector("a[href='javascript:void(0)']")
    );
  if (paginadoresExistentes.length > 1 && !yaTienePaginacionSuperior) {
    const ultimoPaginador =
      paginadoresExistentes[paginadoresExistentes.length - 1];
    scrollTarget = ultimoPaginador.getBoundingClientRect().top + window.scrollY;
  }

  if (paginacionSuperior) paginacionSuperior.innerHTML = "";
  if (postsWrapper) postsWrapper.innerHTML = "";
  if (paginacionInferior) paginacionInferior.innerHTML = "";

  agregarControlesPaginacion(posts, "top");

  const inicio = (paginaActual - 1) * postsPorPagina;
  const fin = inicio + postsPorPagina;
  const postsPagina = posts.slice(inicio, fin);

  // Crear y añadir cada post a la página actual
  postsPagina.forEach((post, index) => {
    const postCard = document.createElement("div");
    postCard.classList.add("card");
    postCard.id = `post-${post.id}`;

    //if (inicio + index === 0) postCard.setAttribute("data-scroll", "primer-post");
    //if (inicio + index === posts.length - 1) postCard.setAttribute("data-scroll", "ultimo-post");

    postCard.innerHTML = `
      <h2>${post.title}</h2>
      <h5>${post.subtitle}, ${post.date}</h5>
      <a href="./post.html?id=${post.id}&lang=${getCurrentLang()}#post-${
      post.id
    }" 
         class="post-link" 
         data-post-id="${post.id}"
         onclick="localStorage.setItem('lastVisitedPostId', '${post.id}')">
        <img class="fakeimg" src="${post.image}" alt="${post.alt}">
      </a>
      <p>${post.description}</p>
    `;
    // Incluye ancla para facilitar el scroll de regreso al post desde la vista individual

    if (postsWrapper) postsWrapper.appendChild(postCard);
  });

  agregarControlesPaginacion(posts);
  // Guardar en localStorage la página actual
  localStorage.setItem("paginaAnterior", paginaActual);

  if (scrollTarget !== null) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo({ top: scrollTarget, behavior: "auto" });
      }, 0);
    });
  }

  if (scrollAlUltimo) {
    const postsRenderizados = document.querySelectorAll(
      "#contenedor-entradas .card"
    );
    const ultimoPost = postsRenderizados[postsRenderizados.length - 1];
    if (ultimoPost) {
      const esSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const delay = esSafari ? 150 : 0;
      requestAnimationFrame(() => {
        setTimeout(() => {
          const y = ultimoPost.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, delay);
      });
    }
  }

  if (forzarRestaurarScroll) {
    window.scrollTo({ top: scrollAntesDeActualizar, behavior: "auto" });
    forzarRestaurarScroll = false;
  }
}

/**
 * Crea y añade los botones de paginación (izquierda, números, derecha).
 * Maneja estados activos, inactivos y navegación entre páginas.
 */
function agregarControlesPaginacion(posts, position = "bottom") {
  const totalPaginas = Math.ceil(posts.length / postsPorPagina);
  let contenedorPaginacion = null;

  if (position === "top") {
    contenedorPaginacion = document.getElementById("paginacion-superior");
  } else {
    contenedorPaginacion = document.getElementById("paginacion-inferior");
  }
  if (!contenedorPaginacion) return;

  const paginacion = document.createElement("div");
  paginacion.style.textAlign = "center";
  paginacion.style.marginTop = "1rem";
  /* Dynamic sizing and styling for pagination container: */
  paginacion.style.display = "inline-flex";
  paginacion.style.alignItems = "center";
  paginacion.style.flexWrap = "wrap";
  paginacion.style.margin = "1rem auto";
  paginacion.style.border = "1px solid #000";
  paginacion.style.borderRadius = "3px";
  paginacion.style.padding = "0.1rem";
  // paginacion.style.width = "100%"; // Removed to prevent stretching
  paginacion.style.width = "fit-content";
  paginacion.style.justifyContent = "center";
  paginacion.style.gap = "0.7rem";

  const btnIzquierda = document.createElement("a");
  const izquierdaImg = document.createElement("img");
  izquierdaImg.src =
    paginaActual === 1
      ? "./icon/scrollbar-left-deactivate.svg"
      : "./icon/scrollbar-left.svg";
  izquierdaImg.alt = "Página anterior";
  izquierdaImg.style.height = "26px";
  izquierdaImg.style.width = "22px";
  izquierdaImg.style.paddingTop = "0.2rem";
  izquierdaImg.style.marginLeft = "0.2rem";
  izquierdaImg.style.transition = "filter 0.2s";
  btnIzquierda.appendChild(izquierdaImg);
  btnIzquierda.setAttribute("href", "javascript:void(0)");
  btnIzquierda.style.cursor = paginaActual === 1 ? "default" : "pointer";
  btnIzquierda.style.pointerEvents = paginaActual === 1 ? "none" : "auto";
  btnIzquierda.setAttribute("tabindex", paginaActual === 1 ? "-1" : "0");
  btnIzquierda.onclick = () => {
    if (position === "bottom") forzarRestaurarScroll = true;
    if (paginaActual > 1) {
      paginaActual--;
      mostrarPostsFiltrados(postsFiltrados, position === "bottom");
    }
  };
  btnIzquierda.addEventListener("mouseover", () => {
    izquierdaImg.src = "./icon/scrollbar-left-active.svg";
  });
  btnIzquierda.addEventListener("mouseout", () => {
    izquierdaImg.src =
      paginaActual === 1
        ? "./icon/scrollbar-left-deactivate.svg"
        : "./icon/scrollbar-left.svg";
  });
  paginacion.appendChild(btnIzquierda);

  for (let i = 1; i <= totalPaginas; i++) {
    const btnPagina = document.createElement("a");
    btnPagina.setAttribute("href", "javascript:void(0)");
    const label = document.createElement("p");
    label.textContent = i;
    label.style.margin = "0";
    btnPagina.appendChild(label);
    btnPagina.style.textDecoration = "none";
    btnPagina.style.textAlign = "center";
    btnPagina.style.fontSize = "0.9rem";
    btnPagina.style.borderRadius = "0";
    btnPagina.style.cursor = "pointer";
    if (i === paginaActual) {
      label.style.fontWeight = "bold";
    } else {
      label.style.fontWeight = "normal";
      label.style.color = "#a4a4a4";
    }
    btnPagina.addEventListener("click", (e) => {
      e.preventDefault();
      if (position === "bottom") forzarRestaurarScroll = true;
      paginaActual = i;
      mostrarPostsFiltrados(postsFiltrados, position === "bottom");
    });
    paginacion.appendChild(btnPagina);
  }

  const btnDerecha = document.createElement("a");
  const derechaImg = document.createElement("img");
  derechaImg.src =
    paginaActual === totalPaginas
      ? "./icon/scrollbar-right-deactivate.svg"
      : "./icon/scrollbar-right.svg";
  derechaImg.alt = "Página siguiente";
  derechaImg.style.height = "26px";
  derechaImg.style.width = "22px";
  derechaImg.style.paddingTop = "0.2rem";
  derechaImg.style.marginRight = "0.2rem";
  derechaImg.style.transition = "filter 0.2s";
  btnDerecha.appendChild(derechaImg);
  btnDerecha.setAttribute("href", "javascript:void(0)");
  btnDerecha.style.cursor =
    paginaActual === totalPaginas ? "default" : "pointer";
  btnDerecha.style.pointerEvents =
    paginaActual === totalPaginas ? "none" : "auto";
  btnDerecha.setAttribute(
    "tabindex",
    paginaActual === totalPaginas ? "-1" : "0"
  );
  btnDerecha.onclick = () => {
    if (position === "bottom") forzarRestaurarScroll = true;
    if (paginaActual < totalPaginas) {
      paginaActual++;
      mostrarPostsFiltrados(postsFiltrados, position === "bottom");
    }
  };
  btnDerecha.addEventListener("mouseover", () => {
    derechaImg.src = "./icon/scrollbar-right-active.svg";
  });
  btnDerecha.addEventListener("mouseout", () => {
    derechaImg.src =
      paginaActual === totalPaginas
        ? "./icon/scrollbar-right-deactivate.svg"
        : "./icon/scrollbar-right.svg";
  });
  paginacion.appendChild(btnDerecha);

  contenedorPaginacion.appendChild(paginacion);
}
