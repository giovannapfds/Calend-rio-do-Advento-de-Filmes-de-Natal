const checklist = (() => {
  const key = 'cinema-natal-v1-checklist';
  const defaults = {
    sessao: ['Escolher o filme', 'Separar os ingredientes', 'Convidar alguém', 'Preparar a pipoca'],
    natal: ['Montar a árvore', 'Organizar a ceia', 'Embrulhar os presentes', 'Escolher a trilha sonora']
  };
  const saved = readPreference(key);
  const lists = {};
  const views = {};

  function persist() {
    savePreference(key, lists);
  }

  function updateProgress(group) {
    const tasks = lists[group];
    const done = tasks.filter(task => task.done).length;
    const { progress, meter, filter, empty, items } = views[group];
    meter.max = Math.max(1, tasks.length);
    meter.value = done;
    empty.hidden = !filter.checked || done !== tasks.length;
    Array.from(items.children).forEach((row, index) => {
      row.hidden = filter.checked && tasks[index].done;
    });
    progress.textContent = tasks.length
      ? `${done} de ${tasks.length} concluídas`
      : 'Nenhuma tarefa por aqui.';
  }

  function render(group) {
    const { items, input } = views[group];
    const rows = lists[group].map(task => {
      const row = document.createElement('li');
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      const text = document.createElement('span');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      text.textContent = task.text;
      label.append(checkbox, text);
      checkbox.addEventListener('change', () => {
        task.done = checkbox.checked;
        persist();
        updateProgress(group);
        if (row.hidden) {
          const next = items.querySelector('li:not([hidden]) input');
          (next ?? views[group].filter).focus();
        }
      });
      row.append(label);

      if (task.custom) {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'panel-button panel-secondary';
        remove.textContent = 'Remover';
        remove.setAttribute('aria-label', `Remover tarefa: ${task.text}`);
        remove.addEventListener('click', () => {
          lists[group] = lists[group].filter(item => item !== task);
          persist();
          render(group);
          input.focus();
        });
        row.append(remove);
      }
      return row;
    });
    items.replaceChildren(...rows);
    updateProgress(group);
  }

  for (const [group, initial] of Object.entries(defaults)) {
    const existing = saved?.[group];
    lists[group] = Array.isArray(existing)
      ? existing.filter(task => typeof task?.text === 'string' && typeof task.done === 'boolean')
      : initial.map(text => ({ text, done: false }));

    const panel = document.querySelector(`[data-checklist="${group}"]`);
    const form = panel.querySelector('form');
    const input = form.querySelector('input');
    const filter = panel.querySelector('.checklist-filter input');
    views[group] = {
      input,
      filter,
      items: panel.querySelector('ul'),
      progress: panel.querySelector('.checklist-progress'),
      meter: panel.querySelector('.checklist-meter'),
      empty: panel.querySelector('.checklist-empty')
    };
    filter.addEventListener('change', () => updateProgress(group));
    input.addEventListener('input', () => input.setCustomValidity(''));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) {
        input.setCustomValidity('Escreva uma tarefa antes de adicionar.');
        input.reportValidity();
        return;
      }
      lists[group].push({ text, done: false, custom: true });
      persist();
      render(group);
      form.reset();
      input.focus();
    });
    render(group);
  }

  function addSession(movies, recipe) {
    const tasks = movies.map(movie => `Assistir a ${movie.title} (${movie.year})`);
    tasks.push(`Preparar ${recipe}`);
    for (const text of tasks) {
      if (!lists.sessao.some(task => task.text === text)) {
        lists.sessao.push({ text, done: false, custom: true });
      }
    }
    persist();
    render('sessao');
  }

  return { addSession };
})();
