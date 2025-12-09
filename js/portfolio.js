window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/portfolio"); // public route
    if (!res.ok) throw new Error("Failed to load portfolio items.");

    const data = await res.json();
    const container = document.getElementById("portfolioDynamicGrid");

    container.innerHTML = "";

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "card"; // match your CSS
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading portfolio:", err);
  }
});
