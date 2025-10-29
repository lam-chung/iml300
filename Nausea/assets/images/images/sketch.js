let img;        // original image
let baseG;      // offscreen buffer sized to canvas
let mx = 0, my = 0;      // smoothed mouse
let targetMX = 0, targetMY = 0;

function preload() {
  // Make sure 14.jpg is in the same folder as index.html/sketch.js
  img = loadImage("14.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noCursor();
  baseG = createGraphics(width, height);
  renderBase(); // draw the scaled image into baseG once to start
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  baseG = createGraphics(width, height);
  renderBase();
}

function renderBase() {
  // Draw img into baseG, scaled to "cover" the canvas, centered
  baseG.push();
  baseG.clear();
  baseG.background(0);

  const s = max(width / img.width, height / img.height);
  const w = img.width * s;
  const h = img.height * s;
  const x = (width - w) * 0.5;
  const y = (height - h) * 0.5;

  baseG.image(img, x, y, w, h);
  baseG.pop();
}

function draw() {
  // Smooth the mouse so the glitch trails a bit
  targetMX = mouseX || width * 0.5;
  targetMY = mouseY || height * 0.5;
  mx = lerp(mx, targetMX, 0.2);
  my = lerp(my, targetMY, 0.2);

  // Draw subtle RGB chromatic offset around the pointer
  background(0);

  // Base layer
  image(baseG, 0, 0);

  // Fringe strength based on distance to center (optional)
  const d = dist(mx, my, width * 0.5, height * 0.5);
  const maxOffset = map(d, 0, width * 0.8, 0.5, 2.5, true);

  push();
  blendMode(ADD);
  // Red layer (slightly right/up)
  tint(255, 0, 0, 100);
  image(baseG, maxOffset, -maxOffset);
  // Green layer (slightly left/down)
  tint(0, 255, 0, 100);
  image(baseG, -maxOffset, maxOffset);
  // Blue layer (slightly right/down)
  tint(0, 0, 255, 100);
  image(baseG, maxOffset, maxOffset);
  pop();
  noTint();

  // Mouse-centric slice glitching
  randomSeed(frameCount * 9973); // stable randomness per frame
  const R = 140;                 // radius around mouse to affect
  const nSlices = 38;            // number of slice moves per frame

  for (let i = 0; i < nSlices; i++) {
    // pick a random slice center near mouse
    const ang = random(TWO_PI);
    const rad = pow(random(), 0.6) * R; // denser near mouse
    const sxCenter = mx + cos(ang) * rad;
    const syCenter = my + sin(ang) * rad;

    // random slice size
    const sw = floor(random(16, 120));
    const sh = floor(random(6, 60));

    // top-left of source rect
    const sx = constrain(sxCenter - sw / 2, 0, width - sw);
    const sy = constrain(syCenter - sh / 2, 0, height - sh);

    // displacement amount increases the closer to the mouse
    const near = 1.0 - constrain(dist(mx, my, sxCenter, syCenter) / R, 0, 1);
    const jitter = 6 + near * 24;
    const dx = floor(sx + random(-jitter, jitter));
    const dy = floor(sy + random(-jitter, jitter));

    // Copy a slice from baseG and place it slightly offset on the main canvas
    copy(baseG, sx, sy, sw, sh, dx, dy, sw, sh);

    // Occasionally add a horizontal “tear”
    if (random() < 0.08) {
      const tearH = floor(random(2, 8));
      const ty = constrain(sy + floor(random(-8, 8)), 0, height - tearH);
      const tShift = floor(random(-40, 40) * (0.5 + near));
      copy(baseG, 0, ty, width, tearH, tShift, ty, width, tearH);
    }
  }

 

  // Re-render the base every few frames to keep copies sharp (optional)
  if (frameCount % 100 === 0) renderBase();
}

// Mobile support: follow last touch
function touchMoved() {
  targetMX = mouseX;
  targetMY = mouseY;
  return false;
}

// Optional: press 's' to save a frame
function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('glitch_frame', 'png');
}
