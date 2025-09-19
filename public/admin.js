const dashboard = document.getElementById("dashboard"); // containerul unde punem cardurile
const log_out_btn = document.querySelector(".log-out-btn");
const nav_list = document.querySelector(".nav-list");

import { btn_Edit } from "./controllers/btnEditController/btnEditController.js";
import { logout } from "./controllers/logoutController/logoutController.js";
import { btn_Save } from "./controllers/btnSaveController/btnSaveController.js";
import { btn_Delete } from "./controllers/btnDeleteController/btnDeleteController.js";
import { creareOfertePage } from "./controllers/creareOfertePageController/creareOfertePageController.js";

async function loadOferte() {
  try {
    const res = await fetch("/api/v1/oferte", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch offers");

    const data = await res.json();
    const oferte = data.data.oferte || [];

    if (oferte.length === 0) {
      dashboard.innerHTML = "<p>No offers found.</p>";
      return;
    }

    // golim containerul
    dashboard.innerHTML = "";

    // cream containerul grid
    const grid = document.createElement("div");
    grid.className = "cards-grid";

    oferte.forEach((offer) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.id = offer.id; // 🔥 salvăm ID-ul în dataset

      // Generăm HTML pentru toate câmpurile din offer
      let infoHtml = "";
      Object.entries(offer).forEach(([key, value]) => {
        if (["_id", "id", "images", "__v"].includes(key)) return;
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
        <img src="/posters/${offer.images[0]}" alt="no-photo" />
        <div class="card-info">${infoHtml}</div>
      `;
      // atașăm oferta pe card pentru acces rapid la edit
      card.offer = offer;

      grid.appendChild(card);
    });

    dashboard.appendChild(grid);
  } catch (err) {
    console.error(err);
    dashboard.innerHTML = `<p style="color:red">Error loading offers: ${err.message}</p>`;
  }
}

dashboard.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  if (e.target.classList.contains("btn-edit")) {
    const infoDiv = card.querySelector(".card-info");
    btn_Edit(card.offer, infoDiv, card);

    const saveBtn = card.querySelector(".btn-save");
    if (saveBtn) {
      saveBtn.addEventListener("click", btn_Save, { once: true });
    }
  }

  if (e.target.classList.contains("btn-delete")) {
    btn_Delete(e); // apelezi funcția de delete
  }
});

document.addEventListener("DOMContentLoaded", loadOferte);
log_out_btn.addEventListener("click", (e) => {
  logout(e);
});

nav_list.addEventListener("click", (e) => {
  const elem = e.target.closest("li");

  if (elem.textContent === "Vizualizare Oferte")
    window.location.href = "/admin/dashboard";
  if (elem.textContent === "Creare Oferte") creareOfertePage();
});
