export const netejarText = (text) => {
  return text
    .normalize("NFD")                     // Separa l'accent de la lletra
    .replace(/[\u0300-\u036f]/g, "")      // Esborra els accents
    .replace(/[.,:;!?¡¿'"-]/g, "")        // Esborra signes de puntuació
    .toLowerCase()
    .trim()
}

export const scrollToInput = (event) => {
  // Esperar perquè el teclat virtual tingui temps d'obrir-se
  setTimeout(() => {
    event.target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 300);
}