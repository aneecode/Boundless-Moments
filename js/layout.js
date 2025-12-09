window.addEventListener("DOMContentLoaded", () => {
  // Load header
  fetch("/html/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
      const links = document.querySelectorAll("nav a");
      links.forEach(link => {
        if (link.href === window.location.href) link.classList.add("active");
      });
    })
    .catch(err => console.error("Header load error:", err));

  // Load footer
  fetch("/html/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch(err => console.error("Footer load error:", err));
});
