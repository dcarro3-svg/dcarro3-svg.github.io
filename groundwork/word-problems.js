// word-problems.js
// Shared word problem pool.
//
// WP1 — single-step problems  (Lesson 7 / Simple Relations + fluency-unit4)
// WP2 — two-step problems     (Lesson 8 / Compound Relations + fluency-unit5)
//
// Include with: <script src="word-problems.js"></script>
//
// Single-step schema:
//   id, step:1, type ('eq'|'pw'|'cmp'|'frac'|'mul'), difficulty (1-3),
//   text, question, labels[], unkLabel, expectedBars, proportions[],
//   denominator (frac only), correct[], ops[]
//
// Two-step schema:
//   id, step:2, type ('compound'|'complex'), difficulty (1-3),
//   text, question, step1Labels[], step2Labels[], bridge,
//   denominator (0 if not fractional), step1Proportions[],
//   correct[], ops[]

const WP1 = [
  // Equal (eq)
  {
    id: 'wp-001', step: 1, type: 'eq', difficulty: 1,
    text: 'Damien walks the same distance as Elise.',
    labels: ['Damien','Elise'],
    expectedBars: 2, proportions: [1.0],
  },
  {
    id: 'wp-002', step: 1, type: 'eq', difficulty: 1,
    text: 'Two boxes hold the same number of crayons.',
    labels: ['box A','box B'],
    expectedBars: 2, proportions: [1.0],
  },
  {
    id: 'wp-003', step: 1, type: 'eq', difficulty: 1,
    text: "Lena's ribbon is the same length as Marco's ribbon.",
    labels: ["Lena's ribbon","Marco's ribbon"],
    expectedBars: 2, proportions: [1.0],
  },
  // Part-whole (pw)
  {
    id: 'wp-004', step: 1, type: 'pw', difficulty: 1,
    text: 'A jar holds green marbles and purple marbles. Together they fill the whole jar.',
    labels: ['jar','green marbles','purple marbles'],
    expectedBars: 3, proportions: [0.45, 0.55],
  },
  {
    id: 'wp-005', step: 1, type: 'pw', difficulty: 1,
    text: 'A shelf holds red books and blue books. Together they fill the whole shelf.',
    labels: ['shelf','red books','blue books'],
    expectedBars: 3, proportions: [0.6, 0.4],
  },
  {
    id: 'wp-006', step: 1, type: 'pw', difficulty: 1,
    text: 'A board is split into a left section and a right section. Together they make the whole board.',
    labels: ['board','left section','right section'],
    expectedBars: 3, proportions: [0.7, 0.3],
  },
  {
    id: 'wp-007', step: 1, type: 'pw', difficulty: 1,
    text: 'Tom read some pages yesterday and some pages today. Together they make the whole chapter.',
    labels: ['chapter','yesterday','today'],
    expectedBars: 3, proportions: [0.55, 0.45],
  },
  // Comparison (cmp)
  {
    id: 'wp-008', step: 1, type: 'cmp', difficulty: 2,
    text: "Sam's score is higher than Maya's score.",
    labels: ["Sam's score","Maya's score",'difference'],
    expectedBars: 3, proportions: [0.65, 0.35],
  },
  {
    id: 'wp-009', step: 1, type: 'cmp', difficulty: 2,
    text: 'The tall building is taller than the short building.',
    labels: ['tall building','short building','height difference'],
    expectedBars: 3, proportions: [0.7, 0.3],
  },
  {
    id: 'wp-010', step: 1, type: 'cmp', difficulty: 2,
    text: 'The long ribbon is longer than the short ribbon.',
    labels: ['long ribbon','short ribbon','difference'],
    expectedBars: 3, proportions: [0.6, 0.4],
  },
  // Fractional (frac)
  {
    id: 'wp-011', step: 1, type: 'frac', difficulty: 2,
    text: 'One third of the garden is planted.',
    labels: ['garden','planted part'],
    expectedBars: 2, denominator: 3, proportions: [1/3],
  },
  {
    id: 'wp-012', step: 1, type: 'frac', difficulty: 2,
    text: 'One half of the pizza was eaten.',
    labels: ['pizza','eaten part'],
    expectedBars: 2, denominator: 2, proportions: [0.5],
  },
  {
    id: 'wp-013', step: 1, type: 'frac', difficulty: 3,
    text: 'One quarter of the field is covered in snow.',
    labels: ['field','snow'],
    expectedBars: 2, denominator: 4, proportions: [1/4],
  },
  // Multiplicative (mul)
  {
    id: 'wp-014', step: 1, type: 'mul', difficulty: 2,
    text: 'The paperbacks take up twice as much space as the hardcovers.',
    labels: ['hardcovers','paperbacks'],
    expectedBars: 2, proportions: [2],
  },
  {
    id: 'wp-015', step: 1, type: 'mul', difficulty: 2,
    text: 'The large section is three times as wide as the small section.',
    labels: ['small section','large section'],
    expectedBars: 2, proportions: [3],
  },
  {
    id: 'wp-016', step: 1, type: 'mul', difficulty: 3,
    text: 'The long rope is four times as long as the short rope.',
    labels: ['short rope','long rope'],
    expectedBars: 2, proportions: [4],
  },
];

