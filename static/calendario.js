const platforms = {
  N: { name: 'Netflix', search: 'https://www.netflix.com/search?q=' },
  P: { name: 'Prime Video', search: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=' },
  D: { name: 'Disney+', search: 'https://www.disneyplus.com/search' }
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
const film = document.querySelector('#film');
const sound = document.querySelector('#sound');
const progress = document.querySelector('#progress');
const ratingGroup = document.querySelector('.film-rating');
const ratingInputs = [...ratingGroup.querySelectorAll('input')];
const ratingStatus = document.querySelector('#rating-status');
const storage = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
};
const seen = new Set(storage.read('cinema-natal-v1-doors', []));
const ratingKey = 'cinema-natal-v1-ratings';
const ratings = storage.read(ratingKey, {});
let activeFilm;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let muted = storage.read('cinema-natal-v1-muted', false);
let audio;
let melody;
let opener;
let pending;

function updateSound() {
  sound.textContent = muted ? '♫ Som desligado' : '♫ Som ligado';
  sound.setAttribute('aria-pressed', String(!muted));
}

function updateProgress() {
  progress.textContent = seen.size + ' de 42 abertas';
}

function showRating(score) {
  for (const input of ratingInputs) {
    const value = Number(input.value);
    input.checked = value === score;
    input.nextElementSibling.textContent = value <= score ? '★' : '☆';
  }
  ratingStatus.textContent = score ? 'Sua nota: ' + score + ' de 5' : 'Toque nas estrelas para dar sua nota.';
}

ratingGroup.addEventListener('change', event => {
  if (!activeFilm || !ratingInputs.includes(event.target)) return;
  const score = Number(event.target.value);
  ratings[activeFilm] = score;
  storage.write(ratingKey, ratings);
  showRating(score);
});

function playChime(theme, variation) {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (muted || !Audio) return;
  try {
    audio ??= new Audio();
    audio.resume().catch(() => {});
    melody?.disconnect();
    melody = audio.createGain();
    melody.gain.value = .65;
    melody.connect(audio.destination);
    const start = audio.currentTime + .025;
    const { wave, step, notes, long } = themes[theme];
    const transpose = [0, 2, -2, 5, -3, 3][variation % 6];
    let offset = 0;
    notes.forEach((note, index) => {
      const time = start + offset;
      const duration = step * (long.includes(index) ? 2 : 1);
      offset += duration;
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      oscillator.type = wave;
      oscillator.frequency.value = 440 * Math.pow(2, (note + transpose - 69) / 12);
      envelope.gain.setValueAtTime(.001, time);
      envelope.gain.exponentialRampToValueAtTime(.20, time + .012);
      envelope.gain.exponentialRampToValueAtTime(.001, time + duration + .17);
      oscillator.connect(envelope);
      envelope.connect(melody);
      oscillator.start(time);
      oscillator.stop(time + duration + .18);
    });
  } catch {}
}

function reveal(door, entry, presentation, day, month) {
  if (pending || film.open) return;
  opener = door;
  const [theme, icon] = presentation;
  playChime(theme, day);
  film.dataset.theme = theme;
  document.querySelector('#film-icon').textContent = icon;
  door.classList.add('opening');
  pending = window.setTimeout(() => {
    pending = undefined;
    const [title, year, service, summary, directLink] = entry;
    const platform = platforms[service];
    document.querySelector('#film-date').textContent = day + ' de ' + month;
    document.querySelector('#film-title').textContent = title;
    document.querySelector('#film-details').textContent = year + ' · ' + platform.name;
    document.querySelector('#film-summary').textContent = summary;
    const release = document.querySelector('#film-release');
    release.textContent = releases[title] ?? '';
    release.hidden = !releases[title];
    const link = document.querySelector('#film-link');
    const guide = !directLink && disneyGuides[title];
    link.href = directLink || (guide ? 'https://www.justwatch.com/br/filme/' + guide : platform.search + encodeURIComponent(title));
    link.textContent = guide ? 'Ver onde assistir ↗' : (directLink ? 'Abrir no ' : 'Buscar no ') + platform.name + ' ↗';
    activeFilm = month + '-' + day;
    showRating(ratings[activeFilm] ?? 0);
    seen.add(activeFilm);
    storage.write('cinema-natal-v1-doors', [...seen]);
    door.dataset.opened = 'true';
    door.setAttribute('aria-label', day + ' de ' + month + ', portinha já aberta');
    updateProgress();
    film.showModal();
  }, reducedMotion.matches ? 0 : 360);
}

function renderCalendar(catalog) {
  for (const [month, entries] of Object.entries(catalog)) {
    const grid = document.querySelector('#' + month + ' .doors');
    const firstDay = month === 'novembro' ? 13 : 1;
    entries.forEach((entry, index) => {
      const day = firstDay + index;
      const door = document.createElement('button');
      const opened = seen.has(month + '-' + day);
      door.type = 'button';
      door.className = 'door';
      door.dataset.opened = String(opened);
      door.setAttribute('aria-haspopup', 'dialog');
      door.setAttribute('aria-label', day + ' de ' + month + (opened ? ', portinha já aberta' : ', abrir portinha'));
      door.innerHTML = '<span class="inside" aria-hidden="true">✦</span><span class="face" aria-hidden="true"><strong>' +
        String(day).padStart(2, '0') + '</strong><small>' + month.slice(0, 3).toUpperCase() + '</small></span>';
      door.addEventListener('click', () => reveal(door, entry, filmThemes[month][index], day, month));
      grid.append(door);
    });
  }
}

async function loadCalendar() {
  try {
    const response = await fetch('/api/filmes');
    if (!response.ok) throw new Error('Erro ao carregar filmes');
    renderCalendar(await response.json());
    updateProgress();
  } catch {
    progress.textContent = 'Não foi possível carregar os filmes. Recarregue a página.';
  }
}

film.querySelector('.close').addEventListener('click', () => film.close());
film.addEventListener('click', event => { if (event.target === film) film.close(); });
film.addEventListener('close', () => {
  opener?.classList.remove('opening');
  opener?.focus({ preventScroll: true });
});
sound.addEventListener('click', () => {
  muted = !muted;
  if (muted) melody?.disconnect();
  storage.write('cinema-natal-v1-muted', muted);
  updateSound();
});
const snow = document.querySelector('.snow');
for (let index = 0; index < 46; index++) {
  const flake = document.createElement('span');
  const size = 1 + (index % 5) * .55;
  flake.className = 'flake';
  flake.style.cssText = 'left:' + (index * 23.13 % 100) + '%;--cinema-natal-position:' + (index * 11.7 % 100) +
    '%;width:' + size + 'px;height:' + size + 'px;opacity:' + (.19 + (index % 6) * .085) +
    ';animation-duration:' + (12 + index % 13) + 's;animation-delay:-' + (index * 3.4 % 26) + 's';
  snow.append(flake);
}
updateSound();
loadCalendar();
