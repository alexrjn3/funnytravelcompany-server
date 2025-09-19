export async function btn_Delete(event) {
  event.preventDefault();
  const deleteBtn = event.target;

  // găsim card-ul părinte
  const card = deleteBtn.closest(".card");
  if (!card) return;

  const offerId = card.dataset.id;
  if (!offerId) {
    console.error("Offer ID not found!");
    return;
  }

  try {
    const res = await fetch(`/api/v1/oferte/id/${offerId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete offer");

    // ștergem card-ul din UI
    card.remove();
    console.log(`Offer ${offerId} deleted`);
  } catch (err) {
    console.error(err);
    alert("Error deleting offer: " + err.message);
  }
}
