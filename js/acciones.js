function back(){
    // // Obtener el idioma actual desde localStorage
    // let currentLang_action = localStorage.getItem("lang") || "es"; // Obtener el idioma actual desde localStorage
    
    // // Asegurarse de que el idioma esté correctamente guardado
    // localStorage.setItem("lang", currentLang_action);
    
    // window.location.href = "../index.html"; // Redirigir a la página principal
    window.history.back();
}