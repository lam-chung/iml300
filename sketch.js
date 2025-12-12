let img;
let blurred;

function preload() {
  img = loadImage("frosted-glass.jpg");
}

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.position(0, 0);
  c.style("z-index", "-1"); // send canvas behind content
  c.style("position", "fixed");

  createBlurred();
}

function createBlurred() {
  blurred = createGraphics(width, height);
  blurred.image(img, 0, 0, width, height);
  blurred.filter(BLUR, 12);
}

function draw() {
  image(blurred, 0, 0);

  let revealRadius = 140;

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(mouseX, mouseY, revealRadius, 0, TWO_PI);
  drawingContext.clip();

  image(img, 0, 0, width, height);

  drawingContext.restore();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createBlurred();
}
