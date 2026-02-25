import { defineStore } from "pinia"
import {getEstats, getJocs} from "../services/api.js";
import {crearJoc} from "../models/Joc.js";
import {crearDetallEstat} from "../models/DetallEstat.js";

export const useJocsStore = defineStore("jocs", {
  state: () => ({
    ludoteca: [],
    estats: [],

    // Control d'interfície
    carregant: false,
    error: null
  }),

  getters: {
    prestecsActius: (state) => state.ludoteca.filter(joc => joc.estaEnPrestec)
  },

  actions: {
    async inicialitzarDades(forcarRefresc = false) {
      if (this.ludoteca.length > 0 && !forcarRefresc) {
        if (this.carregant)
          console.log("Les dades s'estan carregant");
        else
          console.log("Les dades ja estan carregades a memòria");
        return;
      }

      // 1. Buscar a localStorage per tenir dades immediates
      if (this.ludoteca.length === 0) {
        const jocsGuardats = localStorage.getItem('ludoteca_jocs');
        const estatsGuardats = localStorage.getItem('ludoteca_estats');

        if (jocsGuardats) {
          // S'ha de reconstruir els objectes del localStorage
          const jocsReconstruits = JSON.parse(jocsGuardats).map(jocPla => {
            return crearJoc(jocPla);
          });

          this.ludoteca.splice(0, this.ludoteca.length, ...jocsReconstruits);
        }
        if (estatsGuardats) {
          const estatsReconstruits = JSON.parse(estatsGuardats).map(estatPla => {
            return crearDetallEstat(estatPla);
          });

          this.estats.splice(0, this.estats.length, ...estatsReconstruits);
        }

        if (this.ludoteca.length > 0) {
          this._assignarEstatsAJocs();
          console.log("Dades carregades des de localStorage");

          if (!forcarRefresc)
            return;
        }
      }

      // Invalidem atribut carregant per obtenir dades de manera silenciosa
      // this.carregant = true;
      this.error = null;

      // 2. Obtenir mentrestant la nova versió de les dades
      try {
        console.log("Iniciant sincronització de dades amb el servidor...")
        // Dispara les dues crides en paralel
        const [jocsData, estatsData] = await Promise.all([
          getJocs(),
          getEstats()
        ]);

        this.ludoteca = jocsData
        this.estats = estatsData
        console.log("Dades carregades correctament");
        localStorage.setItem('ludoteca_jocs', JSON.stringify(jocsData));
        localStorage.setItem('ludoteca_estats', JSON.stringify(estatsData));

        this._assignarEstatsAJocs();
        console.log("Estats assignats als jocs");

      } catch (e) {
        console.error("Error a inicialitzarDades:", e);
        this.error = e.message || "S'ha produït un error al connectar amb el servidor.";
      } finally {
        // this.carregant = false;
      }
    },

    _assignarEstatsAJocs() {
      // Per cada detall d'estat actiu
      this.estats.forEach(detall => {
        const joc = this.ludoteca.find(joc => joc.id === detall.idJoc);

        if (joc) {
          joc.detall = detall;
        } else {
          console.warn(`No s'ha trobat el joc amb ID ${detall.idJoc}`);
        }
      });
    }
  }
})