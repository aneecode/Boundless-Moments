// Get DOM elements
const filterSelect = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortFilter");
const galleryGrid = document.getElementById("galleryContainer");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

// Get all image cards
let imageCards = Array.from(galleryGrid.getElementsByClassName("img-card"));

// Function to render gallery based on filters and sort
function renderGallery() {
  const filter = filterSelect.value;
  const sort = sortSelect.value;

  // Filter cards
  let filteredCards = imageCards.filter(card => {
    return filter === "all" || card.dataset.category === filter;
  });

  // Sort cards by date
  filteredCards.sort((a, b) => {
    const dateA = new Date(a.dataset.date);
    const dateB = new Date(b.dataset.date);
    return sort === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Clear gallery and append filtered/sorted cards
  galleryGrid.innerHTML = '';
  filteredCards.forEach(card => galleryGrid.appendChild(card));
}

// Function to open lightbox
function openLightbox(imgSrc) {
  lightbox.style.display = 'flex';
  lightboxImg.src = imgSrc;
}

// Function to close lightbox
function closeLightbox() {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
}

// Event listeners for filters
filterSelect.addEventListener("change", renderGallery);
sortSelect.addEventListener("change", renderGallery);

// Event listener for lightbox click (close when clicking 
// overlay)
lightbox.addEventListener("click", closeLightbox);

// Add click events to each image card
imageCards.forEach(card => {
  const img = card.querySelector("img");
  img.addEventListener("click", () => openLightbox(img.src));
});

// Initial render
renderGallery();
