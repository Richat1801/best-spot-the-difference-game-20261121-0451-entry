// main.js — Twin Vista game state, input, HUD and the render loop.
// One canvas holds both panels: the original on the left, the altered copy
// on the right. Clicking a difference on either panel rings it on both.
// Wrong clicks cost time and points. Find every difference before the
// timer runs out; clear all three scenes to win.

import { SCENES, PANEL_WIDTH, PANEL_HEIGHT } from './scenes.js';
import { drawScenePanel, drawFoundMarker, drawHintMarker, drawMissMarker } from './artwork.js';
import { playFoundChime, playMissBuzz, playLevelFanfare, playHintPing } from './audio.js';

const GAP = 24;
const BOARD_WIDTH = PANEL_WIDTH * 2 + GAP + 20;
const BOARD_HEIGHT = PANEL_HEIGHT + 78;
const LEFT_X = 10;
const RIGHT_X = LEFT_X + PANEL_WIDTH + GAP;
const PANEL_Y = 36;

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const el = (id) => document.getElementById(id);
const hudScene = el('hud-scene');
const hudFound = el('hud-found');
const hudRemain = el('hud-remain');
const hudTimer = el('hud-timer');
const hudScore = el('hud-score');
const hudHints = el('hud-hints');
const messageEl = el('message');
const overlayEl = el('overlay');
const overlayTitle = el('overlay-title');
const overlayText = el('overlay-text');
const overlayButton = el('overlay-button');
const statusEl = el('status');

const params = new URLSearchParams(window.location.search);
const shotMode = params.get('shot');

const state = {
  sceneIndex: 0,
  found: new Set(),
  score: 0,
  mistakes: 0,
  hintsLeft: 3,
  timeLeft: SCENES[0].timeLimit,
  running: false,
  levelDone: false,
  gameWon: false,
  misses: [],
  hintId: null,
  hintUntil: 0,
  foundAt: new Map(),
  lastTick: 0,
};

function currentScene() {
  return SCENES[state.sceneIndex];
}

function remainingCount() {
  return currentScene().differences.length - state.found.size;
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function setMessage(text, kind) {
  messageEl.textContent = text;
  messageEl.dataset.kind = kind ?? '';
}

function updateHud() {
  const scene = currentScene();
  hudScene.textContent = scene.title;
  hudFound.textContent = `Found ${state.found.size} / ${scene.differences.length}`;
  hudRemain.textContent = `${remainingCount()} still hidden`;
  hudTimer.textContent = `Time ${formatTime(state.timeLeft)}`;
  hudTimer.dataset.low = state.timeLeft <= 30 && state.running ? 'yes' : '';
  hudScore.textContent = `Score ${state.score}`;
  hudHints.textContent = `Hints ${state.hintsLeft}`;
  statusEl.textContent = `${scene.title}. Found ${state.found.size} of ${scene.differences.length}. ${remainingCount()} remain.`;
}

function loadScene(index, keepScore) {
  state.sceneIndex = index;
  state.found = new Set();
  state.foundAt = new Map();
  state.misses = [];
  state.hintId = null;
  state.levelDone = false;
  state.timeLeft = currentScene().timeLimit;
  if (!keepScore) state.score = 0;
  state.running = true;
  overlayEl.hidden = true;
  setMessage(currentScene().subtitle, '');
  updateHud();
}

function completeLevel() {
  state.levelDone = true;
  state.running = false;
  state.score += Math.ceil(state.timeLeft) * 2;
  playLevelFanfare();
  const last = state.sceneIndex === SCENES.length - 1;
  if (last) {
    state.gameWon = true;
    overlayTitle.textContent = 'You found them all!';
    overlayText.textContent = `Every difference in all ${SCENES.length} scenes — final score ${state.score}, with ${state.mistakes} wrong clicks along the way.`;
    overlayButton.textContent = 'Play again';
  } else {
    overlayTitle.textContent = 'Scene complete!';
    overlayText.textContent = `${currentScene().title} cleared. Time bonus included — score ${state.score}. The next picture pair is trickier.`;
    overlayButton.textContent = 'Next scene';
  }
  overlayEl.hidden = false;
  updateHud();
}

function failLevel() {
  state.running = false;
  state.levelDone = true;
  overlayTitle.textContent = 'Time is up!';
  overlayText.textContent = `${remainingCount()} difference${remainingCount() === 1 ? '' : 's'} stayed hidden in ${currentScene().title}. Score so far: ${state.score}.`;
  overlayButton.textContent = 'Retry this scene';
  overlayEl.hidden = false;
  updateHud();
}

function handleFind(diff) {
  state.found.add(diff.id);
  state.foundAt.set(diff.id, performance.now());
  state.score += 100;
  state.timeLeft = Math.min(currentScene().timeLimit, state.timeLeft + 3);
  playFoundChime();
  setMessage(`Found: ${diff.label} (+100)`, 'good');
  if (remainingCount() === 0) completeLevel();
  updateHud();
}

function handleMiss(x, y) {
  state.mistakes += 1;
  state.score = Math.max(0, state.score - 25);
  state.timeLeft = Math.max(0, state.timeLeft - 5);
  state.misses.push({ x, y, at: performance.now() });
  playMissBuzz();
  setMessage('Not a difference — minus 5 seconds, minus 25 points.', 'bad');
  updateHud();
}

function panelPointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const bx = (event.clientX - rect.left) * scaleX;
  const by = (event.clientY - rect.top) * scaleY;
  const y = by - PANEL_Y;
  if (y < 0 || y > PANEL_HEIGHT) return null;
  if (bx >= LEFT_X && bx <= LEFT_X + PANEL_WIDTH) return { x: bx - LEFT_X, y, panel: 'left' };
  if (bx >= RIGHT_X && bx <= RIGHT_X + PANEL_WIDTH) return { x: bx - RIGHT_X, y, panel: 'right' };
  return null;
}

