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
  },
  rabanada: {
    title: "Rabanada de forno",
    order: "rabanada com canela",
    why: "As fatias douradas combinam com filmes sobre voltar para casa e rever a família.",
    yield: "4 porções · 30 min",
    ingredients: ["4 fatias grossas de pão amanhecido", "150 ml de leite", "1 ovo", "2 colheres de sopa de açúcar", "Canela a gosto"],
    steps: ["Passe as fatias pelo leite e depois pelo ovo batido.", "Asse em forma untada a 200 °C por 20 a 25 minutos, virando na metade, até dourar e firmar.", "Passe no açúcar com canela."]
  },
  brownie: {
    title: "Brownie de chocolate e laranja",
    order: "brownie de chocolate",
    why: "O perfume de laranja traz um toque natalino para uma sessão de comédia romântica.",
    yield: "6 porções · 40 min",
    ingredients: ["120 g de chocolate meio amargo", "80 g de manteiga", "2 ovos", "100 g de açúcar", "60 g de farinha de trigo", "Raspas de 1 laranja"],
    steps: ["Derreta o chocolate com a manteiga e deixe amornar.", "Misture ovos, açúcar, farinha e raspas ao chocolate.", "Asse em forma pequena forrada a 180 °C por 20 a 25 minutos, até o centro firmar."]
  },
  nachos: {
    title: "Nachos gratinados com feijão",
    order: "nachos com guacamole",
    why: "Uma travessa de petiscos funciona bem para dividir em uma sessão de ação.",
    yield: "3 porções · 20 min",
    ingredients: ["150 g de chips de milho", "1 xícara de feijão cozido e escorrido", "120 g de queijo ralado", "1 tomate picado", "Limão a gosto"],
    steps: ["Distribua os chips em uma assadeira e cubra com feijão e queijo.", "Leve ao forno a 200 °C por cerca de 8 minutos, até derreter.", "Finalize com tomate e limão."]
  },
  sanduiche: {
    title: "Sanduíche quente de queijo e tomate",
    order: "sanduíche de queijo quente",
    why: "Um lanche rápido acompanha as comédias que começam com todo mundo correndo.",
    yield: "2 porções · 15 min",
    ingredients: ["4 fatias de pão", "120 g de muçarela", "1 tomate em fatias", "1 colher de sopa de manteiga", "Orégano a gosto"],
    steps: ["Monte os sanduíches com queijo, tomate e orégano.", "Passe manteiga na parte externa do pão.", "Doure dos dois lados em frigideira tampada até o queijo derreter."]
  },
  massa: {
    title: "Massa cremosa com cogumelos",
    order: "massa com molho de cogumelos",
    why: "Uma massa quente combina com histórias que pedem um jantar tranquilo antes do filme.",
    yield: "2 porções · 25 min",
    ingredients: ["200 g de massa curta", "200 g de cogumelos fatiados", "150 ml de creme de leite", "1 dente de alho", "Azeite e sal a gosto"],
    steps: ["Cozinhe a massa conforme a embalagem e reserve um pouco da água.", "Doure os cogumelos no azeite, junte o alho e depois o creme.", "Misture a massa ao molho e ajuste a textura com a água reservada."]
  },
  salpicao: {
    title: "Salpicão de frango com maçã",
    order: "salpicão de frango e arroz",
    why: "O prato gelado para compartilhar combina com filmes de reunião familiar e com o Natal no verão.",
    yield: "4 porções · 20 min",
    ingredients: ["300 g de frango já cozido e desfiado", "1 cenoura ralada", "1 maçã em cubos", "4 colheres de sopa de maionese", "1 colher de sopa de suco de limão", "Batata palha a gosto"],
    steps: ["Misture o frango, a cenoura e a maçã com a maionese e o limão.", "Mantenha refrigerado até servir.", "Acrescente a batata palha na hora de levar à mesa."]
  }
};
