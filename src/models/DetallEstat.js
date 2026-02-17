import {ESTAT_JOC} from "./Joc.js";

export class DetallEstat {
  constructor({ tipus, idJoc, ...dadesExtra }) {
    // Atributs comuns
    this.idJoc = idJoc;
    const tipusValids = Object.keys(ESTAT_JOC);
    this.tipus = tipusValids.includes(tipus) ? ESTAT_JOC[tipus] : ESTAT_JOC.DISPONIBLE;

    switch (this.tipus) {
      case ESTAT_JOC.PRESTEC:
        this.idPrestec = dadesExtra.idPrestec;
        this.nomSoci = dadesExtra.nomSoci;
        this.dataInici = new Date(dadesExtra.dataInici);
        break;
    }
  }
}

export const crearDetallEstat = (dades) => new DetallEstat(dades);