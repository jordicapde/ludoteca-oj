import { crearJoc } from '../models/Joc.js';
import { crearDetallEstat } from "../models/DetallEstat.js";

const API_URL = 'https://script.google.com/macros/s/AKfycbyA0pDGfmI7G_5KkZYE2Fp0c-O11KnFGyouNspe_nGH1dt5aysx5Vh3zqjzfgz_-tPm/exec'

// --- GET ---
const doGet = async (action) => {
    try {
      const response = await fetch(`${API_URL}?action=${action}`);
      const json = await response.json();

      if (json.status === "success") {
        return json.data;
      } else {
        throw new Error(json.message || "Error desconegut");
      }
    } catch (error) {
      console.error(`Error obtenint ${action}:`, error);
      throw error;
    }
}

// --- POST ---
const doPost = async (request) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    });

    const json = await response.json();

    if (json.status === "success") {
      return json.data;
    } else {
      throw new Error(json.message || "Error desconegut");
    }

  } catch (error) {
    console.error(`Error executant ${action}:`, error);
    throw error;
  }
}

//////////////////////////////////////////////////////////

export const getJocs = async () => {
  return doGet('getJocs')
      .then(data => data.map(item => crearJoc(item)));
};

export const getEstats = async () => {
  return doGet('getEstats')
      .then(data => data.map(item => crearDetallEstat(item)));
};

export const postPrestec = async (nomSoci, idsJocs) => {
  return doPost({
    action: 'postPrestec',
    nomSoci: nomSoci.trim(),
    idsJocs: idsJocs
  });
};

export const actualitarPrestec = async (idsPrestecs) => {
  return doPost({
    action: 'putPrestec',
    idsPrestecs: idsPrestecs
  });
};