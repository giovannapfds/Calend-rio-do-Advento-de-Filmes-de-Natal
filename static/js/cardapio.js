// As receitas são reutilizadas em filmes com climas parecidos.
// O campo pedido contém termos que o visitante pode buscar no iFood.
const menus = {
  doce: {
    title: 'Chocolate quente com canela',
    order: 'chocolate quente e cookie',
    why: 'Uma bebida quente e cremosa acompanha cenas de inverno e histórias de aconchego.',
    yield: '2 canecas · 10 min',
    ingredients: ['400 ml de leite', '80 g de chocolate meio amargo picado', '½ colher de chá de canela'],
    steps: ['Aqueça o leite e a canela em fogo baixo.', 'Junte o chocolate e mexa até derreter.', 'Divida entre duas canecas e sirva.']
  },
  lanche: {
    title: 'Pipoca com páprica e manteiga',
    order: 'pipoca salgada e refrigerante',
    why: 'É um lanche crocante que dá para dividir sem tirar os olhos da ação ou da comédia.',
    yield: '2 porções · 10 min',
    ingredients: ['½ xícara de milho para pipoca', '1 colher de sopa de óleo', '1 colher de sopa de manteiga', '½ colher de chá de páprica doce', 'Sal a gosto'],
    steps: ['Estoure o milho no óleo em panela tampada.', 'Derreta a manteiga e misture com a páprica.', 'Regue a pipoca, misture e acerte o sal.']
  },
  ceia: {
    title: 'Batatas assadas com alecrim',
    order: 'frango assado com batatas',
    why: 'O aroma de alecrim e a travessa para compartilhar lembram uma mesa de festa.',
    yield: '3 porções · 45 min',
    ingredients: ['600 g de batatas', '2 colheres de sopa de azeite', '1 ramo de alecrim', 'Sal e pimenta a gosto'],
    steps: ['Corte as batatas em gomos e misture com os temperos.', 'Espalhe numa assadeira sem sobrepor.', 'Asse a 220 °C por 35 a 40 minutos, virando na metade do tempo.']
  },
  pizza: {
    title: 'Minipizza de queijo no pão sírio',
    order: 'pizza de muçarela',
    why: 'A pizza de queijo lembra o pedido que Kevin faz quando fica sozinho em casa.',
    yield: '2 porções · 15 min',
    ingredients: ['2 pães sírios', '4 colheres de sopa de molho de tomate', '120 g de muçarela', 'Orégano a gosto'],
    steps: ['Cubra os pães com molho, queijo e orégano.', 'Asse a 220 °C por 8 a 10 minutos, até o queijo derreter.', 'Fatie e sirva.']
  },
  biscoito: {
    title: 'Biscoitos de gengibre e canela',
    order: 'biscoito de gengibre e chocolate quente',
    why: 'As especiarias combinam com o inverno de Smeerensburg, e os biscoitos podem virar presentes como os brinquedos de Klaus.',
    yield: '16 biscoitos · 45 min',
    ingredients: ['100 g de manteiga', '70 g de açúcar mascavo', '1 gema', '180 g de farinha de trigo', '1 colher de chá de gengibre em pó', '½ colher de chá de canela'],
    steps: ['Misture a manteiga com o açúcar e incorpore a gema.', 'Junte a farinha e as especiarias. Refrigere a massa por 20 minutos.', 'Abra a massa, corte os biscoitos e asse a 180 °C por 10 a 12 minutos.']
  },
  abobora: {
    title: 'Abóbora assada com mel e canela',
    order: 'torta de abóbora ou doce de abóbora',
    why: 'A abóbora faz referência à Cidade do Halloween, e a canela leva o prato para a mesa de Natal de Jack.',
    yield: '3 porções · 40 min',
    ingredients: ['500 g de abóbora em cubos', '1 colher de sopa de azeite', '1 colher de sopa de mel', '½ colher de chá de canela'],
    steps: ['Misture a abóbora com azeite e canela.', 'Asse a 210 °C por cerca de 30 minutos, até ficar macia.', 'Regue com mel e sirva morna.']
  }
};
