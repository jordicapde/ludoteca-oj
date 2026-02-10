import { crearJoc } from '../models/Joc.js';
import {crearPrestec} from "../models/Prestec.js";

const API_URL = 'https://script.google.com/macros/s/AKfycbyA0pDGfmI7G_5KkZYE2Fp0c-O11KnFGyouNspe_nGH1dt5aysx5Vh3zqjzfgz_-tPm/exec'

export const getJocs = async () => {
  try {
    const response = await fetch(`${API_URL}?action=getJocs`);
    const json = await response.json();

    if (json.status === "success") {
      return json.data.map(item => crearJoc(item));
    } else {
      throw new Error(json.message || "Error desconegut");
    }
  } catch (error) {
    console.error("Error obtenint jocs:", error);
    throw error;
  }
};

export const getPrestecsActius = async () => {
  try {
    const response = await fetch(`${API_URL}?action=getPrestecsActius`);
    const json = await response.json();

    if (json.status === "success") {
      return json.data.map(item => crearPrestec(item));
    } else {
      throw new Error(json.message || "Error desconegut");
    }
  } catch (error) {
    console.error("Error obtenint préstecs:", error);
    throw error;
  }
};

export const postPrestec = async (nomSoci, idsJocs) => {
  const request = {
    action: 'postPrestec',
    nom: nomSoci,
    jocs: idsJocs
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    });

    // return await response.json();
    return { status: "succes" }

  } catch (error) {
    console.error("Error guardant préstec:", error);
    throw error;
  }
};

export const actualitarPrestec = async (idsPrestecs) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'putPrestec',
        idsPrestecs: idsPrestecs
      }),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });

    const resultat = await response.json();
    if (resultat.status === 'error') throw new Error(resultat.message);

    return true;

  } catch (error) {
    console.error("Error retornant jocs:", error);
    throw error;
  }
};