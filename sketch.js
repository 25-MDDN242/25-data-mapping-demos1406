let sourceImg = null;
let maskImg = null;
let renderCounter = 0;

// change these three lines as appropriate
let sourceFile = "input_new3.jpg";
let maskFile = "mask_new3.png";
let outputFile = "output_6.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup() {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent("canvasContainer");

  imageMode(CENTER);
  noStroke();
  background("#fcfbf7");
  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw() {
  // 1) foreground dots / background CMY halftone
  for (let i = 0; i < 6000; i++) {
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    let pixData = sourceImg.get(x, y);
    let maskData = maskImg.get(x, y);

    // map pixel coords → canvas coords
    let drawX = x * (width / sourceImg.width);
    let drawY = y * (height / sourceImg.height);
    if (maskData[0] > 128) {
      // --- statue dots (with gamma‐corrected brightness) ---
      let c0 = color(pixData);
      let rawB = brightness(c0); // 0–100
      // push brightness extremes: gamma > 1 makes darks darker and lights lighter
      let gamma = 1.6;
      let bNorm = rawB / 100.0; // normalize 0–1
      let b = pow(bNorm, gamma) * 100; // back to 0–100

      // now your cluster logic as before
      let clusterCount = 0;
      if (b < 30) clusterCount = 3;
      else if (b < 60) clusterCount = 2;
      else if (b < 85) clusterCount = 1;

      for (let j = 0; j < clusterCount; j++) {
        let offsetX = random(-4, 4),
          offsetY = random(-4, 4);

        // because you’ve pushed the midtones darker,
        // more pixels will fall under the “b < 50” check and get magenta
        let dotColor;
        if (b < 50) dotColor = color(255, 100, 150);
        else if (b < 75) dotColor = color(0, 255, 255);
        else dotColor = color(255, 255, 0);

        fill(dotColor);
        noStroke();
        ellipse(drawX + offsetX, drawY + offsetY, 4);
      }
    } else {
      // --- background area ---
      let c = color(pixData);
      colorMode(HSB, 360, 100, 100);
      let h = hue(c);
      let bgTint = color(h, 10, 0);
      colorMode(RGB, 255);

      // 2) Brick‐pattern: width ∈ [8…2] based on brightness
      let br = brightness(c);           // 0–100
      let bw = map(br, 0, 60, 20, 10);
      let drawX = x * (width/sourceImg.width);
      let drawY = y * (height/sourceImg.height);

      // Snap drawX/drawY to a fixed “brick grid” to keep alignment
      drawX = floor(drawX / 10) * 10 + 5;
      drawY = floor(drawY / 10) * 10 + 5;

      fill(bgTint, 30, 90);
      noStroke();
      rect(drawX, drawY, bw, bw * 0.5); // a small “brick‐like” rectangle

      // 3) Overlay a tiny black stroke (1px) at random angle for texture
      push();
        translate(drawX, drawY);
        rotate(random([-PI/8, PI/8]));  // just ±22.5° randomly
        stroke(0, 80);
        strokeWeight(1);
        line(-bw/2, 0, bw/2, 0);
      pop();
      colorMode(RGB, 255);

    }
  }

  // 2) small halftone overlay on the statue
  let step = 8;
  for (let y = 0; y < sourceImg.height; y += step) {
    for (let x = 0; x < sourceImg.width; x += step) {
      let maskData = maskImg.get(x, y);
      if (maskData[0] > 128) {
        let c = color(sourceImg.get(x, y));
        let b = brightness(c);
        let dotSize = map(b, 40, 100, step, 2);

        // map to canvas
        let dx = x * (width / sourceImg.width);
        let dy = y * (height / sourceImg.height);

        fill(0);
        noStroke();
        ellipse(dx, dy, dotSize);
      }
    }
  }

  // 3) finish
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
