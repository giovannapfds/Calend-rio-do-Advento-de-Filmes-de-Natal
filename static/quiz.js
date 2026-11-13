// Cada opção soma um ponto à preferência de filme, à de comida ou às duas.
const quizQuestions = [
  ['Com quem você vai passar a sessão?', [['Com crianças ou toda a família', 'família'], ['A dois', 'romance'], ['Com amigos', 'comédia'], ['Quero um momento só meu', 'drama']]],
  ['Qual imagem lembra o seu Natal ideal?', [['Uma aldeia iluminada', 'clássico'], ['Neve e magia', 'família'], ['Uma cidade cheia de surpresas', 'aventura'], ['Um encontro à luz de velas', 'romance']]],
  ['O que você quer sentir no final?', [['Vontade de rir', 'comédia'], ['Saudade boa', 'clássico'], ['Aquela emoção que fica', 'drama'], ['Alívio depois da adrenalina', 'aventura']]],
  ['Qual tradição você escolheria?', [['Rever um favorito antigo', 'clássico'], ['Montar a árvore juntos', 'família'], ['Trocar presentes engraçados', 'comédia'], ['Caminhar para ver as luzes', 'romance']]],
  ['Qual cenário você topa visitar?', [['Um internato no inverno', 'drama'], ['Um prédio em apuros', 'aventura'], ['Uma loja de brinquedos', 'família'], ['Uma casa emprestada no campo', 'romance']]],
  ['Que ritmo combina com a noite?', [['Calmo e contemplativo', 'drama'], ['Rápido, cheio de reviravoltas', 'aventura'], ['Leve e brincalhão', 'comédia'], ['Tranquilo, como filme antigo', 'clássico']]],
  ['Que cheiro abre o apetite?', [['Chocolate e canela', null, 'doce'], ['Pipoca recém-estourada', null, 'lanche'], ['Alecrim saindo do forno', null, 'ceia']]],
  ['O que você quer comer durante o filme?', [['Só um doce', null, 'doce'], ['Um lanche para beliscar', null, 'lanche'], ['Um jantar completo', null, 'ceia']]],
  ['Como você imagina a mesa?', [['Canecas e sobremesa', null, 'doce'], ['Petiscos no sofá', null, 'lanche'], ['Travessas para compartilhar', null, 'ceia']]],
  ['O que fecha a noite perfeita?', [['Chocolate e um final carinhoso', 'família', 'doce'], ['Um lanche e mais uma risada', 'comédia', 'lanche'], ['Uma ceia e conversa depois dos créditos', 'drama', 'ceia']]]
];

function rankQuizMovies(movies, answers) {
  const genres = new Map();
  const foods = new Map();
  for (const [_, genre, food] of answers) {
    if (genre) genres.set(genre, (genres.get(genre) ?? 0) + 1);
    if (food) foods.set(food, (foods.get(food) ?? 0) + 1);
  }
  const foodPreference = { pizza: 'lanche', biscoito: 'doce', abobora: 'doce' };
  const foodScore = menu => foods.get(foodPreference[menu] ?? menu) ?? 0;
  const score = movie => 3 * (genres.get(movie.genre) ?? 0) + foodScore(movie.menu);
  // Em caso de empate, mantém a ordem da filmoteca.
  const movie = [...movies].sort((a, b) => score(b) - score(a))[0];
  const [preferredFood] = [...foods].sort((a, b) => b[1] - a[1])[0];
  const menu = foodScore(movie.menu) === foodScore(preferredFood) ? movie.menu : preferredFood;
  return { movie, menu };
}
