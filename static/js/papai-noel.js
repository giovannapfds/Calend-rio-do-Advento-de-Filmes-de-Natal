(() => {
  const visit = document.querySelector('#santa-visit');
  const call = document.querySelector('#santa-call');
  const gift = document.querySelector('#santa-gift');
  const giftToday = document.querySelector('#santa-gift-today');
  const calendar = document.querySelector('#calendario');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sceneTimers = [];
  const entrances = ['treno', 'carro', 'moto', 'patins'];
  const moves = ['salto', 'caminhada', 'pirueta', 'estrelinha'];
  const entranceDuration = 1700;
  const parkingDuration = 380;
  const moveDuration = 1150;
  // Cada rodada passa por todos os estilos antes de repetir.
  let entranceIndex = Math.floor(Math.random() * entrances.length);
  let moveIndex = Math.floor(Math.random() * moves.length);
  let timer;
  let stagedDoor;
  let doorFrame;
  const doorDuration = 1050;
  const openAngle = 105;

  function closeDoor() {
    cancelAnimationFrame(doorFrame);
    stagedDoor?.classList.remove('santa-open', 'santa-gripped', 'santa-tapped');
    stagedDoor?.style.removeProperty('--santa-door-angle');
    visit.style.removeProperty('--santa-pull');
    stagedDoor = undefined;
  }

  function moveDoor(door, opening) {
    if (opening) {
      closeDoor();
      stagedDoor = door;
    }
    door.classList.add('santa-gripped');
    visit.dataset.phase = 'pull';
    const width = door.offsetWidth;
    const perspective = parseFloat(getComputedStyle(door).perspective) || 700;
    const start = performance.now();

    function draw(now) {
      const progress = reducedMotion.matches ? 1 : Math.min(1, (now - start) / doorDuration);
      const eased = progress * progress * (3 - 2 * progress);
      const degrees = openAngle * (opening ? eased : 1 - eased);
      const angle = degrees * Math.PI / 180;
      // Projeta a borda livre ao redor da dobradiça na mesma perspectiva do CSS.
      const depth = width * Math.sin(angle);
      const edge = (width * Math.cos(angle) - width / 2) * perspective / (perspective - depth) + width / 2;
      door.style.setProperty('--santa-door-angle', `${-degrees}deg`);
      visit.style.setProperty('--santa-pull', `${edge - width}px`);

      if (progress < 1) {
        doorFrame = requestAnimationFrame(draw);
        return;
      }
      if (opening) door.classList.add('santa-open');
      else closeDoor();
    }
    doorFrame = requestAnimationFrame(draw);
  }

  function stopScene() {
    sceneTimers.splice(0).forEach(id => window.clearTimeout(id));
    visit.hidden = true;
    delete visit.dataset.phase;
    delete visit.dataset.entrance;
    delete visit.dataset.dismount;
    closeDoor();
  }

  function schedule() {
    window.clearTimeout(timer);
    if (!document.hidden) timer = window.setTimeout(appear, 120000 + Math.random() * 180000);
  }

  function appear(manual = false) {
    schedule();
    if (document.hidden || !visit.hidden || document.querySelector('dialog[open]')) return;
    if (!manual && (calendar.hidden || document.querySelector('#soundtrack:not([hidden])'))) return;
    const doors = [...calendar.querySelectorAll('.door')];
    if (!doors.length) return;

    if (calendar.hidden) location.hash = 'calendario';
    gift.hidden = true;
    closeDoor();
    const outfit = entrances[entranceIndex];
    visit.dataset.outfit = outfit;
    visit.dataset.entrance = outfit;
    // O figurino vermelho tem poses próprias para a pirueta e a estrelinha.
    const move = moves[moveIndex];
    visit.dataset.move = outfit === 'treno' || move === 'salto' ? move : 'caminhada';
    entranceIndex = (entranceIndex + 1) % entrances.length;
    moveIndex = (moveIndex + 1) % moves.length;
    visit.hidden = false;

    const dismountDuration = outfit === 'treno' || outfit === 'moto' ? 1600 : 0;
    const dismountStart = entranceDuration + parkingDuration;

    const today = calendar.querySelector('.door[aria-current="date"]');
    const monthDoors = [...(today?.closest('.doors') ?? doors[0].closest('.doors')).querySelectorAll('.door')];
    const lastDoor = today ?? monthDoors[0];
    const todayIndex = monthDoors.indexOf(lastDoor);
    // Avança pelo mês e retorna na direção do dia atual por portinhas intermediárias.
    const end = todayIndex < monthDoors.length / 2 ? monthDoors.length - 1 : 0;
    const distance = end - todayIndex;
    const stops = [...new Set([0.3, 0.65, 1, 0.5, 0.18]
      .map(fraction => monthDoors[todayIndex + Math.round(distance * fraction)]))]
      .filter(door => door && door !== lastDoor);
    const later = (delay, action) => sceneTimers.push(window.setTimeout(action, delay));

    function positionAt(door, phase, getTarget) {
      const previous = visit.getBoundingClientRect();
      door.scrollIntoView({ block: 'center', behavior: 'instant' });
      const bounds = door.getBoundingClientRect();
      const { x, y } = getTarget(bounds, previous.width);
      // Usa a posição atual como origem antes de iniciar a próxima transição.
      visit.style.setProperty('--santa-x', `${previous.left}px`);
      visit.style.setProperty('--santa-y', `${previous.top}px`);
      visit.dataset.phase = phase;
      visit.dataset.direction = x > previous.left + 4 ? 'right' : 'left';
      visit.getBoundingClientRect();
      visit.style.setProperty('--santa-x', `${x}px`);
      visit.style.setProperty('--santa-y', `${y}px`);
    }

    function visitStop(door, index, start) {
      const action = index % 3;
      later(start, () => positionAt(door, action === 0 ? 'hop' : 'land', (bounds, width) => ({
        x: bounds.left + bounds.width * (action === 0 ? 0.34 : 0.5) - width * (action === 0 ? 0.43 : 0.5),
        y: action === 0 ? bounds.bottom - width * 0.035 : bounds.top - width * 0.96
      })));
      later(start + 650, () => {
        visit.dataset.phase = ['hang', 'stand', 'crouch'][action];
      });
      if (action === 1) return;
      later(start + 950, () => {
        if (action === 0) visit.dataset.phase = 'hang-tap';
      });
      later(start + 1130, () => {
        closeDoor();
        stagedDoor = door;
        door.classList.add('santa-tapped');
      });
      later(start + 1720, () => door.classList.remove('santa-tapped'));
      later(start + 2210, closeDoor);
    }

    function reachFor(door, keepOpen, start) {
      later(start, () => positionAt(door, 'approach', (bounds, width) => {
        const standLeft = bounds.right + width * 0.65 > window.innerWidth;
        visit.dataset.doorSide = standLeft ? 'right' : 'left';
        return {
          x: bounds.right - width * (standLeft ? 0.88 : 0.12),
          y: bounds.top + bounds.height / 2 - width * 0.37
        };
      }));
      later(start + 570, () => { visit.dataset.phase = 'turn'; });
      later(start + 960, () => { visit.dataset.phase = 'pause'; });
      later(start + 1250, () => { visit.dataset.phase = 'reach'; });
      later(start + 1510, () => moveDoor(door, true));

      if (!keepOpen) {
        later(start + 1510 + doorDuration + 320, () => moveDoor(door, false));
        later(start + 1510 + doorDuration * 2 + 320, () => { visit.dataset.phase = 'pause'; });
      }
    }

    if (dismountDuration) {
      later(dismountStart, () => { visit.dataset.dismount = outfit; });
    }
    later(dismountStart + dismountDuration, () => {
      delete visit.dataset.dismount;
      delete visit.dataset.entrance;
    });
    const firstStep = dismountStart + dismountDuration + moveDuration;
    const stopDuration = 2280;
    stops.forEach((door, index) => visitStop(door, index, firstStep + index * stopDuration));
    const finalStep = firstStep + stops.length * stopDuration;
    if (lastDoor) reachFor(lastDoor, Boolean(today), finalStep);
    const departure = finalStep + (lastDoor ? 1510 + doorDuration * (today ? 1 : 2) + 350 : 0);
    later(departure, () => {
      if (stagedDoor) {
        stagedDoor.classList.remove('santa-gripped');
        stagedDoor.style.removeProperty('--santa-door-angle');
      }
      if (visit.dataset.phase) visit.dataset.phase = 'exit';
      visit.style.removeProperty('--santa-pull');
    });
    later(departure + (reducedMotion.matches ? 100 : 1450), () => {
      visit.hidden = true;
      delete visit.dataset.phase;
      giftToday.hidden = !today;
      gift.hidden = false;
      sceneTimers.length = 0;
    });
  }

  window.addEventListener('resize', () => {
    if (!visit.hidden) stopScene();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !visit.hidden) stopScene();
    schedule();
  });
  window.addEventListener('hashchange', () => {
    if (calendar.hidden) {
      stopScene();
      gift.hidden = true;
    }
  });
  document.querySelector('#santa-gift-close').addEventListener('click', () => {
    gift.hidden = true;
    call.focus();
  });
  giftToday.addEventListener('click', () => {
    gift.hidden = true;
    closeDoor();
    document.querySelector('#today-door').click();
  });
  call.hidden = false;
  call.addEventListener('click', () => appear(true));
  schedule();
})();