// WP1U — WP1 with one unknown variable. Student draws the bar model and labels the unknown bar "?".
const WP1U = [
  // Equal (eq)
  {
    id: 'wp1u-001', step: 1, type: 'eq', difficulty: 1,
    text: 'Damien and Elise walked the same distance. How far did Elise walk?',
    labels: ['Damien', '?'],
    unkLabel: '?',
    expectedBars: 2, proportions: [1.0],
  },
  {
    id: 'wp1u-002', step: 1, type: 'eq', difficulty: 1,
    text: 'Two boxes hold the same number of crayons. How many crayons are in box B?',
    labels: ['box A', '?'],
    unkLabel: '?',
    expectedBars: 2, proportions: [1.0],
  },
  {
    id: 'wp1u-003', step: 1, type: 'eq', difficulty: 1,
    text: "Lena's ribbon and Marco's ribbon are the same length. How long is Lena's ribbon?",
    labels: ["Marco's ribbon", '?'],
    unkLabel: '?',
    expectedBars: 2, proportions: [1.0],
  },
  // Part-whole (pw)
  {
    id: 'wp1u-004', step: 1, type: 'pw', difficulty: 1,
    text: 'A jar holds green marbles and purple marbles, filling the whole jar. How many green marbles are there?',
    labels: ['jar', '?', 'purple marbles'],
    unkLabel: '?',
    expectedBars: 3, proportions: [0.45, 0.55],
  },
  {
    id: 'wp1u-005', step: 1, type: 'pw', difficulty: 1,
    text: 'Red books and blue books together fill a whole shelf. How many books are on the whole shelf?',
    labels: ['?', 'red books', 'blue books'],
    unkLabel: '?',
    expectedBars: 3, proportions: [0.6, 0.4],
  },
  {
    id: 'wp1u-006', step: 1, type: 'pw', difficulty: 1,
    text: 'Tom read pages yesterday and today to finish a chapter. How many pages did he read today?',
    labels: ['chapter', 'yesterday', '?'],
    unkLabel: '?',
    expectedBars: 3, proportions: [0.55, 0.45],
  },
  {
    id: 'wp1u-007', step: 1, type: 'pw', difficulty: 1,
    text: 'A board is split into a left section and a right section to make the whole board. How long is the whole board?',
    labels: ['?', 'left section', 'right section'],
    unkLabel: '?',
    expectedBars: 3, proportions: [0.7, 0.3],
  },
  // Comparison (cmp)
  {
    id: 'wp1u-008', step: 1, type: 'cmp', difficulty: 2,
    text: "Sam scored more points than Maya. How many more points did Sam score than Maya?",
    labels: ["Sam's score", "Maya's score", '?'],
    unkLabel: '?',
    expectedBars: 3, proportions: [0.65, 0.35],
  },
  {
    id: 'wp1u-009', step: 1, type: 'cmp', difficulty: 2,
    text: 'The tall building is taller than the short building. How much taller is it?',
    labels: ['tall building', 'short building', '?'],
    unkLabel: '?',
    expectedBars: 3, proportions: [0.7, 0.3],
  },
  {
    id: 'wp1u-010', step: 1, type: 'cmp', difficulty: 2,
    text: 'How many fewer dominoes does Jenny have than Elsa?',
    labels: ["Elsa's dominoes", "Jenny's dominoes", '?'],
    unkLabel: '?',
    expectedBars: 3, proportions: [0.6, 0.4],
  },
  // Fractional (frac)
  {
    id: 'wp1u-011', step: 1, type: 'frac', difficulty: 2,
    text: 'One third of the garden is planted. How large is the planted part?',
    labels: ['garden', '?'],
    unkLabel: '?',
    expectedBars: 2, denominator: 3, proportions: [1/3],
  },
  {
    id: 'wp1u-012', step: 1, type: 'frac', difficulty: 2,
    text: 'One half of the pizza was eaten. How large was the eaten piece?',
    labels: ['pizza', '?'],
    unkLabel: '?',
    expectedBars: 2, denominator: 2, proportions: [0.5],
  },
  {
    id: 'wp1u-013', step: 1, type: 'frac', difficulty: 3,
    text: 'One quarter of the field is covered in snow. How large is the snow-covered part?',
    labels: ['field', '?'],
    unkLabel: '?',
    expectedBars: 2, denominator: 4, proportions: [1/4],
  },
  // Multiplicative (mul)
  {
    id: 'wp1u-014', step: 1, type: 'mul', difficulty: 2,
    text: 'The paperbacks take up twice as much space as the hardcovers. How much space do the paperbacks take up?',
    labels: ['hardcovers', '?'],
    unkLabel: '?',
    expectedBars: 2, proportions: [2],
  },
  {
    id: 'wp1u-015', step: 1, type: 'mul', difficulty: 2,
    text: 'The large section is three times as wide as the small section. How wide is the large section?',
    labels: ['small section', '?'],
    unkLabel: '?',
    expectedBars: 2, proportions: [3],
  },
  {
    id: 'wp1u-016', step: 1, type: 'mul', difficulty: 3,
    text: 'The long rope is four times as long as the short rope. How long is the long rope?',
    labels: ['short rope', '?'],
    unkLabel: '?',
    expectedBars: 2, proportions: [4],
  },
];

