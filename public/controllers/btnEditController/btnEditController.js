export let lastEdited = null; // referință la cardul editat anterior

function restoreCardBeforeEdit(card, offer) {
  if (!card) return;
  const infoDiv = card.querySelector(".card-info");

  // refacem conținutul cardului original
  let infoHtml = "";
  Object.entries(offer).forEach(([key, value]) => {
    if (["_id", "images", "__v", "id"].includes(key)) return; // ignorăm câmpurile astea
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    if (key === "coord" && value && typeof value === "object") {
      infoHtml += `<p><strong>${label}:</strong> x: ${value.x}, y: ${value.y}</p>`;
    } else {
      infoHtml += `<p><strong>${label}:</strong> ${value}</p>`;
    }
  });

  card.innerHTML = `
    <button class="btn btn-edit">Edit</button>
    <button class="btn btn-delete">Delete</button>
        <img src="${offer.images[0]}" alt="no-photo" />
    <div class="card-info">
      ${infoHtml}
    </div>
  `;

  infoDiv.classList.remove("selected");
}

export function btn_Edit(offer, infoDiv, card) {
  const inputs = infoDiv.querySelectorAll("input, select");
  const updatedData = {};
  // Dacă există alt card selectat, îl refacem
  if (lastEdited && lastEdited.card !== card) {
    restoreCardBeforeEdit(lastEdited.card, lastEdited.offer);
  }

  // Construim input-urile dinamic, ignorând _id și alte câmpuri needitabile
  infoDiv.innerHTML = "";
  Object.entries(offer).forEach(([key, value]) => {
    if (["images", "__v", "_id", "id"].includes(key)) return;

    const p = document.createElement("p");
    const label =
      key === "id" ? "Id" : key.charAt(0).toUpperCase() + key.slice(1);

    if (key === "id") {
      // 🔥 doar text, nu input
      p.innerHTML = `<strong>${label}:</strong> ${value}`;
    } else if (key === "new_Oferta") {
      p.innerHTML = `
      <strong>${label}:</strong>
      <select name="${key}">
        <option value="true" ${value ? "selected" : ""}>True</option>
        <option value="false" ${!value ? "selected" : ""}>False</option>
      </select>`;
    } else if (key === "coord" && value && typeof value === "object") {
      // special case for coord
      p.innerHTML = `
      <strong>${label}:</strong>
      X: <input type="number" name="coord_x" value="${value.x || 0}" step="any">
      Y: <input type="number" name="coord_y" value="${value.y || 0}" step="any">
    `;
    } else {
      p.innerHTML = `<strong>${label}:</strong> 
      <input type="text" name="${key}" value="${value || ""}">`;
    }

    infoDiv.appendChild(p);
  });

  // Adăugăm butonul Save
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.className = "btn btn-save";
  infoDiv.appendChild(saveBtn);

  infoDiv.classList.add("selected");
  // Memorăm ultimul card editat
  lastEdited = { card, offer };
}
