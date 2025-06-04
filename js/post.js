import { translations } from './translations.js';  // Importar las traducciones

document.addEventListener("DOMContentLoaded", () => {
  // Obtener el idioma desde la URL (si no está presente, usar el valor de localStorage)
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  let currentLang = params.get("lang") || localStorage.getItem("lang") || "es"; // Por defecto 'es' si no se encuentra

  // Determinar el archivo JSON según el idioma seleccionado
  const archivoPosts = currentLang === 'es' ? './posts/posts_es.json' : './posts/posts_en.json';

  if (!id) {
    document.getElementById("entrada-post").innerHTML =
      "<p>Error: no se especificó ningún post.</p>";
    return;
  }

  fetch(archivoPosts)
    .then((response) => response.json())
    .then((posts) => {
      const post = posts.find((post) => post.id === id);

      if (post) {
        const contenedorPost = document.getElementById("entrada-post");

        // Agregar los datos básicos del post
        contenedorPost.innerHTML = `
          <h2>${post.title}</h2>
          <h5>${post.subtitle}, ${post.date}</h5>
          <a href="#" target="_self" rel="noopener noreferrer">
            <img class="fakeimg" src="${post.image}" alt="${post.alt}">
          </a>
          <p><b>${post.description}</b></p>
        `;

        // Recorrer el array 'content' y agregar cada fragmento de HTML
        post.content.forEach((paragraph) => {
          // Se agrega cada fragmento del array 'content' al contenedor
          contenedorPost.innerHTML += paragraph;
        });

        // Actualizar los textos de la UI según el idioma
        updateLanguage(currentLang);
      } else {
        document.getElementById("entrada-post").innerHTML =
          "<p>Post no encontrado.</p>";
      }
    })
    .catch((error) => {
      console.error("Error cargando el post:", error);
      document.getElementById("entrada-post").innerHTML =
        "<p>Error al cargar el post.</p>";
    });
});

// Función para actualizar la UI con el idioma seleccionado
function updateLanguage(currentLang) {
  // Asegurarse de que translations esté disponible
  if (!translations[currentLang]) {
    console.error("No translations found for the language: " + currentLang);
    return;
  }

  // Cambiar el título principal de la página
  const pageTitle = document.querySelector("title");
  if (pageTitle) pageTitle.textContent = translations[currentLang].title;

  // Aquí puedes actualizar otros elementos de la UI, si lo necesitas, como el título de la página, subtítulos, etc.
  // Ejemplo:
  const footerInfo = document.querySelector(".informacion-footer h2");
  if (footerInfo) footerInfo.textContent = translations[currentLang].footerInfo;
}