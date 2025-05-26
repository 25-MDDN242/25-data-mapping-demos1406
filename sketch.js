let sourceImg = null;
let maskImg   = null;
let renderCounter = 0;

// change these three lines as appropriate
let sourceFile = "input_3.jpg";
let maskFile   = "mask_3.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg   = loadImage(maskFile);
}

function setup() {
  createCanvas(1920, 1080).parent('canvasContainer');
  pixelDensity(1);
  imageMode(CENTER);
  noStroke();
  background("#422c77");

  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw() {
  // Posterize levels per channel for background
  const p_levels = 16;

  for (let n = 0; n < 5000; n++) {
    // pick a random pixel
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));

    // get the original RGB and mask value
    let pix    = sourceImg.get(x, y);
    let maskVal= maskImg.get(x, y)[0];

    if (maskVal > 128) {
      colorMode(RGB, 255);

      let n = noise(x * 0.05, y * 0.05, x * y * 0.0001);
      let base = n * 255;

      // Occasionally glitch a color channel
      let r = base;
      let g = base;
      let b = base;
      if (random() < 0.02) r += random(50, 100);
      if (random() < 0.02) g += random(50, 100);
      if (random() < 0.02) b += random(50, 100);

      // Occasional bright flash dots
      if (random() < 0.001) {
        r = g = b = 255;
      }

      // Small squares with offset positions (jitter effect)
      let xOffset = floor(random(-1, 2));
      let yOffset = floor(random(-1, 2));
      fill(r, g, b, 200);
      rect(x + xOffset, y + yOffset, 10, 5);
    }else {
      // outside statue: posterize
      // reduce each channel to p_levels steps
      let step = 255 / (p_levels - 1);
      let rP = floor(pix[0] / step) * step;
      let gP = floor(pix[1] / step) * step;
      let bP = floor(pix[2] / step) * step;

      fill(rP, gP, bP);
      rect(x, y, 100, 5);
    }
  }

  updatePixels();  // flush the set() / fill() calls

  renderCounter++;
  if (renderCounter > 10) {
    console.log("Done!");
    noLoop();
    // saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key === '!') {
    saveBlocksImages();
  }
}
