(() => {
  const toggle = document.querySelector('#soundtrack-toggle');
  const soundtrack = document.querySelector('#soundtrack');
  const player = document.querySelector('#soundtrack-player');
  const hint = document.querySelector('#soundtrack-hint');
  const videoId = 'rcVGYPDFahk';
  const fromFile = location.protocol === 'file:';

  function closePlayer() {
    soundtrack.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    player.replaceChildren();
    toggle.focus();
  }

  function openPlayer() {
    if (fromFile) return;

    const frame = document.createElement('iframe');
    const params = new URLSearchParams({ playsinline: '1', loop: '1', playlist: videoId });
    frame.title = 'Jazz instrumental de Natal no YouTube';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
    player.replaceChildren(frame);
  }

  if (fromFile) {
    hint.textContent = 'Para assistir aqui no painel, abra o arquivo iniciar_cinema.command no Mac ou inicie o servidor local com PHP ou Python.';
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    if (!soundtrack.hidden) {
      closePlayer();
      return;
    }
    soundtrack.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    openPlayer();
  });
  document.querySelector('#soundtrack-close').addEventListener('click', closePlayer);
  soundtrack.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePlayer();
  });
})();
