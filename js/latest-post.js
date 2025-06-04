// Función para cargar la última publicación
export function cargarUltimaPublicacion(currentLang) {
  const archivoPosts = currentLang === 'es' ? './posts/posts_es.json' : './posts/posts_en.json';

  fetch(archivoPosts)
    .then((response) => response.json())
    .then((posts) => {
      const latestPostContainer = document.getElementById("latest-post");
      latestPostContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar el nuevo post
      const latestPost = posts[posts.length - 1]; // Último post

      const latestPostDiv = document.createElement("p");
      const postLink = document.createElement("a");
      postLink.href = `./post.html?id=${latestPost.id}&lang=${currentLang}`;
      postLink.textContent = latestPost.title.charAt(0).toUpperCase() + latestPost.title.slice(1).toLowerCase();
      latestPostDiv.appendChild(postLink);
      latestPostContainer.appendChild(latestPostDiv);
    })
    .catch((error) => {
      console.error("Error al cargar el último post:", error);
    });
}