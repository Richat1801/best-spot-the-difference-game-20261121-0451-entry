// artwork.js — all of Twin Vista's pictures are drawn here, procedurally,
// with canvas paths. drawScenePanel(ctx, scene, changed) paints one panel;
// `changed` is false for the left (original) picture and true for the right
// (altered) picture. Every difference id from scenes.js maps to exactly one
// conditional below, so the data and the art can never drift apart.

import { PANEL_WIDTH, PANEL_HEIGHT } from './scenes.js';

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function triangle(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function cloud(ctx, x, y, scale, fill) {
  ellipse(ctx, x, y, 34 * scale, 15 * scale, fill);
  ellipse(ctx, x - 22 * scale, y + 4 * scale, 22 * scale, 11 * scale, fill);
  ellipse(ctx, x + 24 * scale, y + 4 * scale, 24 * scale, 12 * scale, fill);
  ellipse(ctx, x + 2 * scale, y - 9 * scale, 22 * scale, 13 * scale, fill);
}

function star(ctx, x, y, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * rad;
    const py = y + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function pineTree(ctx, x, baseY, h, dark, light) {
  rect(ctx, x - 5, baseY - 16, 10, 18, '#6b4a2b');
  triangle(ctx, x, baseY - h, x - h * 0.30, baseY - h * 0.42, x + h * 0.30, baseY - h * 0.42, dark);
  triangle(ctx, x, baseY - h * 0.82, x - h * 0.36, baseY - h * 0.18, x + h * 0.36, baseY - h * 0.18, light);
  triangle(ctx, x, baseY - h * 0.60, x - h * 0.42, baseY + 2, x + h * 0.42, baseY + 2, dark);
}

function seagull(ctx, x, y, size, colour) {
  ctx.beginPath();
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.4;
  ctx.arc(x - size * 0.55, y, size * 0.55, Math.PI * 1.15, Math.PI * 1.95);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + size * 0.55, y, size * 0.55, Math.PI * 1.05, Math.PI * 1.85);
  ctx.stroke();
}

// ---------------------------------------------------------------- beach

function drawBeach(ctx, changed) {
  const sky = ctx.createLinearGradient(0, 0, 0, 250);
  sky.addColorStop(0, '#7ecbf2');
  sky.addColorStop(1, '#cdeffd');
  rect(ctx, 0, 0, PANEL_WIDTH, 250, sky);
  rect(ctx, 0, 0, PANEL_WIDTH, 250, 'rgba(0,0,0,0)');

  // Sun, top-left. Difference: sunglasses on the right picture.
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 5;
    ctx.moveTo(92 + Math.cos(a) * 40, 74 + Math.sin(a) * 40);
    ctx.lineTo(92 + Math.cos(a) * 54, 74 + Math.sin(a) * 54);
    ctx.stroke();
  }
  circle(ctx, 92, 74, 34, '#ffd60a');
  circle(ctx, 92, 74, 27, '#ffe45e');
  if (changed) {
    roundRect(ctx, 68, 64, 48, 15, 7, '#263238');
    rect(ctx, 62, 69, 8, 4, '#263238');
    rect(ctx, 114, 69, 8, 4, '#263238');
  } else {
    circle(ctx, 82, 70, 3.4, '#8a6d00');
    circle(ctx, 102, 70, 3.4, '#8a6d00');
    ctx.beginPath();
    ctx.arc(92, 78, 10, Math.PI * 0.15, Math.PI * 0.85);
    ctx.strokeStyle = '#8a6d00';
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }

  cloud(ctx, 218, 52, 1, '#ffffff');
  if (!changed) cloud(ctx, 330, 62, 0.72, '#ffffff'); // Difference: cloud vanished.
  cloud(ctx, 486, 44, 0.9, '#ffffff');
  seagull(ctx, 268, 108, 16, '#38618c');
  seagull(ctx, 306, 128, 12, '#38618c');

  // Sea and sand.
  rect(ctx, 0, 238, PANEL_WIDTH, 74, '#2a9d8f');
  rect(ctx, 0, 238, PANEL_WIDTH, 10, '#57c4ad');
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 3;
  for (const wy of [258, 282, 300]) {
    ctx.moveTo(18, wy);
    ctx.bezierCurveTo(90, wy - 7, 150, wy + 7, 230, wy);
    ctx.bezierCurveTo(310, wy - 7, 380, wy + 7, 470, wy);
  }
  ctx.stroke();
  const sand = ctx.createLinearGradient(0, 308, 0, PANEL_HEIGHT);
  sand.addColorStop(0, '#ffe8a3');
  sand.addColorStop(1, '#f7d774');
  rect(ctx, 0, 308, PANEL_WIDTH, PANEL_HEIGHT - 308, sand);

  // Sailboat. Difference: sail colour.
  rect(ctx, 168, 218, 58, 12, '#9c6644');
  triangle(ctx, 196, 152, 196, 216, 228, 216, changed ? '#ff8fab' : '#ffffff');
  triangle(ctx, 192, 168, 192, 216, 168, 216, '#ffd166');
  rect(ctx, 194, 148, 4, 70, '#6c5849');

  // Palm tree on the right. Difference: one coconut missing.
  ctx.beginPath();
  ctx.strokeStyle = '#7f5539';
  ctx.lineWidth = 13;
  ctx.moveTo(548, 316);
  ctx.quadraticCurveTo(536, 236, 516, 168);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = '#2d9d4e';
  ctx.lineWidth = 8;
  for (const [dx, dy] of [[-58, -18], [-30, -38], [8, -44], [44, -28], [58, 2]]) {
    ctx.moveTo(516, 164);
    ctx.quadraticCurveTo(516 + dx * 0.6, 164 + dy - 16, 516 + dx, 164 + dy + 12);
  }
  ctx.stroke();
  circle(ctx, 506, 176, 10, '#7f5539');
  if (!changed) circle(ctx, 526, 182, 10, '#936639'); // Difference: coconut gone.
  circle(ctx, 516, 160, 9, '#7f5539');

  // Beach umbrella. Difference: canopy colour.
  ctx.beginPath();
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 5;
  ctx.moveTo(452, 236);
  ctx.lineTo(466, 316);
  ctx.stroke();
  const canopy = changed ? '#4361ee' : '#ef476f';
  ctx.beginPath();
  ctx.moveTo(386, 240);
  ctx.quadraticCurveTo(452, 168, 518, 240);
  ctx.quadraticCurveTo(496, 226, 474, 240);
  ctx.quadraticCurveTo(452, 226, 430, 240);
  ctx.quadraticCurveTo(408, 226, 386, 240);
  ctx.closePath();
  ctx.fillStyle = canopy;
  ctx.fill();
  triangle(ctx, 452, 184, 430, 240, 474, 240, 'rgba(255,255,255,0.35)');
  // Towel and bucket under the umbrella.
  roundRect(ctx, 420, 336, 76, 34, 5, '#06d6a0');
  roundRect(ctx, 420, 350, 76, 7, 0, '#ffffff');
  triangle(ctx, 528, 330, 556, 330, 550, 356, '#f72585');
  rect(ctx, 526, 324, 32, 7, '#c9184a');

  // Difference: extra beach ball on the right picture.
  if (changed) {
    circle(ctx, 356, 368, 19, '#ef476f');
    ctx.beginPath();
    ctx.arc(356, 368, 19, Math.PI * 0.9, Math.PI * 1.5);
    ctx.fillStyle = '#ffd166';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(356, 368, 19, Math.PI * 1.7, Math.PI * 0.3);
    ctx.fillStyle = '#4cc9f0';
    ctx.fill();
    circle(ctx, 356, 368, 5, '#ffffff');
  } else {
    ellipse(ctx, 356, 372, 26, 7, 'rgba(160,120,40,0.35)');
    star(ctx, 330, 356, 8, '#e9c46a');
  }

  // Difference: starfish missing on the right picture.
  if (!changed) star(ctx, 118, 382, 20, '#ff8500');
  circle(ctx, 118, 382, changed ? 0.1 : 4, '#d00000');
  ellipse(ctx, 210, 398, 20, 6, 'rgba(160,120,40,0.35)');
  ellipse(ctx, 214, 392, 15, 10, '#f4a261');
  ellipse(ctx, 196, 390, 11, 8, '#e76f51');

  // Crab. Difference: shell colour.
  const crab = changed ? '#4361ee' : '#e63946';
  ellipse(ctx, 508, 396, 20, 13, crab);
  circle(ctx, 492, 380, 9, crab);
  circle(ctx, 524, 380, 9, crab);
  circle(ctx, 500, 390, 2.6, '#1d3557');
  circle(ctx, 516, 390, 2.6, '#1d3557');
  ctx.beginPath();
  ctx.strokeStyle = crab;
  ctx.lineWidth = 3;
  for (const s of [-1, 1]) {
    ctx.moveTo(508 + s * 16, 404);
    ctx.lineTo(508 + s * 28, 412);
    ctx.moveTo(508 + s * 8, 406);
    ctx.lineTo(508 + s * 14, 416);
  }
  ctx.stroke();
}

