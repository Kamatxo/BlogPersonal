// Función para cargar las publicaciones populares
export function cargarPostsContainer(currentLang) {
  const archivoPosts = currentLang === 'es' ? './posts/posts_es.json' : './posts/posts_en.json';

  fetch(archivoPosts)
    .then((response) => response.json())
    .then((posts) => {
      const postsContainer = document.getElementById("posts-container");
      postsContainer.innerHTML = ""; // Limpiar antes de volver a agregar los posts
      const popularPosts = posts.slice(1, 4); // Primeros tres

      popularPosts.forEach((post) => {
        const postDiv = document.createElement("p");
        const postLink = document.createElement("a");
        postLink.href = `./post.html?id=${post.id}&lang=${currentLang}`;
        postLink.textContent = post.title.charAt(0).toUpperCase() + post.title.slice(1).toLowerCase();
        postDiv.appendChild(postLink);
        postsContainer.appendChild(postDiv);
      });
    })
    .catch((error) => {
      console.error("Error al cargar los posts:", error);
    });
}