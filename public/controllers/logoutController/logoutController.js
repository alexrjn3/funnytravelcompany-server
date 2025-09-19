export async function logout() {
  try {
    const res = await fetch(`${process.env.SERVER_URL}logout`, {
      method: "GET",
      credentials: "include", // important pentru cookie
    });

    if (res.ok) {
      // redirect după logout
      window.location.href = `${process.env.CLIENT_URL}login`;
    } else {
      alert("Logout failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error during logout");
  }
}
