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
  background("#00080f");

  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw() {
  // How much to shift hue each frame (degrees)
  const HUE_SHIFT_PER_FRAME = 50;
  // Posterize levels per channel for background
  const POST_LEVELS = 5;

  for (let n = 0; n < 10000; n++) {
    // pick a random pixel
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));

    // get the original RGB and mask value
    let pix    = sourceImg.get(x, y);
    let maskVal= maskImg.get(x, y)[0];

    if (maskVal > 128) {
      // playing with hues
      colorMode(HSB, 360, 100, 100, 255);
      let c = color(pix[0], pix[1], pix[2]);
      let h = (hue(c) + renderCounter * HUE_SHIFT_PER_FRAME) % 360;
      let s = saturation(c);
      let b = brightness(c);
      // set fill back to this new HSB color
      fill(h, s, b);

      // draw a dot
      ellipse(x, y, map(b, 0, 100, 12, 2), map(b, 0, 100, 12, 2));

    } else {
      // outside statue: POSTERIZE

      // switch back to RGB
      colorMode(RGB, 255, 255, 255, 255);

      // reduce each channel to POST_LEVELS steps
      let step = 255 / (POST_LEVELS - 1);
      let rP = floor(pix[0] / step) * step;
      let gP = floor(pix[1] / step) * step;
      let bP = floor(pix[2] / step) * step;

      fill(rP, gP, bP);
      // draw a little rectangle “brush”
      rect(x, y, 6, 6);
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
