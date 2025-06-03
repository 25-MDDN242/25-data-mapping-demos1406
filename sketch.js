let sourceImg = null;
let maskImg = null;
let renderCounter = 0;

let maskCenter = null;
let maskCenterSize = null;

// change these three lines as appropriate
let sourceFile = "input_1.jpg";
let maskFile = "mask_1.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup() {
  createCanvas(1920, 1080).parent("canvasContainer");
  pixelDensity(1);
  imageMode(CENTER);
  noStroke();
  background("#fff");

  sourceImg.loadPixels();
  maskImg.loadPixels();

  maskCenterSearcher(20);
  maskSizeFinder(20);
}

function draw() {
  // Posterize levels per channel for background
  const p_levels = 5;

  for (let n = 0; n < 12000; n++) {
    // pick a random pixel
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));

    // get the original RGB and mask value
    let pix = sourceImg.get(x, y);
    let maskVal = maskImg.get(x, y)[0];

    if (maskVal > 128) {
      // ----- STATUE REGION -----
      let grey = (pix[0] + pix[1] + pix[2]) / 3;
      grey = 127.5 + (grey - 127.5) * 3;
      grey = constrain(grey, 0, 255);

      let xBound = width / 2 - 50;
      let yBound = 300;
      let radius = 200;
      let d = dist(x, y, xBound, yBound);

      if (d < radius) {
        stroke(grey * 2, grey * 0.7, grey);
      } else {
        stroke(grey * 0.2, grey * 0.5, grey);
      }
      strokeWeight(0.5);
      line(x + 5, y + 5, x - 5, y - 5);
      line(x - 5, y + 5, x + 5, y - 5);
    } else {
      // ----- BACKGROUND REGION -----

      // Generate Perlin noise based on position
      let noiseVal = noise(x * 0.01, y * 0.01);
      let alpha = map(noiseVal, 0, 1, 0, 50);

      stroke(255, 255, 200, alpha);
      strokeWeight(5);
      line(x, y + 10, x, y - 10);
      line(x + 10, y, x - 10, y);
    }
  }

  updatePixels();

  if (maskCenter !== null) {
    strokeWeight(5);
    fill(0, 0, 255);
    stroke(255, 255, 255);
    ellipse(maskCenter[0], maskCenter[1], 100);
    line(
      maskCenter[0] - 200,
      maskCenter[1],
      maskCenter[0] + 200,
      maskCenter[1]
    );
    line(
      maskCenter[0],
      maskCenter[1] - 200,
      maskCenter[0],
      maskCenter[1] + 200
    );
    noFill();
    let mcw = maskCenterSize[0];
    let mch = maskCenterSize[1];
    rect(maskCenter[0] - mcw / 2, maskCenter[1] - mch / 2, mcw, mch);
  }

  renderCounter++;
  if (renderCounter > 10) {
    console.log("Done!");
    noLoop();
    // saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key === "!") {
    saveBlocksImages();
  }
}

function maskCenterSearcher(min_width) {
  let mask_x_sum = 0;
  let mask_y_sum = 0;
  let mask_count = 0;

  print("Scanning mask top to bottom...");
  for (let j = 0; j < maskImg.height; j++) {
    for (let i = 0; i < maskImg.width; i++) {
      let maskData = maskImg.get(i, j);
      if (maskData[1] > 128) {
        mask_x_sum += i;
        mask_y_sum += j;
        mask_count++;
      }
    }
  }

  print("Mask Center Located!");
  if (mask_count > min_width) {
    let avg_x_pos = int(mask_x_sum / mask_count);
    let avg_y_pos = int(mask_y_sum / mask_count);
    maskCenter = [avg_x_pos, avg_y_pos];
    print("Center set to: " + maskCenter);
  }
}

function maskSizeFinder(min_width) {
  let max_up_down = 0;
  let max_left_right = 0;

  print("Scanning mask top to bottom...");
  for (let j = 0; j < maskImg.height; j++) {
    let mask_count = 0;
    for (let i = 0; i < maskImg.width; i++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) mask_count++;
    }
    max_left_right = max(mask_count, max_left_right);
  }

  print("Scanning mask left to right...");
  for (let i = 0; i < maskImg.width; i++) {
    let mask_count = 0;
    for (let j = 0; j < maskImg.height; j++) {
      let mask = maskImg.get(i, j);
      if (mask[1] > 128) mask_count++;
    }
    max_up_down = max(mask_count, max_up_down);
  }

  print("Scanning mask done!");
  if (max_left_right > min_width && max_up_down > min_width) {
    maskCenterSize = [max_left_right, max_up_down];
    print("Size set to: " + maskCenterSize);
  }
}
