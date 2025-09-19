export async function logout() {
  try {
    const res = await fetch("http://localhost:3000/api/v1/users/logout", {
      method: "GET",
      credentials: "include", // important pentru cookie
    });

    if (res.ok) {
      // redirect după logout
      window.location.href = "http://localhost:1234/login";
    } else {
      alert("Logout failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error during logout");
  }
}
