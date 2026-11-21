// scenes.js — the data behind Twin Vista.
// Every scene is one picture drawn twice. The differences are pure data:
// { id, x, y, r, label } in panel coordinates (panel is 600 x 440 logical
// pixels). x/y is the centre of the changed detail on BOTH panels, r is the
// click tolerance and the radius of the ring marker drawn when it is found.

export const PANEL_WIDTH = 600;
export const PANEL_HEIGHT = 440;

export const SCENES = [
  {
    id: 'beach',
    title: 'Scene 1 · Sunny Beach Cove',
    subtitle: 'A lazy afternoon by the water — 8 things are not the same.',
    timeLimit: 180,
    differences: [
      { id: 'sun-glasses', x: 92, y: 74, r: 34, label: 'The sun is wearing sunglasses' },
      { id: 'lost-cloud', x: 330, y: 62, r: 36, label: 'A small cloud vanished' },
      { id: 'umbrella-colour', x: 452, y: 218, r: 40, label: 'The beach umbrella changed colour' },
      { id: 'sail-colour', x: 196, y: 196, r: 30, label: 'The sailboat sail changed colour' },
      { id: 'missing-coconut', x: 522, y: 128, r: 24, label: 'A coconut fell off the palm' },
      { id: 'extra-ball', x: 356, y: 368, r: 26, label: 'A beach ball appeared in the sand' },
      { id: 'missing-starfish', x: 118, y: 382, r: 26, label: 'The starfish crawled away' },
      { id: 'crab-colour', x: 508, y: 392, r: 26, label: 'The crab changed colour' },
    ],
  },
  {
    id: 'cabin',
    title: 'Scene 2 · Forest Cabin at Dusk',
    subtitle: 'Twilight in the pines — 9 things are not the same.',
    timeLimit: 210,
    differences: [
      { id: 'moon-shape', x: 512, y: 66, r: 30, label: 'The moon went from crescent to full' },
      { id: 'lost-star', x: 150, y: 52, r: 22, label: 'A bright star went out' },
      { id: 'smoke-gone', x: 238, y: 108, r: 30, label: 'The chimney smoke stopped' },
      { id: 'window-dark', x: 330, y: 252, r: 26, label: 'A cabin window went dark' },
      { id: 'owl-gone', x: 96, y: 208, r: 26, label: 'The owl left its branch' },
      { id: 'lantern-colour', x: 428, y: 292, r: 22, label: 'The door lantern changed colour' },
      { id: 'extra-mushroom', x: 492, y: 386, r: 24, label: 'A mushroom sprouted by the path' },
      { id: 'fence-gap', x: 70, y: 330, r: 28, label: 'A fence plank is missing' },
      { id: 'tree-topper', x: 556, y: 176, r: 24, label: 'The tall pine lost its top star of leaves' },
    ],
  },
  {
    id: 'market',
    title: 'Scene 3 · Lantern Market Street',
    subtitle: 'The evening bazaar is busy — 10 things are not the same.',
    timeLimit: 240,
    differences: [
      { id: 'lantern-teal', x: 84, y: 96, r: 26, label: 'A hanging lantern changed colour' },
      { id: 'awning-stripe', x: 300, y: 138, r: 38, label: 'The big awning lost a stripe' },
      { id: 'cat-gone', x: 128, y: 290, r: 26, label: 'The cat left the crates' },
      { id: 'extra-flag', x: 470, y: 62, r: 24, label: 'An extra pennant flag appeared' },
      { id: 'flower-colour', x: 528, y: 330, r: 24, label: 'The potted flowers changed colour' },
      { id: 'clock-hand', x: 300, y: 66, r: 26, label: 'The tower clock lost its minute hand' },
      { id: 'hat-colour', x: 196, y: 238, r: 24, label: "The fruit seller's hat changed colour" },
      { id: 'extra-balloon', x: 404, y: 196, r: 24, label: 'A balloon appeared by the stall' },
      { id: 'sign-symbol', x: 70, y: 196, r: 24, label: 'The shop sign symbol changed' },
      { id: 'barrel-hoop', x: 452, y: 372, r: 26, label: 'The barrel lost a metal hoop' },
    ],
  },
];

export function sceneByIndex(index) {
  return SCENES[Math.max(0, Math.min(SCENES.length - 1, index))];
}

export function totalDifferences() {
  return SCENES.reduce((sum, scene) => sum + scene.differences.length, 0);
}
