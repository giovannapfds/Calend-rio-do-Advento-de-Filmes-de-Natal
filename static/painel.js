(() => {
  const sections = [...document.querySelectorAll('[data-panel]')];
  const navigation = [...document.querySelectorAll('.panel-nav a')];
  const search = document.querySelector('#library-search');
  const genre = document.querySelector('#library-genre');
  const libraryStatus = document.querySelector('#library-status');
  const libraryList = document.querySelector('#library-list');
  const recipeSelect = document.querySelector('#recipe-film');
  const recipeContent = document.querySelector('#recipe-content');
  const quizForm = document.querySelector('#quiz-form');
  const quizResult = document.querySelector('#quiz-result');
  const ifoodUrl = 'https://www.ifood.com.br/busca';
  const quizStepLabel = document.querySelector('#quiz-step-label');
  const quizProgress = document.querySelector('#quiz-progress');
  const quizBack = document.querySelector('#quiz-back');
  const quizNext = document.querySelector('#quiz-next');
  const quizMessage = document.querySelector('#quiz-message');
  const answers = new Array(quizQuestions.length).fill(null);
  let step = 0;
  let movies = [];

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function link(text, href, external = false) {
    const anchor = node('a', text);
    anchor.href = href;
    if (external) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    return anchor;
  }

  const sessions = createSessions({ node, link, list, ifoodUrl });
  const calendarSession = document.querySelector('#film-session');
  calendarSession.addEventListener('click', () => {
    const { title, year } = calendarSession.dataset;
    const movie = movies.find(item => item.title === title && item.year === Number(year));
    if (!movie) return;
    document.querySelector('#film').close();
    sessions.open(movie);
  });

  function sessionButton(movie, menu) {
    const control = node('button', 'Montar sessão', 'panel-button');
    control.type = 'button';
    control.addEventListener('click', () => sessions.open(movie, menu));
    return control;
  }

  function showPanel(event) {
    const hash = location.hash.slice(1);
    // Novembro e dezembro são âncoras internas da aba Calendário.
    const panel = sections.some(section => section.id === hash) ? hash : 'calendario';
    for (const section of sections) section.hidden = section.id !== panel;
    for (const anchor of navigation) {
      if (anchor.hash === '#' + panel) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
    }
    if (panel === 'calendario' && ['novembro', 'dezembro'].includes(hash)) {
      document.getElementById(hash).scrollIntoView();
    } else if (event) {
      const heading = document.querySelector(`#${panel} h1`);
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  function normalize(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function openRecipe(index) {
    recipeSelect.value = String(index);
    renderRecipe();
    location.hash = 'receitas';
  }

  function renderLibrary() {
    const terms = normalize(search.value.trim()).split(/\s+/);
    const cards = movies.flatMap((movie, index) => {
      const haystack = normalize(`${movie.title} ${movie.year} ${movie.genre}`);
      if (genre.value && movie.genre !== genre.value) return [];
      if (!terms.every(term => haystack.includes(term))) return [];
      const card = node('article', '', 'panel-card');
      const details = node('details');
      details.append(
        node('summary', 'Sinopse e avaliações'),
        node('p', movie.summary)
      );
      if (movie.review?.note) details.append(node('p', movie.review.note));
      const reviewUrl = movie.review?.url ||
        'https://www.rottentomatoes.com/search?search=' + encodeURIComponent(`${movie.title} ${movie.year}`);
      const recipe = node('button', 'Ver receita', 'panel-button panel-secondary');
      recipe.type = 'button';
      recipe.addEventListener('click', () => openRecipe(index));
      details.append(link(movie.review ? 'Avaliações no Rotten Tomatoes ↗' : 'Buscar avaliações ↗', reviewUrl, true));
      const actions = node('div', '', 'quiz-actions library-actions');
      actions.append(sessionButton(movie), recipe, sessions.saveButton(movie));
      card.append(node('h2', movie.title), node('p', `${movie.year} · ${movie.genre}`, 'panel-meta'), details, actions);
      return [card];
    });
    libraryStatus.textContent = cards.length ? `${cards.length} de ${movies.length} filmes` : 'Nenhum filme encontrado.';
    if (!cards.length) {
      const clear = node('button', 'Limpar filtros', 'panel-button panel-secondary');
      clear.addEventListener('click', () => {
        search.value = '';
        genre.value = '';
        renderLibrary();
        search.focus();
      });
      libraryList.replaceChildren(clear);
      return;
    }
    libraryList.replaceChildren(...cards);
  }

  function list(tag, items) {
    const result = node(tag);
    for (const item of items) result.append(node('li', item));
    return result;
  }

  function renderRecipe() {
    const movie = movies[Number(recipeSelect.value)];
    const menu = menus[movie.menu];
    document.querySelector('#recipe-status').textContent = `Para assistir a ${movie.title} (${movie.year})`;
    recipeContent.replaceChildren(
      node('h2', menu.title),
      node('p', menu.yield, 'panel-meta'),
      node('p', menu.why),
      node('h3', 'Ingredientes'),
      list('ul', menu.ingredients),
      node('h3', 'Como preparar'),
      list('ol', menu.steps),
      sessionButton(movie)
    );
  }

  function renderQuestion(moveFocus = false) {
    const [question, options] = quizQuestions[step];
    const fieldset = node('fieldset', '', 'panel-card');
    const legend = node('legend', question);
    legend.tabIndex = -1;
    fieldset.append(legend);
    options.forEach(([text], index) => {
      const label = node('label');
      const input = node('input');
      input.type = 'radio';
      input.name = 'answer';
      input.checked = answers[step] === index;
      input.addEventListener('change', () => {
        answers[step] = index;
        quizMessage.textContent = '';
      });
      label.append(input, document.createTextNode(text));
      fieldset.append(label);
    });
    document.querySelector('#quiz-questions').replaceChildren(fieldset);
    quizStepLabel.textContent = `Pergunta ${step + 1} de ${quizQuestions.length}`;
    quizProgress.max = quizQuestions.length;
    quizProgress.value = step + 1;
    quizBack.hidden = step === 0;
    quizNext.textContent = step === quizQuestions.length - 1 ? 'Ver minha sessão' : 'Continuar';
    quizMessage.textContent = '';
    if (moveFocus) legend.focus();
  }

  quizBack.addEventListener('click', () => {
    step--;
    renderQuestion(true);
  });

  quizForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!movies.length) return;
    if (answers[step] === null) {
      quizMessage.textContent = 'Escolha uma resposta para continuar.';
      quizForm.querySelector('input[type="radio"]').focus();
      return;
    }
    if (step < quizQuestions.length - 1) {
      step++;
      renderQuestion(true);
      return;
    }
    const selections = answers.map((index, question) => quizQuestions[question][1][index]);
    const { movie, menu } = rankQuizMovies(movies, selections);
    const recipe = node('button', 'Ver a receita do filme', 'panel-button panel-secondary');
    recipe.type = 'button';
    recipe.addEventListener('click', () => openRecipe(movies.indexOf(movie)));
    const restart = node('button', 'Refazer quiz', 'panel-button panel-secondary');
    restart.type = 'button';
    restart.addEventListener('click', () => {
      answers.fill(null);
      step = 0;
      quizResult.hidden = true;
      quizForm.hidden = false;
      renderQuestion(true);
    });
    const orderLink = link('Abrir busca do iFood ↗', ifoodUrl, true);
    orderLink.className = 'panel-button';
    const actions = node('div', '', 'quiz-actions');
    actions.append(sessionButton(movie, menu), orderLink, recipe, restart);
    quizResult.replaceChildren(
      node('h2', `${movie.title} (${movie.year})`),
      node('p', movie.summary),
      node('h3', 'Sugestão para pedir'),
      node('p', menus[menu].order),
      node('p', 'Informe seu endereço no iFood e busque pelos itens. A oferta depende da região.'),
      actions
    );
    quizForm.hidden = true;
    quizResult.hidden = false;
    quizResult.focus();
  });

  async function loadLibrary() {
    try {
      const embedded = document.querySelector('#library-catalog');
      if (embedded) {
        movies = JSON.parse(embedded.textContent);
      } else {
        const response = await fetch('filmoteca.json');
        if (!response.ok) throw new Error(`Filmoteca: HTTP ${response.status}`);
        movies = await response.json();
      }
      const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });
      movies.sort((a, b) => collator.compare(a.title, b.title) || a.year - b.year);
      movies.forEach((movie, index) => {
        const option = node('option', `${movie.title} (${movie.year})`);
        option.value = String(index);
        recipeSelect.append(option);
      });
      const genres = [...new Set(movies.map(movie => movie.genre))].sort(collator.compare);
      for (const value of genres) {
        const option = node('option', value);
        option.value = value;
        genre.append(option);
      }
      sessions.load(movies, genres);
      calendarSession.disabled = false;
      genre.addEventListener('change', renderLibrary);
      renderLibrary();
      renderRecipe();
      search.addEventListener('input', renderLibrary);
      recipeSelect.addEventListener('change', renderRecipe);
      quizNext.disabled = false;
    } catch (error) {
      console.error(error);
      libraryStatus.textContent = 'Não foi possível carregar a filmoteca. Recarregue a página.';
      sessions.showError(libraryStatus.textContent);
      quizMessage.textContent = libraryStatus.textContent;
      recipeSelect.disabled = true;
      recipeContent.textContent = libraryStatus.textContent;
    }
  }

  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#conteudo').focus();
  });
  window.addEventListener('hashchange', showPanel);
  showPanel();
  renderQuestion();
  loadLibrary();
})();
