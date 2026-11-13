const discovery = (() => {
  const form = document.querySelector('#discover-form');
  const kind = document.querySelector('#discover-kind');
  const mood = document.querySelector('#discover-mood');
  const result = document.querySelector('#discover-result');
  const status = document.querySelector('#discover-status');
  const choices = {
    song: {
      animado: 'Animado, para cantar junto',
      aconchegante: 'Aconchegante, para relaxar',
      tradicional: 'Clássico, com corais e canções tradicionais',
      brasileiro: 'Natal em português',
      familia: 'Trilha de filmes e especiais'
    },
    movie: {
      'comédia': 'Quero dar risada',
      'romance': 'Quero uma história de amor',
      'aventura': 'Quero ação e aventura',
      'família': 'Quero ver com a família',
      'clássico': 'Quero um clássico',
      'drama': 'Quero me emocionar'
    }
  };
  let movies;
  let openSession;
  let songsRequest;
  let shown = new Set();
  let sequence = 0;

  function updateMood() {
    mood.replaceChildren(new Option('Surpreenda-me', ''), ...Object.entries(choices[kind.value])
      .map(([value, label]) => new Option(label, value)));
  }

  function clearResult() {
    sequence++;
    result.hidden = true;
    status.hidden = true;
    shown = new Set();
  }

  function loadSongs() {
    const embedded = document.querySelector('#discover-songs');
    return Promise.resolve().then(async () => {
      if (embedded) return JSON.parse(embedded.textContent);
      const response = await fetch('dados/musicas.json');
      if (!response.ok) throw new Error(`Músicas: HTTP ${response.status}`);
      return response.json();
    });
  }

  function element(tag, text) {
    const node = document.createElement(tag);
    node.textContent = text;
    return node;
  }

  async function recommend() {
    const request = ++sequence;
    const isSong = kind.value === 'song';
    const preference = mood.value;
    status.hidden = false;
    status.textContent = 'Buscando uma sugestão…';
    try {
      const catalog = isSong ? await (songsRequest ??= loadSongs().catch(error => {
        songsRequest = undefined;
        throw error;
      })) : movies;
      if (request !== sequence) return;
      if (!catalog) {
        status.textContent = 'A Filmoteca está carregando. Tente novamente em instantes.';
        return;
      }
      const matches = catalog.filter(item => !preference || (isSong ? item.mood : item.genre) === preference);
      if (!matches.length) throw new Error('Catálogo indisponível');
      let remaining = matches.filter(item => !shown.has(item));
      if (!remaining.length) {
        const last = [...shown].at(-1);
        shown.clear();
        remaining = matches.length > 1 ? matches.filter(item => item !== last) : matches;
      }
      const item = remaining[Math.floor(Math.random() * remaining.length)];
      shown.add(item);
      const title = element('h2', item.title);
      const details = element('p', isSong ? item.artist : `${item.year} · ${item.genre}`);
      details.className = 'panel-meta';
      const actions = document.createElement('div');
      actions.className = 'quiz-actions';
      const primary = element(isSong ? 'a' : 'button', isSong ? 'Buscar no YouTube ↗' : 'Montar sessão');
      primary.className = 'panel-button';
      if (isSong) {
        primary.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${item.title} ${item.artist}`);
        primary.target = '_blank';
        primary.rel = 'noopener noreferrer';
      } else {
        primary.type = 'button';
        primary.addEventListener('click', () => openSession(item));
      }
      actions.append(primary);
      if (matches.length > 1) {
        const another = element('button', 'Outra sugestão');
        another.type = 'button';
        another.className = 'panel-button panel-secondary';
        another.addEventListener('click', recommend);
        actions.append(another);
      }
      result.replaceChildren(title, details);
      if (!isSong) result.append(element('p', item.summary));
      result.append(actions);
      status.hidden = true;
      result.hidden = false;
      result.focus();
    } catch {
      if (request === sequence) {
        result.hidden = true;
        status.textContent = 'Não foi possível carregar as sugestões. Tente novamente.';
      }
    }
  }

  kind.addEventListener('change', () => {
    clearResult();
    updateMood();
  });
  mood.addEventListener('change', clearResult);
  form.addEventListener('submit', event => {
    event.preventDefault();
    recommend();
  });
  updateMood();

  return { setMovies(catalog, open) { movies = catalog; openSession = open; } };
})();