function onCanvasClick(event) {
  if (!state.running || state.levelDone) return;
  const point = panelPointFromEvent(event);
  if (!point) return;
  const scene = currentScene();
  let best = null;
  let bestDist = Infinity;
  for (const diff of scene.differences) {
    if (state.found.has(diff.id)) continue;
    const dist = Math.hypot(point.x - diff.x, point.y - diff.y);
    if (dist <= diff.r + 10 && dist < bestDist) {
      best = diff;
      bestDist = dist;
    }
  }
  if (best) handleFind(best);
  else handleMiss(point.x, point.y);
}

function useHint() {
  if (!state.running || state.levelDone) return;
  if (state.hintsLeft <= 0) {
    setMessage('No hints left — trust your eyes!', 'bad');
    return;
  }
  const next = currentScene().differences.find((d) => !state.found.has(d.id));
  if (!next) return;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 50);
  state.hintId = next.id;
  state.hintUntil = performance.now() + 2400;
  playHintPing();
  setMessage('A golden ring pulses somewhere… (-50 points)', '');
  updateHud();
}

function drawPanelLabel(text, x) {
  ctx.fillStyle = '#f4f1de';
  ctx.font = '700 19px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + PANEL_WIDTH / 2, 24);
}

function render(now) {
  ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
  const scene = currentScene();
  for (const [originX, changed] of [[LEFT_X, false], [RIGHT_X, true]]) {
    ctx.save();
    ctx.translate(originX, PANEL_Y);
    drawScenePanel(ctx, scene, changed);
    for (const diff of scene.differences) {
      if (state.found.has(diff.id)) {
        const age = (now - (state.foundAt.get(diff.id) ?? now)) / 1000;
        const pulse = age < 0.6 ? 1 - age / 0.6 : 0;
        drawFoundMarker(ctx, diff.x, diff.y, diff.r, pulse);
      } else if (state.hintId === diff.id && now < state.hintUntil) {
        drawHintMarker(ctx, diff.x, diff.y, diff.r, 0.5 + 0.5 * Math.sin(now / 130));
      }
    }
    ctx.restore();
  }
  drawPanelLabel('ORIGINAL', LEFT_X);
  drawPanelLabel('SPOT THE CHANGES', RIGHT_X);
  // Miss markers live in panel space; redraw them on both panels.
  state.misses = state.misses.filter((m) => now - m.at < 650);
  for (const miss of state.misses) {
    for (const originX of [LEFT_X, RIGHT_X]) {
      ctx.save();
      ctx.translate(originX, PANEL_Y);
      drawMissMarker(ctx, miss.x, miss.y, now - miss.at);
      ctx.restore();
    }
  }
  ctx.fillStyle = 'rgba(244,241,222,0.85)';
  ctx.font = '600 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Click a difference on either picture — ${remainingCount()} of ${scene.differences.length} still hidden`, BOARD_WIDTH / 2, BOARD_HEIGHT - 12);
}

function frame(now) {
  if (state.running && !shotMode) {
    if (state.lastTick) state.timeLeft -= (now - state.lastTick) / 1000;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      render(now);
      failLevel();
    }
    if ((now | 0) % 4 === 0) updateHud();
  }
  state.lastTick = now;
  render(now);
  requestAnimationFrame(frame);
}

// Deterministic setups for the maker's screenshots: ?shot=beach|cabin|market|finale
function applyShotSetup(name) {
  const setups = {
    beach: { scene: 0, found: ['sun-glasses', 'umbrella-colour', 'sail-colour'], time: 161, score: 300 },
    cabin: { scene: 1, found: ['moon-shape', 'window-dark', 'owl-gone', 'smoke-gone'], time: 173, score: 700 },
    market: { scene: 2, found: ['lantern-teal', 'cat-gone', 'hat-colour', 'sign-symbol', 'extra-balloon'], time: 188, score: 1200 },
    finale: { scene: 2, found: ['lantern-teal', 'awning-stripe', 'cat-gone', 'hat-colour', 'sign-symbol', 'clock-hand', 'extra-flag'], time: 96, score: 1700 },
  };
  const setup = setups[name] ?? setups.beach;
  loadScene(setup.scene, true);
  state.score = setup.score;
  state.timeLeft = setup.time;
  for (const id of setup.found) {
    state.found.add(id);
    state.foundAt.set(id, performance.now() - 5000);
  }
  state.running = false;
  setMessage('Mid-hunt: the green rings are found — the rest are still hiding.', '');
  updateHud();
}

canvas.addEventListener('click', onCanvasClick);
el('hint-button').addEventListener('click', useHint);
el('restart-button').addEventListener('click', () => loadScene(state.sceneIndex, true));
overlayButton.addEventListener('click', () => {
  if (state.gameWon) {
    state.gameWon = false;
    state.hintsLeft = 3;
    state.mistakes = 0;
    loadScene(0, false);
  } else if (!state.running && remainingCount() === 0) {
    loadScene(state.sceneIndex + 1, true);
  } else {
    loadScene(state.sceneIndex, true);
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') useHint();
  else if (event.key === 'r' || event.key === 'R') loadScene(state.sceneIndex, true);
  else if (event.key === 'Enter' && !overlayEl.hidden) overlayButton.click();
});

canvas.width = BOARD_WIDTH;
canvas.height = BOARD_HEIGHT;
if (shotMode) applyShotSetup(shotMode);
else loadScene(0, false);
updateHud();
requestAnimationFrame(frame);
