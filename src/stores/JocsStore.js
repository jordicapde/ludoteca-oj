import { defineStore } from "pinia"
import {getEstats, getJocs} from "../services/api.js";

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

      this.carregant = true;
      this.error = null;

      try {
        console.log("Iniciant càrrega de dades...")
        // Dispara les dues crides en paralel
        const [jocsData, estatsData] = await Promise.all([
          getJocs(),
          getEstats()
        ]);

        this.ludoteca = jocsData
        this.estats = estatsData
        console.log("Dades carregades correctament");

        this._assignarEstatsAJocs();
        console.log("Estats assignats als jocs");

      } catch (e) {
        console.error("Error a inicialitzarDades:", e);
        this.error = e.message || "S'ha produït un error al connectar amb el servidor.";
      } finally {
        this.carregant = false;
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