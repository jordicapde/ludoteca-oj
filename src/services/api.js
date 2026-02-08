const API_URL = 'https://script.google.com/macros/s/AKfycbyA0pDGfmI7G_5KkZYE2Fp0c-O11KnFGyouNspe_nGH1dt5aysx5Vh3zqjzfgz_-tPm/exec'

export const getJocs = async () => {
  try {
    const response = await fetch(`${API_URL}?action=getJocs`);
    const json = await response.json();

    if (json.status === "success") {
      return json.data;
    } else {
      throw new Error(json.message || "Error desconegut");
    }
  } catch (error) {
    console.error("Error obtenint jocs:", error);
    throw error;
  }
};

export const postPrestec = async (nomSoci, idsJocs) => {
  const request = {
    action: 'registraPrestec',
    nom: nomSoci,
    jocs: idsJocs
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    });

    return await response.json();

  } catch (error) {
    console.error("Error guardant préstec:", error);
    throw error;
  }
};
