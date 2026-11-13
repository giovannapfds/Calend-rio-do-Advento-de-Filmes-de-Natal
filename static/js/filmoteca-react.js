// O React assume somente a lista de cartões. Busca e sessões usam os mesmos dados.
function createReactLibrary(container) {
  if (!window.React || !window.ReactDOM?.createRoot) return null;
  const h = window.React.createElement;
  const root = window.ReactDOM.createRoot(container);

  function FilmCard({ item, sessions, openRecipe }) {
    const { movie, index, reviewUrl, reviewLabel } = item;
    const saved = window.React.useSyncExternalStore(
      subscribeToSavedChanges,
      () => sessions.isSaved(movie)
    );

    function subscribeToSavedChanges(callback) {
      sessions.savedChanges.addEventListener('change', callback);
      return () => sessions.savedChanges.removeEventListener('change', callback);
    }
    return h('article', { className: 'panel-card' },
      h('h2', null, movie.title),
      h('p', { className: 'panel-meta' }, `${movie.year} · ${movie.genre} · ${formatMovieDuration(movie.duration)}`),
      h('details', null,
        h('summary', null, 'Sinopse e avaliações'),
        h('p', null, movie.summary),
        movie.review?.note && h('p', null, movie.review.note),
        h('a', { href: reviewUrl, target: '_blank', rel: 'noopener noreferrer' }, reviewLabel)
      ),
      h('div', { className: 'quiz-actions library-actions' },
        h('button', { type: 'button', className: 'panel-button', onClick: () => sessions.open(movie) }, 'Montar sessão'),
        h('button', { type: 'button', className: 'panel-button panel-secondary', onClick: () => openRecipe(index) }, 'Ver receita'),
        h('button', {
          type: 'button',
          className: 'panel-button panel-secondary',
          'aria-pressed': saved,
          'data-react-save': '',
          onClick: () => sessions.toggleSaved(movie)
        }, saved ? 'Salvo para depois' : 'Salvar para depois')
      )
    );
  }

  return (items, sessions, openRecipe, clearFilters) => {
    root.render(items.length
      ? items.map(item => h(FilmCard, { key: movieKey(item.movie), item, sessions, openRecipe }))
      : h('button', { type: 'button', className: 'panel-button panel-secondary', onClick: clearFilters }, 'Limpar filtros'));
  };
}
