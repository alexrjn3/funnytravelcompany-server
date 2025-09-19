export function creareOfertePage() {
  const main = document.querySelector(".main");
  main.innerHTML = `
<section class="creare-oferta-section">
  <h2 class="creare-title">Creare ofertă</h2>
  <form id="create-offer-form" class="creare-form">

    <div class="form-group">
      <label for="adress">Adresă</label>
      <input type="text" id="adress" name="adress" required />
    </div>

    <div class="form-group">
      <label for="city">Oraș</label>
      <input type="text" id="city" name="city" required />
    </div>

    <div class="form-group">
      <label for="country">Țară</label>
      <input type="text" id="country" name="country" required />
    </div>

    <div class="form-group">
      <label for="location">Locație</label>
      <input type="text" id="location" name="location" required />
    </div>

    <div class="form-group">
      <label for="data">Data</label>
      <input type="date" id="data" name="data" required />
    </div>

    <div class="form-group">
      <label for="nights">Număr nopți</label>
      <input type="number" id="nights" name="nights" required min="1" />
    </div>

    <div class="form-group">
      <label for="price">Preț</label>
      <input type="number" id="price" name="price" required />
    </div>

    <div class="form-group">
      <label for="type_oferta">Tip ofertă</label>
      <input type="text" id="type_oferta" name="type_oferta" required />
    </div>

    <div class="form-group">
      <label for="new_Oferta">Ofertă Nouă?</label>
      <input type="checkbox" id="new_Oferta" name="new_Oferta" />
    </div>

    <div class="form-group">
      <label for="images">Poze ofertă</label>
      <input type="file" id="images" name="images" accept="image/*" multiple />
    </div>

    <div class="form-group">
      <label for="description_1">Descriere 1</label>
      <textarea id="description_1" name="description_1" rows="2" required></textarea>
    </div>

    <div class="form-group">
      <label for="description_2">Descriere 2</label>
      <textarea id="description_2" name="description_2" rows="2"></textarea>
    </div>

    <div class="form-group">
      <label for="servici">Servicii</label>
      <input type="text" id="servici" name="servici" />
    </div>

    <div class="form-group">
      <label>Coordonate</label>
      <div style="display: flex; gap: 10px;">
        <input type="number" id="coord_x" name="coord_x" placeholder="X" step="any" />
        <input type="number" id="coord_y" name="coord_y" placeholder="Y" step="any" />
      </div>
    </div>

    <button type="submit" class="btn-create">Creează ofertă</button>
  </form>
</section>
`;

  // Selectăm formularul abia acum
  const form = document.getElementById("create-offer-form");
  // Eveniment submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const files = form.querySelector('input[name="images"]').files;

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]); // must match server field name
    }

    // append other form fields
    const otherFields = new FormData(form);
    for (let [key, value] of otherFields.entries()) {
      if (key !== "images") formData.append(key, value);
    }

    try {
      const res = await fetch("/api/v1/oferte", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Eroare la creare ofertă");

      alert("Oferta a fost creată cu succes!");
      form.reset();
    } catch (err) {
      alert("Eroare: " + err.message);
    }
  });
}
