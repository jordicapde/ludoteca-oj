export class Joc {
  constructor({ id, nom, estat }) {
    this.id = String(id || '');
    this.nom = String(nom || 'Sense nom');

    const estatsValids = Object.values(ESTAT_JOC);
    this.estat = estatsValids.includes(estat) ? estat : ESTAT_JOC.DISPONIBLE;
  }

  get esPotPrestar() {
    return this.estat === ESTAT_JOC.DISPONIBLE;
  }
}

export const ESTAT_JOC = Object.freeze({
  DISPONIBLE: 'Disponible',
  PRESTAT: 'En préstec',
});

export const crearJoc = (dades) => new Joc(dades);