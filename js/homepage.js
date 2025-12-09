// Smooth scroll (optional)
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    if (link.hash !== '') {
      e.preventDefault();
      document.querySelector(link.hash).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Button hover glow effect
const btn = document.querySelector('.btn');
btn.addEventListener('mouseover', () => {
  btn.style.boxShadow = '0 0 20px rgba(255,255,255,0.6)';
});
btn.addEventListener('mouseout', () => {
  btn.style.boxShadow = 'none';
});


document.addEventListener("DOMContentLoaded", () => {
  const logoImg = document.querySelector(".logo-img");
  logoImg.style.opacity = 0;
  logoImg.style.transition = "opacity 1s ease-in-out";

  setTimeout(() => {
    logoImg.style.opacity = 1;
  }, 300); 
});

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".fade-target");

  elements.forEach(el => {
    el.style.opacity = 0;
    el.style.transition = "opacity 1s ease-in-out";


    el.style.transform = "translateY(20px)";
    el.style.transition += ", transform 1s ease-in-out";

    setTimeout(() => {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, 300);
  });
});
