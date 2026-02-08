// src/models/Joc.js

export class Joc {
  constructor({ id, nom }) {
    this.id = String(id || '');
    this.nom = String(nom || 'Sense nom');
  }
}

export const crearJoc = (dades) => new Joc(dades);