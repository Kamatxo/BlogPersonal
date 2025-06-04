// lang.js

// Detecta idioma del navegador (ej: "es-ES", "en-US", etc.)
const browserLang = navigator.language || navigator.userLanguage;
const isSpanish = browserLang.startsWith("es");

//console.log(navigator.language);

// Intenta obtener el idioma guardado en localStorage
let storedLang = localStorage.getItem("lang");

// Si no hay idioma guardado, se establece según el idioma del navegador
let currentLang = storedLang || (isSpanish ? "es" : "en");

// Guardamos el idioma detectado si no estaba ya guardado
if (!storedLang) {
  localStorage.setItem("lang", currentLang);
}

// Función para obtener el idioma actual
function getCurrentLang() {
  return currentLang;
}

// Función para establecer el idioma manualmente
function setCurrentLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
}

export { getCurrentLang, setCurrentLang };