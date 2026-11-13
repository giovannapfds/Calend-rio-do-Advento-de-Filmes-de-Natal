function movieKey(movie) {
  // O ano distingue remakes, e a chave independe da ordem da filmoteca.
  return JSON.stringify([movie.title, movie.year]);
}

function createSessions({ node, link, list, ifoodUrl }) {
  const select = document.querySelector('#session-film');
  const genre = document.querySelector('#session-genre');
  const onlyUnwatched = document.querySelector('#session-unwatched');
  const draw = document.querySelector('#session-draw');
  const marathon = document.querySelector('#session-marathon');
  const content = document.querySelector('#session-content');
  const status = document.querySelector('#session-status');
  const invite = document.querySelector('#session-invite');
  const time = document.querySelector('#invite-time');
  const inviteText = document.querySelector('#invite-text');
  const inviteStatus = document.querySelector('#invite-status');
  const share = document.querySelector('#invite-share');
  const filter = document.querySelector('#watchlist-filter');
  const watchlist = document.querySelector('#watchlist-content');
  const watchStatus = document.querySelector('#watchlist-status');
  const storageKey = 'cinema-natal-v1-watchlist';
  const saved = readPreference(storageKey);
  const records = new Map(Array.isArray(saved) ? saved.filter(entry =>
    Array.isArray(entry) && typeof entry[0] === 'string' && entry[1] && typeof entry[1] === 'object'
  ) : []);
  let movies = [];
  const savedChanges = new EventTarget();
  let lineup = [];
  let sessionMenu;

  function button(label, action) {
    const control = node('button', label, 'panel-button panel-secondary');
    control.type = 'button';
    control.addEventListener('click', action);
    return control;
  }

  function update(movie, changes) {
    const key = movieKey(movie);
    const record = { ...records.get(key), ...changes };
    if (record.saved || record.watched || record.rating) records.set(key, record);
    else records.delete(key);
    savePreference(storageKey, [...records]);
    for (const control of document.querySelectorAll('[data-watch-key]')) {
      if (control.dataset.watchKey !== key) continue;
      switch (control.dataset.watchField) {
        case 'saved':
          updateSaveButton(control, record.saved);
          break;
        case 'watched':
          control.checked = Boolean(record.watched);
          break;
        case 'rating':
          control.value = String(record.rating ?? 0);
          break;
      }
    }
    savedChanges.dispatchEvent(new Event('change'));
    const focused = document.activeElement;
    if (watchlist.contains(focused)) {
      const card = focused.closest('[data-watch-card]');
      const remainsVisible = records.has(key) && (
        !filter.value || (filter.value === 'watched' ? record.watched : record.saved && !record.watched)
      );
      if (card?.dataset.watchCard === key && remainsVisible) return;
      filter.focus();
    }
    renderWatchlist();
  }

  function isSaved(movie) {
    return Boolean(records.get(movieKey(movie))?.saved);
  }

  function toggleSaved(movie) {
    update(movie, { saved: !isSaved(movie) });
  }

  function saveButton(movie) {
    const key = movieKey(movie);
    const control = button('Salvar para depois', () => toggleSaved(movie));
    control.dataset.watchKey = key;
    control.dataset.watchField = 'saved';
    updateSaveButton(control, records.get(key)?.saved);
    return control;
  }

  function updateSaveButton(control, saved) {
    control.textContent = saved ? 'Salvo para depois' : 'Salvar para depois';
    control.setAttribute('aria-pressed', String(Boolean(saved)));
  }

  function movieControls(movie) {
    const key = movieKey(movie);
    const record = records.get(key) ?? {};
    const watched = node('label', '', 'session-check');
    const check = node('input');
    check.type = 'checkbox';
    check.dataset.watchKey = key;
    check.dataset.watchField = 'watched';
    check.checked = Boolean(record.watched);
    check.addEventListener('change', () => update(movie, { watched: check.checked }));
    watched.append(check, document.createTextNode(' Já assisti'));
    const rating = node('label', 'Minha nota');
    const choices = node('select');
    choices.dataset.watchKey = key;
    choices.dataset.watchField = 'rating';
    choices.setAttribute('aria-label', `Minha nota para ${movie.title}`);
    for (let score = 0; score <= 5; score++) {
      const option = node('option', score ? `${score} de 5` : 'Sem nota');
      option.value = String(score);
      choices.append(option);
    }
    choices.value = String(record.rating ?? 0);
    choices.addEventListener('change', () => update(movie, { rating: Number(choices.value) }));
    rating.append(choices);
    const controls = node('div', '', 'session-personal');
    controls.append(watched, rating);
    return controls;
  }

  function renderWatchlist() {
    const titles = movies.filter(movie => {
      const record = records.get(movieKey(movie));
      if (!record) return false;
      if (filter.value === 'saved') return record.saved && !record.watched;
      if (filter.value === 'watched') return record.watched;
      return true;
    });
    watchStatus.textContent = titles.length ? `${titles.length} filmes nesta lista` : 'Nenhum filme nesta lista.';
    watchlist.replaceChildren(...titles.map(movie => {
      const card = node('article', '', 'panel-card');
      card.dataset.watchCard = movieKey(movie);
      card.append(
        node('h2', movie.title),
        node('p', `${movie.year} · ${movie.genre}`, 'panel-meta'),
        movieControls(movie),
        button('Montar sessão', () => open(movie)),
        button('Remover da minha lista', () => update(movie, { saved: false, watched: false, rating: 0 }))
      );
      return card;
    }));
  }

  function renderInvite() {
    const [date, hour] = time.value.split('T');
    const when = date && hour ? `${date.split('-').reverse().join('/')} às ${hour}` : 'Horário a combinar';
    const titles = lineup.map(movie => `${movie.title} (${movie.year})`).join(' + ');
    inviteText.value = `Convite para o Cinema de Natal 🎄\n${titles}\n${when}\nPara preparar: ${sessionMenu.title}\nSugestão de pedido: ${sessionMenu.order}\nVamos assistir juntos?`;
    inviteStatus.textContent = '';
  }

  function showLineup(titles, preferredMenu) {
    lineup = titles;
    select.value = titles.length === 1 ? movieKey(titles[0]) : '';
    const menu = menus[preferredMenu ?? titles[0].menu];
    sessionMenu = menu;
    const program = titles.map((movie, index) => {
      const card = node('article', '', 'panel-card');
      const stream = calendarStreams.get(movieKey(movie)) ?? {
        url: 'https://www.justwatch.com/br/busca?q=' + encodeURIComponent(movie.title),
        label: 'Buscar onde assistir ↗'
      };
      const label = titles.length > 1 ? `${index + 1}. ${movie.title}` : movie.title;
      card.append(node('h2', label), node('p', `${movie.year} · ${movie.genre}`, 'panel-meta'),
        node('p', movie.summary), link(stream.label, stream.url, true), movieControls(movie), saveButton(movie));
      return card;
    });
    const food = node('article', '', 'panel-card session-food');
    food.append(node('h2', 'Cardápio da sessão'), node('h3', menu.title), node('p', menu.yield, 'panel-meta'),
      node('p', menu.why), node('h3', 'Ingredientes'), list('ul', menu.ingredients),
      node('h3', 'Como preparar'), list('ol', menu.steps), node('h3', 'Sugestão no iFood'),
      node('p', menu.order), link('Abrir busca do iFood ↗', ifoodUrl, true));
    const films = node('div', '', 'session-films');
    films.append(...program);
    content.replaceChildren(films, food);
    status.textContent = titles.length > 1 ? 'Maratona de dois filmes pronta.' : 'Sessão pronta.';
    invite.hidden = false;
    renderInvite();
  }

  function open(movie, menu) {
    showLineup([movie], menu);
    location.hash = 'sessao';
  }

  function random(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function drawSession(twoFilms) {
    const pool = movies.filter(movie => !onlyUnwatched.checked || !records.get(movieKey(movie))?.watched);
    const starters = pool.filter(movie => !genre.value || movie.genre === genre.value);
    if (!starters.length || (twoFilms && pool.length < 2)) {
      status.textContent = 'Não há filmes suficientes para esta seleção. Ajuste os filtros e tente novamente.';
      return;
    }
    const fresh = starters.filter(movie => !lineup.includes(movie));
    const first = random(fresh.length ? fresh : starters);
    if (!twoFilms) {
      showLineup([first]);
      content.focus();
      return;
    }
    // Na maratona, o filtro orienta o primeiro filme. O segundo varia o gênero.
    const others = pool.filter(movie => movie !== first);
    const complementary = others.filter(movie => movie.genre !== first.genre);
    showLineup([first, random(complementary.length ? complementary : others)]);
    content.focus();
  }

  select.addEventListener('change', () => {
    const movie = movies.find(item => movieKey(item) === select.value);
    if (movie) showLineup([movie]);
    else if (lineup.length === 1) {
      lineup = [];
      content.replaceChildren();
      invite.hidden = true;
      status.textContent = 'Escolha um filme, sorteie um título ou monte uma maratona.';
    }
  });
  draw.addEventListener('click', () => drawSession(false));
  marathon.addEventListener('click', () => drawSession(true));
  filter.addEventListener('change', renderWatchlist);
  time.addEventListener('input', renderInvite);
  document.querySelector('#invite-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(inviteText.value);
      inviteStatus.textContent = 'Convite copiado.';
    } catch {
      inviteText.focus();
      inviteText.select();
      inviteStatus.textContent = 'Texto selecionado. Use o comando Copiar do navegador.';
    }
  });
  share.hidden = typeof navigator.share !== 'function';
  share.addEventListener('click', async () => {
    try {
      await navigator.share({ title: 'Cinema de Natal', text: inviteText.value });
    } catch (error) {
      if (error.name !== 'AbortError') inviteStatus.textContent = 'Use Copiar convite para compartilhar o texto.';
    }
  });

  function load(catalog, genres) {
    movies = catalog;
    for (const movie of movies) {
      const option = node('option', `${movie.title} (${movie.year})`);
      option.value = movieKey(movie);
      select.append(option);
    }
    for (const value of genres) {
      const option = node('option', value);
      option.value = value;
      genre.append(option);
    }
    for (const control of [select, genre, draw, marathon]) control.disabled = false;
    status.textContent = 'Escolha um filme, sorteie um título ou monte uma maratona.';
    renderWatchlist();
  }

  function showError(message) {
    status.textContent = message;
    watchStatus.textContent = message;
  }

  return { load, open, saveButton, isSaved, toggleSaved, savedChanges, showError };
}
