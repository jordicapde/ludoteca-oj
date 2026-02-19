export class Joc {
  constructor({ id, codi, nom, estat }) {
    this.id = id;
    this.codi = String(codi || '');
    this.nom = String(nom || 'Sense nom');

    const estatsValids = Object.keys(ESTAT_JOC);
    this.estat = estatsValids.includes(estat) ? ESTAT_JOC[estat] : ESTAT_JOC.DISPONIBLE;
    this.detall = null;
    this.metadata = null;
  }

  get esPotPrestar() {
    return this.estat === ESTAT_JOC.DISPONIBLE;
  }

  get estaEnPrestec() {
    return this.estat === ESTAT_JOC.PRESTEC;
  }
}

export const ESTAT_JOC = Object.freeze({
  DISPONIBLE: 'Disponible',
  PRESTEC: 'En préstec',
});

export const crearJoc = (dades) => new Joc(dades);