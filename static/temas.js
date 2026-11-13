// A ordem das apresentações acompanha as entradas de cada mês em filmes.json.
const filmThemes = {
  novembro: [
    ['neve', '🚂'], ['polo', '🦌'], ['romance', '🏡'], ['musical', '🎙️'],
    ['polo', '🛷'], ['fantasia', '🩰'], ['comedia', '☀️'], ['comedia', '🧝'],
    ['romance', '🎿'], ['classico', '🎅'], ['comedia', '🏠'], ['romance', '🤫'],
    ['neve', '🧣'], ['polo', '🌟'], ['musical', '🎟️'], ['musical', '⚙️'],
    ['acao', '🏙️'], ['comedia', '⏰']
  ],
  dezembro: [
    ['neve', '💌'], ['romance', '💍'], ['comedia', '🎅'], ['polo', '🐾'],
    ['comedia', '🍬'], ['sombrio', '🎃'], ['romance', '🧳'], ['acao', '🛷'],
    ['musical', '🎸'], ['acao', '🎁'], ['neve', '🚗'], ['classico', '🎩'],
    ['romance', '🎬'], ['polo', '🤶'], ['sombrio', '🕯️'], ['romance', '🥂'],
    ['comedia', '🎀'], ['acao', '✈️'], ['classico', '🔔'], ['fantasia', '⌛'],
    ['romance', '💝'], ['romance', '🏡'], ['classico', '🗽'], ['comedia', '🏠']
  ]
};

// Pequenos arranjos instrumentais para cada clima.
const themes = {
  neve:     { wave: 'sine',     step: .23, notes: [79, 76, 74, 72, 74, 76, 79, 84], long: [3, 7] },
  polo:     { wave: 'triangle', step: .17, notes: [76, 76, 76, 76, 76, 76, 76, 79, 72, 74, 76], long: [2, 5, 10] },
  romance:  { wave: 'sine',     step: .24, notes: [72, 76, 79, 81, 79, 76, 74, 72], long: [3, 7] },
  musical:  { wave: 'triangle', step: .16, notes: [72, 76, 79, 84, 81, 79, 76, 77, 79, 84], long: [3, 9] },
  fantasia: { wave: 'sine',     step: .20, notes: [69, 72, 76, 84, 83, 79, 76, 81], long: [3, 7] },
  comedia:  { wave: 'triangle', step: .15, notes: [72, 76, 74, 77, 76, 79, 77, 74, 72], long: [3, 8] },
  classico: { wave: 'triangle', step: .19, notes: [79, 77, 76, 74, 72, 74, 76, 72, 74, 76, 77, 74, 76, 74, 72], long: [0, 7, 14] },
  acao:     { wave: 'triangle', step: .13, notes: [57, 57, 64, 60, 57, 57, 67, 64, 60, 64, 69], long: [3, 6, 10] },
  sombrio:  { wave: 'sine',     step: .22, notes: [64, 67, 70, 69, 64, 63, 67, 64], long: [2, 7] }
};