const WP2 = [
  {
    id: 'wp-201', step: 2, type: 'compound', difficulty: 3,
    text: 'A library has fiction books and reference books. The fiction section is further split into drama books and poetry books.',
    question: 'What do the drama books and poetry books add up to?',
    step1Labels: ['library','fiction books','reference books'],
    step2Labels: ['fiction books','drama books','poetry books'],
    bridge: 'fiction books',
    denominator: 0,
    step1Proportions: [0.6, 0.4],
    correct: ['drama books','plus','poetry books','equals','fiction books'],
    ops: ['plus','minus','equals','unknown'],
  },
  {
    id: 'wp-202', step: 2, type: 'compound', difficulty: 3,
    text: 'A sports team has experienced players and new players. There are more experienced players. The new players are split between defenders and forwards.',
    question: 'What is the total number of new players?',
    step1Labels: ['experienced players','new players','difference'],
    step2Labels: ['new players','defenders','forwards'],
    bridge: 'new players',
    denominator: 0,
    step1Proportions: [0.65, 0.35],
    correct: ['defenders','plus','forwards','equals','new players'],
    ops: ['plus','minus','equals','unknown'],
  },
  {
    id: 'wp-203', step: 2, type: 'compound', difficulty: 3,
    text: 'A farm has wheat fields and vegetable fields. The whole farm is divided into three equal zones. One zone is the unknown quantity.',
    question: 'What fraction of the whole farm is one zone?',
    step1Labels: ['whole farm','wheat fields','vegetable fields'],
    step2Labels: ['whole farm','one zone'],
    bridge: 'whole farm',
    denominator: 3,
    step1Proportions: [0.55, 0.45],
    correct: ['one','third','of','whole farm','equals','one zone'],
    ops: ['one','half','third','fourth','of','plus','minus','equals','unknown'],
  },
  {
    id: 'wp-204', step: 2, type: 'compound', difficulty: 3,
    text: 'A bookcase has a tall shelf and a short shelf. The tall shelf holds more books. One quarter of the tall shelf is empty.',
    question: 'What portion of the tall shelf is empty?',
    step1Labels: ['tall shelf','short shelf','difference'],
    step2Labels: ['tall shelf','empty space'],
    bridge: 'tall shelf',
    denominator: 4,
    step1Proportions: [0.7, 0.3],
    correct: ['one','fourth','of','tall shelf','equals','empty space'],
    ops: ['one','half','third','fourth','of','plus','minus','equals','unknown'],
  },
  {
    id: 'wp-205', step: 2, type: 'complex', difficulty: 3,
    text: 'A museum has an art wing and a science wing. The art wing is divided into a modern art section and a classic art section.',
    question: 'What makes up the art wing?',
    step1Labels: ['museum','art wing','science wing'],
    step2Labels: ['art wing','modern art','classic art'],
    bridge: 'art wing',
    denominator: 0,
    step1Proportions: [0.65, 0.35],
    correct: ['modern art','plus','classic art','equals','art wing'],
    ops: ['plus','minus','equals','unknown'],
  },
  {
    id: 'wp-206', step: 2, type: 'complex', difficulty: 3,
    text: 'A school has indoor spaces and outdoor spaces. The outdoor spaces are divided into a playing field and a garden.',
    question: 'What makes up the outdoor spaces?',
    step1Labels: ['school','indoor spaces','outdoor spaces'],
    step2Labels: ['outdoor spaces','playing field','garden'],
    bridge: 'outdoor spaces',
    denominator: 0,
    step1Proportions: [0.6, 0.4],
    correct: ['playing field','plus','garden','equals','outdoor spaces'],
    ops: ['plus','minus','equals','unknown'],
  },
  {
    id: 'wp-207', step: 2, type: 'compound', difficulty: 3,
    text: 'A container holds hot sauce and mild sauce. The whole container is split equally in half — one half is the unknown.',
    question: 'What fraction of the container is one half?',
    step1Labels: ['whole container','hot sauce','mild sauce'],
    step2Labels: ['whole container','one half'],
    bridge: 'whole container',
    denominator: 2,
    step1Proportions: [0.55, 0.45],
    correct: ['one','half','of','whole container','equals','one half'],
    ops: ['one','half','third','fourth','of','plus','minus','equals','unknown'],
  },
  {
    id: 'wp-208', step: 2, type: 'complex', difficulty: 3,
    text: 'A clothing store has more summer clothes than winter clothes. The summer clothes are split into tops and bottoms.',
    question: 'How are the summer clothes divided?',
    step1Labels: ['summer clothes','winter clothes','difference'],
    step2Labels: ['summer clothes','tops','bottoms'],
    bridge: 'summer clothes',
    denominator: 0,
    step1Proportions: [0.65, 0.35],
    correct: ['tops','plus','bottoms','equals','summer clothes'],
    ops: ['plus','minus','equals','unknown'],
  },
];
