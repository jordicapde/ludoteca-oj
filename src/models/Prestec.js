export class Prestec {
  constructor({ idPrestec, idJoc, nomSoci, dataInici, dataFi = null }) {
    this.idPrestec = Number(idPrestec || 0);
    this.idJoc = String(idJoc || '');
    this.nomSoci = String(nomSoci || 'Anònim');
    this.dataInici = dataInici ? new Date(dataInici) : new Date();
    this.dataFi = dataFi ? new Date(dataFi) : null;
  }

  get estaActiu() {
    return this.dataFi === null;
  }

  get diesDePrestec() {
    const ara = new Date();
    const diferencia = ara - this.dataInici;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

  get dataIniciFormatada() {
    return this.dataInici.toLocaleDateString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export const crearPrestec = (dades) => new Prestec(dades);