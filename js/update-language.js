import { translations } from './translations.js'; // Importar las traducciones

function updateLanguage(currentLang) {
  if (!translations[currentLang]) {
    console.error("No translations found for language:", currentLang);
    return;
  }

  const mainTitle = document.querySelector(".title");
  if (mainTitle) mainTitle.textContent = translations[currentLang].title;

  const headerSubtitle = document.querySelector(".header h2");
  if (headerSubtitle) headerSubtitle.textContent = translations[currentLang].subtitle;

  const studentTitle = document.getElementById("student-title");
  if (studentTitle) studentTitle.textContent = translations[currentLang].studentTitle;

  const aboutMeCard = document.querySelectorAll(".rightcolumn .card h3")[0];
  if (aboutMeCard) aboutMeCard.textContent = translations[currentLang].aboutMe;

  const cvLink = document.querySelector('a[href="https://kamatxo.github.io/Curriculum-Vitae/"] p');
  if (cvLink) cvLink.textContent = translations[currentLang].cv;

  const githubLink = document.querySelector('a[href="https://github.com/Kamatxo?tab=repositories"] p');
  if (githubLink) githubLink.textContent = translations[currentLang].github;

  const popularPostsCard = document.querySelectorAll(".rightcolumn .card h3")[1];
  if (popularPostsCard) popularPostsCard.textContent = translations[currentLang].popularPosts;

  const latestPostCard = document.querySelectorAll(".rightcolumn .card h3")[2];
  if (latestPostCard) latestPostCard.textContent = translations[currentLang].latestPost;

  const footerInfo = document.querySelector(".informacion-footer h2");
  if (footerInfo) footerInfo.textContent = translations[currentLang].footerInfo;

  const footerTheme = document.querySelector(".informacion-footer a h4");
  if (footerTheme) footerTheme.textContent = translations[currentLang].footerTheme;
}

export { updateLanguage };