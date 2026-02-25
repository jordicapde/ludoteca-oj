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

  get estaDisponible() {
    return this.estat === ESTAT_JOC.DISPONIBLE;
  }

  get estaEnPrestec() {
    return this.estat === ESTAT_JOC.PRESTEC;
  }

  get estatToString() {
    switch (this.estat) {
      case ESTAT_JOC.PRESTEC:
        return 'En préstec';
      case ESTAT_JOC.DISPONIBLE:
      default:
        return 'Disponible';
    }
  }
}

export const ESTAT_JOC = Object.freeze({
  DISPONIBLE: 'DISPONIBLE',
  PRESTEC: 'PRESTEC',
});

export const crearJoc = (dades) => new Joc(dades);