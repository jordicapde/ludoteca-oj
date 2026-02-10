export const netejarText = (text) => {
  return text
    .normalize("NFD")                     // Separa l'accent de la lletra
    .replace(/[\u0300-\u036f]/g, "")      // Esborra els accents
    .replace(/[.,:;!?¡¿'"-]/g, "")        // Esborra signes de puntuació
    .toLowerCase()
    .trim()
}