// ---------------------------------------------------------------- cabin

function drawCabin(ctx, changed) {
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_HEIGHT);
  sky.addColorStop(0, '#1d2a5e');
  sky.addColorStop(0.55, '#5a4a8a');
  sky.addColorStop(1, '#c86b4a');
  rect(ctx, 0, 0, PANEL_WIDTH, PANEL_HEIGHT, sky);

  // Stars. Difference: the bright star at (150,52) goes out.
  const stars = [[40, 40], [88, 96], [210, 36], [268, 84], [352, 30], [420, 88], [462, 36], [556, 118], [36, 150], [196, 120]];
  for (const [sx, sy] of stars) star(ctx, sx, sy, 4.5, 'rgba(255,244,190,0.9)');
  if (!changed) star(ctx, 150, 52, 9, '#fff3b0');

  // Moon. Difference: crescent becomes full.
  circle(ctx, 512, 66, 27, '#f4f1de');
  if (!changed) {
    circle(ctx, 498, 58, 24, '#27306e');
    circle(ctx, 524, 78, 3.4, '#d8d3b8');
  } else {
    circle(ctx, 502, 58, 4, '#ddd8bd');
    circle(ctx, 522, 76, 5.4, '#ddd8bd');
    circle(ctx, 508, 80, 3, '#ddd8bd');
  }

  // Distant pines and ground.
  pineTree(ctx, 36, 300, 150, '#14213d', '#1e3a2f');
  pineTree(ctx, 84, 306, 118, '#14213d', '#1e3a2f');
  pineTree(ctx, 470, 302, 132, '#14213d', '#1e3a2f');
  pineTree(ctx, 524, 308, 104, '#14213d', '#1e3a2f');
  rect(ctx, 0, 300, PANEL_WIDTH, PANEL_HEIGHT - 300, '#22331f');
  ellipse(ctx, 300, 448, 340, 42, '#2c4427');

  // Owl on a branch, left. Difference: owl gone.
  ctx.beginPath();
  ctx.strokeStyle = '#3a2a18';
  ctx.lineWidth = 7;
  ctx.moveTo(28, 196);
  ctx.quadraticCurveTo(84, 210, 138, 198);
  ctx.stroke();
  if (!changed) {
    ellipse(ctx, 96, 186, 15, 19, '#8a6d4b');
    circle(ctx, 96, 168, 12, '#a98a5f');
    circle(ctx, 91, 167, 3.4, '#ffe45e');
    circle(ctx, 101, 167, 3.4, '#ffe45e');
    circle(ctx, 91, 167, 1.5, '#111111');
    circle(ctx, 101, 167, 1.5, '#111111');
    triangle(ctx, 93, 172, 99, 172, 96, 177, '#ffb703');
  }

  // Cabin body.
  roundRect(ctx, 218, 208, 190, 128, 4, '#7f5539');
  for (let i = 0; i < 5; i++) rect(ctx, 218, 232 + i * 22, 190, 3, '#5f4128');
  triangle(ctx, 190, 214, 436, 214, 313, 128, '#4a3220');
  triangle(ctx, 204, 208, 422, 208, 313, 140, '#5d4128');
  rect(ctx, 226, 138, 26, 46, '#5d4128');

  // Chimney smoke. Difference: no smoke on the right picture.
  if (!changed) {
    ellipse(ctx, 240, 112, 12, 9, 'rgba(230,230,240,0.65)');
    ellipse(ctx, 250, 92, 17, 12, 'rgba(230,230,240,0.5)');
    ellipse(ctx, 264, 68, 23, 15, 'rgba(230,230,240,0.38)');
  }

  // Windows. Difference: right window dark.
  roundRect(ctx, 240, 238, 34, 34, 3, '#ffd166');
  rect(ctx, 255, 238, 3, 34, '#5d4128');
  rect(ctx, 240, 253, 34, 3, '#5d4128');
  roundRect(ctx, 330 - 17, 238, 34, 34, 3, changed ? '#2b2d42' : '#ffd166');
  if (!changed) {
    rect(ctx, 330, 238, 3, 34, '#5d4128');
    rect(ctx, 313, 253, 34, 3, '#5d4128');
  }
  // Door.
  roundRect(ctx, 356, 252, 36, 84, 3, '#4a3220');
  circle(ctx, 364, 296, 3.4, '#ffd166');

  // Door lantern. Difference: glow colour.
  rect(ctx, 424, 268, 4, 16, '#222222');
  const lantern = changed ? '#4cc9f0' : '#ffb703';
  roundRect(ctx, 416, 282, 20, 24, 4, lantern);
  ellipse(ctx, 426, 294, 26, 18, changed ? 'rgba(76,201,240,0.30)' : 'rgba(255,183,3,0.30)');

  // Path, fence and foreground details.
  ctx.beginPath();
  ctx.moveTo(352, 336);
  ctx.lineTo(398, 336);
  ctx.lineTo(438, PANEL_HEIGHT);
  ctx.lineTo(322, PANEL_HEIGHT);
  ctx.closePath();
  ctx.fillStyle = '#8a7a5c';
  ctx.fill();
  // Fence left. Difference: one plank missing.
  rect(ctx, 22, 322, 130, 6, '#5d4128');
  rect(ctx, 22, 344, 130, 6, '#5d4128');
  for (let i = 0; i < 5; i++) {
    if (changed && i === 2) continue; // the gap at x≈70
    rect(ctx, 30 + i * 26, 306, 12, 58, '#77552f');
    triangle(ctx, 30 + i * 26, 306, 42 + i * 26, 306, 36 + i * 26, 296, '#77552f');
  }
  // Tall pine right with leafy top star. Difference: top star gone.
  pineTree(ctx, 556, 330, 150, '#17301f', '#245032');
  if (!changed) star(ctx, 556, 176, 13, '#ffd60a');

  // Difference: extra mushroom on the right picture.
  if (changed) {
    ctx.beginPath();
    ctx.arc(492, 384, 15, Math.PI, 0);
    ctx.fillStyle = '#e63946';
    ctx.fill();
    rect(ctx, 486, 384, 12, 12, '#f1fa8c');
    circle(ctx, 486, 378, 3, '#ffffff');
    circle(ctx, 498, 374, 2.4, '#ffffff');
  } else {
    ellipse(ctx, 492, 392, 18, 5, 'rgba(0,0,0,0.25)');
  }
  ellipse(ctx, 120, 402, 26, 8, '#314f2a');
  ellipse(ctx, 160, 412, 18, 6, '#314f2a');
  circle(ctx, 180, 366, 5, '#ffd166');
  circle(ctx, 196, 378, 3.6, '#ffd166');
}

