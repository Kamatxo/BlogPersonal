import { getCurrentLang, setCurrentLang } from './lang.js';
//import { translations } from './translations.js';
import { updateLanguage } from './update-language.js'; // Asumiendo que separaste esta función (opcional)

import { cargarPostsContainer } from './posts-container.js';
import { cargarUltimaPublicacion } from './latest-post.js';

document.addEventListener("DOMContentLoaded", () => {
  let currentLang = getCurrentLang();

  const langToggle = document.getElementById("lang-toggle");

  const updateLangLabel = (lang) => {
    if (langToggle) {
      langToggle.textContent = lang === "es" ? "EN" : "ES";
      langToggle.title = lang === "es" ? "Switch language" : "Cambiar idioma";
    }
  };

  updateLanguage(currentLang);
  cargarPostsContainer(currentLang);
  cargarUltimaPublicacion(currentLang);
  updateLangLabel(currentLang);

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "es" ? "en" : "es";
      setCurrentLang(currentLang);

      updateLanguage(currentLang);
      cargarPostsContainer(currentLang);
      cargarUltimaPublicacion(currentLang);
      updateLangLabel(currentLang);
    });
  }
});