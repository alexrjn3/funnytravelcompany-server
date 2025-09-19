import { lastEdited } from "../btnEditController/btnEditController.js";

export async function btn_Save(event) {
  event.preventDefault();
  const saveBtn = event.target;

  // găsim card-ul părinte
  const card = saveBtn.closest(".card");
  if (!card) return;

  const infoDiv = card.querySelector(".card-info");
  if (!infoDiv) return;

  // colectăm datele din input-uri
  const inputs = infoDiv.querySelectorAll("input, textarea, select");
  const updatedData = {};

  let offerId = card.dataset.id;
  let coord = {};

  inputs.forEach((input) => {
    if (input.name === "id") {
      updatedData[input.name] = input.value; // îl adăugăm și în obiect
    } else if (input.name === "coord_x") {
      coord.x = parseFloat(input.value); // transformăm în număr
    } else if (input.name === "coord_y") {
      coord.y = parseFloat(input.value); // transformăm în număr
    } else {
      updatedData[input.name] = input.value; // restul datelor
    }
  });

  if (Object.keys(coord).length > 0) {
    updatedData.coord = coord;
  }

  if (!offerId) {
    console.error("Offer ID not found!");
    return;
  }

  try {
    const res = await fetch(`/api/v1/oferte/id/${offerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Failed to update offer");

    const data = await res.json();

    // opțional: refacem card-info cu noile valori
    infoDiv.innerHTML = Object.entries(updatedData)
      .map(([key, value]) => {
        if (["_id", "images", "id"].includes(key)) return "";
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        if (key === "coord" && value && typeof value === "object") {
          return `<p><strong>${label}:</strong> x: ${value.x}, y: ${value.y}</p>`;
        } else {
          return `<p><strong>${label}:</strong> ${value}</p>`;
        }
      })
      .join("");

    if (lastEdited && lastEdited.card === card) {
      Object.assign(lastEdited.offer, updatedData);
    }
    saveBtn.style.display = "none"; // ascundem butonul save
  } catch (err) {
    console.error(err);
    alert("Error saving offer: " + err.message);
  }
}
