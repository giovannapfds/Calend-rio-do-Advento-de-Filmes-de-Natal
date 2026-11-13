const platforms = {
  N: { name: 'Netflix', search: title => 'https://www.netflix.com/search?q=' + encodeURIComponent(title) },
  P: { name: 'Prime Video', search: title => 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=' + encodeURIComponent(title) },
  D: { name: 'Disney+', search: () => 'https://www.disneyplus.com/search' }
};
const disneyGuides = {
  'Noelle': 'noelle',
  'Meu Papai é Noel': 'meu-papai-e-noel',
  'O Estranho Mundo de Jack': 'o-estranho-mundo-de-jack',
  'Um Natal Muito Jonas Brothers': 'a-very-jonas-christmas-movie',
  'Esqueceram de Mim 2: Perdido em Nova York': 'esqueceram-de-mim-2-perdido-em-nova-york'
};
const releases = {
  'O Expresso Polar': 'Chegada à Netflix anunciada para 13/11.',
  'Um Duende em Nova York': 'Chegada à Netflix anunciada para 20/11.',
  'Correndo para o Natal': 'Estreia anunciada para 23/11.',
  'Protegendo Estrelas': 'Estreia anunciada para 18/11.',
  'Um Sonho de Férias': 'Estreia anunciada para 02/12.'
};

const firstDays = { novembro: 13, dezembro: 1 };
const storageKeys = {
  opened: 'cinema-natal-v1-doors',
  ratings: 'cinema-natal-v1-ratings',
  muted: 'cinema-natal-v1-muted'
};

const film = document.querySelector('#film');
const filmFields = {
  icon: document.querySelector('#film-icon'),
  date: document.querySelector('#film-date'),
  title: document.querySelector('#film-title'),
  details: document.querySelector('#film-details'),
  summary: document.querySelector('#film-summary'),
  release: document.querySelector('#film-release'),
  link: document.querySelector('#film-link')
};
const sound = document.querySelector('#sound');
const progress = document.querySelector('#progress');
const ratingGroup = document.querySelector('.film-rating');
const ratingInputs = [...ratingGroup.querySelectorAll('input')];
const ratingStatus = document.querySelector('#rating-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// O calendário continua funcionando se o navegador bloquear o armazenamento.
function readPreference(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // O estado continua disponível em memória até a página fechar.
  }
}

const savedOpened = readPreference(storageKeys.opened);
const savedRatings = readPreference(storageKeys.ratings);
const opened = new Set(Array.isArray(savedOpened) ? savedOpened : []);
const ratings = savedRatings && typeof savedRatings === 'object' && !Array.isArray(savedRatings)
  ? savedRatings
  : {};
let muted = readPreference(storageKeys.muted) === true;
let totalDoors = 0;
let activeDate;
let opener;

function updateSound() {
  sound.textContent = muted ? '♫ Som desligado' : '♫ Som ligado';
  sound.setAttribute('aria-pressed', String(!muted));
}

function updateProgress() {
  progress.textContent = `${opened.size} de ${totalDoors} abertas`;
}

function showRating(score) {
  const validScore = Number.isInteger(score) && score >= 1 && score <= 5 ? score : 0;
  for (const input of ratingInputs) {
    const value = Number(input.value);
    input.checked = value === validScore;
    input.nextElementSibling.textContent = value <= validScore ? '★' : '☆';
  }
  ratingStatus.textContent = validScore
    ? `Sua nota: ${validScore} de 5`
    : 'Toque nas estrelas para dar sua nota.';
}

function setStreamingLink(title, platform, directLink) {
  if (directLink) {
    filmFields.link.href = directLink;
    filmFields.link.textContent = `Abrir no ${platform.name} ↗`;
    return;
  }

  const guide = disneyGuides[title];
  if (typeof guide === 'string') {
    filmFields.link.href = `https://www.justwatch.com/br/filme/${guide}`;
    filmFields.link.textContent = 'Ver onde assistir ↗';
    return;
  }

  filmFields.link.href = platform.search(title);
  filmFields.link.textContent = `Buscar no ${platform.name} ↗`;
}

function fillFilm(entry, presentation, dateLabel) {
  const [title, year, service, summary, directLink] = entry;
  const [theme, icon] = presentation;
  const platform = platforms[service];
  const release = releases[title];
  film.dataset.theme = theme;
  filmFields.icon.textContent = icon;
  filmFields.date.textContent = dateLabel;
  filmFields.title.textContent = title;
  filmFields.details.textContent = `${year} · ${platform.name}`;
  filmFields.summary.textContent = summary;
  filmFields.release.hidden = typeof release !== 'string';
  filmFields.release.textContent = filmFields.release.hidden ? '' : release;
  setStreamingLink(title, platform, directLink);
}

function updateDoor(door, dateLabel, wasOpened) {
  door.dataset.opened = String(wasOpened);
  const action = wasOpened ? 'portinha já aberta' : 'abrir portinha';
  door.setAttribute('aria-label', `${dateLabel}, ${action}`);
}

function reveal(door, entry, presentation, day, month) {
  // O botão de origem também bloqueia outros cliques durante a animação.
  if (opener) return;
  opener = door;

  const dateLabel = `${day} de ${month}`;
  const dateKey = `${month}-${day}`;
  fillFilm(entry, presentation, dateLabel);
  if (!muted) playChime(presentation[0], day);

  door.classList.add('opening');
  window.setTimeout(() => {
    activeDate = dateKey;
    showRating(ratings[dateKey]);
    film.showModal();

    opened.add(dateKey);
    savePreference(storageKeys.opened, [...opened]);
    updateDoor(door, dateLabel, true);
    updateProgress();
  }, reducedMotion.matches ? 0 : 360);
}

function createDoor(entry, presentation, day, month) {
  const template = document.querySelector('#door-template');
  const door = template.content.firstElementChild.cloneNode(true);
  door.querySelector('strong').textContent = String(day).padStart(2, '0');
  door.querySelector('small').textContent = month.slice(0, 3).toUpperCase();
  updateDoor(door, `${day} de ${month}`, opened.has(`${month}-${day}`));
  door.addEventListener('click', () => reveal(door, entry, presentation, day, month));
  return door;
}

function renderCalendar(catalog) {
  const validDates = new Set();
  const months = Object.entries(firstDays).map(([month, firstDay]) => {
    const entries = catalog[month];
    // Cada filme precisa da apresentação que ocupa a mesma posição no mês.
    if (!Array.isArray(entries) || entries.length !== filmThemes[month].length) {
      throw new Error(`Confira os filmes e temas de ${month}.`);
    }

    const doors = entries.map((entry, index) => {
      const day = firstDay + index;
      if (!Array.isArray(entry) || typeof platforms[entry[2]]?.search !== 'function') {
        throw new Error(`Filme inválido em ${day} de ${month}.`);
      }
      validDates.add(`${month}-${day}`);
      return createDoor(entry, filmThemes[month][index], day, month);
    });
    return { month, doors };
  });

  // Só conta datas que ainda existem no catálogo.
  for (const date of opened) {
    if (!validDates.has(date)) opened.delete(date);
  }
  for (const { month, doors } of months) {
    document.querySelector(`#${month} .doors`).replaceChildren(...doors);
  }
  totalDoors = validDates.size;
  updateProgress();
}

async function loadCalendar() {
  try {
    const embeddedCatalog = document.querySelector('#film-catalog');
    if (embeddedCatalog) {
      renderCalendar(JSON.parse(embeddedCatalog.textContent));
      return;
    }

    const response = await fetch('/api/filmes');
    if (!response.ok) throw new Error(`Falha ao carregar o catálogo (HTTP ${response.status}).`);
    renderCalendar(await response.json());
  } catch (error) {
    console.error(error);
    progress.textContent = 'Não foi possível carregar os filmes. Recarregue a página.';
  }
}

function renderSnow() {
  const snow = document.querySelector('.snow');
  for (let index = 0; index < 46; index++) {
    const flake = document.createElement('span');
    const size = 1 + (index % 5) * 0.55;
    flake.className = 'flake';
    flake.style.left = `${index * 23.13 % 100}%`;
    // O CSS usa esta posição fixa quando o visitante prefere movimento reduzido.
    flake.style.setProperty('--cinema-natal-position', `${index * 11.7 % 100}%`);
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.opacity = 0.19 + (index % 6) * 0.085;
    flake.style.animationDuration = `${12 + index % 13}s`;
    flake.style.animationDelay = `-${index * 3.4 % 26}s`;
    snow.append(flake);
  }
}

ratingGroup.addEventListener('change', event => {
  if (!activeDate || !ratingInputs.includes(event.target)) return;
  const score = Number(event.target.value);
  ratings[activeDate] = score;
  savePreference(storageKeys.ratings, ratings);
  showRating(score);
});

film.querySelector('.close').addEventListener('click', () => film.close());
film.addEventListener('click', event => {
  if (event.target === film) film.close();
});
film.addEventListener('close', () => {
  opener?.classList.remove('opening');
  opener?.focus({ preventScroll: true });
  opener = undefined;
  activeDate = undefined;
});

sound.addEventListener('click', () => {
  muted = !muted;
  if (muted) stopChime();
  savePreference(storageKeys.muted, muted);
  updateSound();
});

renderSnow();
updateSound();
loadCalendar();