// ---------------------------------------------------------------- market

function drawMarket(ctx, changed) {
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_HEIGHT);
  sky.addColorStop(0, '#ffd9a0');
  sky.addColorStop(0.5, '#ffb38a');
  sky.addColorStop(1, '#ff8fa3');
  rect(ctx, 0, 0, PANEL_WIDTH, PANEL_HEIGHT, sky);
  circle(ctx, 556, 52, 24, '#fff3b0');

  // Buildings.
  rect(ctx, 0, 92, 150, 226, '#b08968');
  rect(ctx, 150, 60, 300, 258, '#a98467');
  rect(ctx, 450, 100, 150, 218, '#96705a');
  rect(ctx, 0, 92, 150, 12, '#7f5539');
  rect(ctx, 450, 100, 150, 12, '#7f5539');
  for (const [wx, wy] of [[28, 130], [86, 130], [478, 140], [534, 140]]) {
    roundRect(ctx, wx, wy, 30, 38, 3, '#ffe8a3');
    rect(ctx, wx + 13, wy, 3, 38, '#7f5539');
  }

  // Clock tower centre-top. Difference: minute hand missing.
  rect(ctx, 282, 18, 36, 44, '#7f5539');
  triangle(ctx, 272, 20, 328, 20, 300, -2, '#5d4128');
  circle(ctx, 300, 66, 20, '#fff8e1');
  ctx.beginPath();
  ctx.arc(300, 66, 20, 0, Math.PI * 2);
  ctx.strokeStyle = '#5d4128';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 3;
  ctx.moveTo(300, 66);
  ctx.lineTo(300, 54);
  ctx.stroke();
  if (!changed) {
    ctx.beginPath();
    ctx.lineWidth = 2.2;
    ctx.moveTo(300, 66);
    ctx.lineTo(311, 71);
    ctx.stroke();
  }

  // Pennant string across the top. Difference: extra flag.
  ctx.beginPath();
  ctx.strokeStyle = '#5d4128';
  ctx.lineWidth = 2;
  ctx.moveTo(6, 30);
  ctx.quadraticCurveTo(150, 66, 282, 44);
  ctx.moveTo(328, 44);
  ctx.quadraticCurveTo(470, 66, 594, 28);
  ctx.stroke();
  const flags = [
    [60, 44, '#ef476f'], [118, 54, '#ffd166'], [176, 56, '#06d6a0'], [232, 50, '#4cc9f0'],
    [376, 52, '#ffd166'], [428, 58, '#ef476f'], [520, 48, '#06d6a0'],
  ];
  for (const [fx, fy, fc] of flags) triangle(ctx, fx, fy, fx + 22, fy + 4, fx + 4, fy + 22, fc);
  if (changed) triangle(ctx, 470, 60, 492, 62, 474, 82, '#f72585'); // extra pennant

  // Hanging lanterns. Difference: left lantern colour.
  for (const [lx, lc] of [[84, changed ? '#06d6a0' : '#ef476f'], [196, '#ffd166'], [516, '#ef476f']]) {
    rect(ctx, lx - 1, 66, 2, 16, '#5d4128');
    ellipse(ctx, lx, 96, 15, 19, lc);
    rect(ctx, lx - 8, 80, 16, 3, '#5d4128');
    rect(ctx, lx - 8, 110, 16, 3, '#5d4128');
  }

  // Ground.
  rect(ctx, 0, 318, PANEL_WIDTH, PANEL_HEIGHT - 318, '#9c6644');
  for (let i = 0; i < 9; i++) rect(ctx, i * 70 + 8, 356, 46, 5, 'rgba(0,0,0,0.13)');
  for (let i = 0; i < 7; i++) rect(ctx, i * 88 + 30, 402, 52, 5, 'rgba(0,0,0,0.13)');

  // Big stall awning. Difference: one stripe missing (turns cream).
  const awningTop = 118;
  for (let i = 0; i < 6; i++) {
    const stripeX = 218 + i * 28;
    let fill = i % 2 === 0 ? '#ef476f' : '#fff8e1';
    if (changed && i === 3) fill = '#fff8e1';
    if (changed && i === 2) fill = '#fff8e1';
    ctx.beginPath();
    ctx.moveTo(stripeX, awningTop + 20);
    ctx.lineTo(stripeX + 28, awningTop + 20);
    ctx.lineTo(stripeX + 36, awningTop + 52);
    ctx.lineTo(stripeX - 8, awningTop + 52);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }
  rect(ctx, 226, 170, 6, 148, '#5d4128');
  rect(ctx, 392, 170, 6, 148, '#5d4128');
  // Stall counter and goods.
  rect(ctx, 214, 282, 196, 36, '#7f5539');
  for (const [gx, gc] of [[240, '#e63946'], [264, '#ffb703'], [288, '#06d6a0'], [312, '#e63946'], [336, '#ffb703'], [360, '#06d6a0']]) {
    circle(ctx, gx, 272, 11, gc);
  }
  roundRect(ctx, 236, 238, 30, 20, 3, '#ffd166');
  roundRect(ctx, 330, 232, 42, 26, 3, '#4cc9f0');

  // Fruit seller behind the counter. Difference: hat colour.
  circle(ctx, 196, 262, 15, '#f1c27d');
  ellipse(ctx, 196, 238, 20, 9, changed ? '#06d6a0' : '#ef476f');
  rect(ctx, 188, 224, 16, 8, changed ? '#06d6a0' : '#ef476f');
  roundRect(ctx, 178, 276, 36, 42, 6, '#4361ee');

  // Shop sign, left. Difference: symbol star becomes circle.
  roundRect(ctx, 40, 172, 60, 48, 5, '#5d4128');
  roundRect(ctx, 45, 177, 50, 38, 4, '#ffe8a3');
  if (changed) circle(ctx, 70, 196, 11, '#e63946');
  else star(ctx, 70, 196, 13, '#e63946');

  // Crates with a cat. Difference: cat gone.
  rect(ctx, 92, 330, 62, 34, '#b08968');
  rect(ctx, 92, 330, 62, 5, '#7f5539');
  rect(ctx, 106, 296, 62, 34, '#b08968');
  rect(ctx, 106, 296, 62, 5, '#7f5539');
  for (const [ox, oy] of [[122, 310], [140, 310], [131, 300]]) circle(ctx, ox, oy, 7, '#ff8500');
  if (!changed) {
    ellipse(ctx, 128, 288, 17, 10, '#606c78');
    circle(ctx, 142, 280, 9, '#606c78');
    triangle(ctx, 135, 274, 140, 274, 136, 264, '#606c78');
    triangle(ctx, 144, 274, 149, 274, 147, 264, '#606c78');
    circle(ctx, 139, 280, 1.8, '#111111');
    circle(ctx, 146, 280, 1.8, '#111111');
    ctx.beginPath();
    ctx.strokeStyle = '#606c78';
    ctx.lineWidth = 4;
    ctx.moveTo(112, 292);
    ctx.quadraticCurveTo(98, 282, 104, 268);
    ctx.stroke();
  }

  // Balloon bunch by the right stall. Difference: extra balloon.
  ctx.beginPath();
  ctx.strokeStyle = '#444444';
  ctx.lineWidth = 1.6;
  ctx.moveTo(404, 236);
  ctx.lineTo(392, 200);
  ctx.moveTo(404, 236);
  ctx.lineTo(408, 202);
  ctx.stroke();
  ellipse(ctx, 390, 184, 13, 17, '#ef476f');
  ellipse(ctx, 410, 186, 13, 17, '#ffd166');
  if (changed) ellipse(ctx, 404, 164, 12, 16, '#06d6a0');
  circle(ctx, 404, 240, 13, '#f1c27d');
  roundRect(ctx, 390, 252, 28, 66, 6, '#8338ec');

  // Barrel, right foreground. Difference: middle hoop missing.
  roundRect(ctx, 428, 336, 52, 66, 8, '#9c6644');
  rect(ctx, 428, 348, 52, 5, '#5d4128');
  if (!changed) rect(ctx, 428, 370, 52, 5, '#3d405b');
  rect(ctx, 428, 370 + 22, 52, 5, '#5d4128');
  ellipse(ctx, 454, 338, 26, 7, '#b08968');

  // Potted flowers, far right. Difference: flower colour.
  triangle(ctx, 512, 356, 544, 356, 538, 386, '#c9184a');
  rect(ctx, 522, 330, 4, 28, '#2d9d4e');
  rect(ctx, 534, 334, 4, 24, '#2d9d4e');
  const flower = changed ? '#4cc9f0' : '#ffd166';
  star(ctx, 524, 330, 10, flower);
  star(ctx, 536, 334, 9, flower);
  ellipse(ctx, 528, 346, 12, 6, '#2d9d4e');
}

