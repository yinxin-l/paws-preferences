import './style.sass';

interface RawCat {
  id: string;
  tags?: string[];
  mimetype?: string;
}

interface CatImage {
  id: string;
  url: string;
  tags: string[];
}

const app = document.getElementById('app') as HTMLElement;

let cats: CatImage[] = [];
let currentIndex = 0;
let likedCats: CatImage[] = [];

// Fetch cats from CATAAS API
async function fetchCats(limit: number, requiredTag: string): Promise<CatImage[]> {
  try {
    const res = await fetch(
      `https://cataas.com/api/cats?limit=${limit}&tags=${requiredTag}`
    );
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = (await res.json()) as RawCat[];

    return data
      .map((cat) => ({
        id: cat.id,
        url: `https://cataas.com/cat/${cat.id}`,
        tags: cat.tags ?? [],
      }));
  } catch (err) {
    console.error('Error fetching cats', err);
    return [];
  }
}

// Preload image to improve loading speed
function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

// Display current cat with swipe animation
async function showCurrentCat() {
  if (currentIndex >= cats.length) {
    showSummary();
    return;
  }

  const cat = cats[currentIndex];

  app.innerHTML = `
    <h1 class="title">Paws & Preferences</h1>
    <p class="note">
        &#x1F448; Swipe left to <span class="dislike-text">Dislike</span> <br>
        Swipe right to <span class="like-text">Like</span> &#x1F449;
    </p>
    <div class="cat-container">
      <div class="spinner"></div>
    </div>
    <div class="buttons">
      <button id="dislikeBtn">&#x1F44E;</button>
      <button id="likeBtn">&#x2764;&#xFE0F;</button>
    </div>
  `;

  const container = document.querySelector('.cat-container') as HTMLElement;
  const likeBtn = document.getElementById('likeBtn')!;
  const dislikeBtn = document.getElementById('dislikeBtn')!;

  // Preload image
  const img = await preloadImage(cat.url);
  container.innerHTML = '';
  container.appendChild(img);

  // Swipe & button logic
  likeBtn.addEventListener('click', () => swipeCat('right'));
  dislikeBtn.addEventListener('click', () => swipeCat('left'));

  let startX = 0;
  container.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX));
  container.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) swipeCat('right');
    else if (startX - endX > 50) swipeCat('left');
  });

  function swipeCat(direction: 'left' | 'right') {
    img.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    img.style.transform = direction === 'right' 
      ? 'translateX(100vw) rotate(20deg)' 
      : 'translateX(-100vw) rotate(-20deg)';
    img.style.opacity = '0';
    setTimeout(() => {
      if (direction === 'right') likedCats.push(cat);
      currentIndex++;
      showCurrentCat();
    }, 500);
  }
}

// Show liked cats summary
function showSummary() {
  if (!likedCats.length) {
    app.innerHTML = `<h1>You didn't like any cat.</h1>`;
    return;
  }

  app.innerHTML = `
    <h1>You liked ${likedCats.length} cats!</h1>
    <div class="cat-gallery">
      ${likedCats.map(cat => `<img class="summary-cat" src="${cat.url}" alt="cat ${cat.id}" />`).join('')}
    </div>
  `;

  // Click to enlarge
  const images = document.querySelectorAll('.summary-cat') as NodeListOf<HTMLImageElement>;
  images.forEach(img => {
    img.addEventListener('click', () => showEnlargedImage(img.src));
  });
}

// Show enlarged cat image in summary
function showEnlargedImage(url: string) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `<img src="${url}" class="enlarged-cat" />`;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

//Initialize
async function showCats() {
  cats = await fetchCats(10, 'cute');
  if (!cats.length) {
    app.innerHTML = '<p>Sorry, no cats available.</p>';
    return;
  }
  currentIndex = 0;
  likedCats = [];
  showCurrentCat();
}

showCats();