// ---------------------------------------------------------------- panels

const PAINTERS = { beach: drawBeach, cabin: drawCabin, market: drawMarket };

export function drawScenePanel(ctx, scene, changed) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  const paint = PAINTERS[scene.id] ?? drawBeach;
  paint(ctx, changed);
  ctx.restore();
  ctx.strokeStyle = 'rgba(20,24,40,0.55)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, PANEL_WIDTH - 2, PANEL_HEIGHT - 2);
}

export function drawFoundMarker(ctx, x, y, r, pulse) {
  const radius = r + 7 + (pulse ? Math.sin(pulse * Math.PI * 2) * 3 : 0);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#00e676';
  ctx.fill();
}

export function drawHintMarker(ctx, x, y, r, strength) {
  ctx.beginPath();
  ctx.arc(x, y, r + 14, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 213, 79, ${0.35 + strength * 0.6})`;
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 6]);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function drawMissMarker(ctx, x, y, age) {
  const alpha = Math.max(0, 1 - age / 600);
  ctx.beginPath();
  ctx.strokeStyle = `rgba(239, 71, 111, ${alpha})`;
  ctx.lineWidth = 4;
  const s = 10;
  ctx.moveTo(x - s, y - s);
  ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s, y - s);
  ctx.lineTo(x - s, y + s);
  ctx.stroke();
}
