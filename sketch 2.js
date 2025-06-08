let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_3.jpg";
let maskFile   = "mask_3.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  //console.log(p5.Renderer2D);

}
function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(240, 237, 230);
  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw() {
  for (let i = 0; i < 8000; i++) {
  let x = floor(random(sourceImg.width));
  let y = floor(random(sourceImg.height));
  let pixData = sourceImg.get(x, y);
  let maskData = maskImg.get(x, y);


    if (maskData[0] > 128) {
      let c = color(pixData);
      let b = brightness(c); // brightness 0–100

      let clusterCount = 0;
      if (b < 30) clusterCount = 3;
      else if (b < 60) clusterCount = 2;
      else if (b < 85) clusterCount = 1;

      let drawX = x * (width / sourceImg.width);
      let drawY = y * (height / sourceImg.height);

      for (let j = 0; j < clusterCount; j++) {
        let offsetX = random(-4, 4);
        let offsetY = random(-4, 4);

        // You can randomize color a bit for flair or base it on hue
        let dotColor;
        if (b < 50) dotColor = color(255, 100, 150); // magenta
        else if (b < 75) dotColor = color(0, 255, 255); // cyan
        else dotColor = color(255, 255, 0); // yellow

        fill(dotColor);
        noStroke();
        ellipse(drawX + offsetX, drawY + offsetY, 4); // small dot
      }
    } else {
      let c = color(pixData);
      colorMode(HSB, 360, 100, 100);
      let h = hue(c);
      let bgTint = color(h, 30, 90);
      colorMode(RGB, 255);

      // 2) Brick‐pattern: width ∈ [8…2] based on brightness
      let br = brightness(c);           // 0–100
      let bw = map(br, 0, 100, 20, 10);
      let drawX = x * (width/sourceImg.width);
      let drawY = y * (height/sourceImg.height);

      // Snap drawX/drawY to a fixed “brick grid” to keep alignment
      drawX = floor(drawX / 10) * 10 + 5;
      drawY = floor(drawY / 10) * 10 + 5;

      fill(h, 30, 90);
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
  // blendMode(MULTIPLY);
  let step = 9; // grid spacing for halftone layer
    for (let y = 0; y < sourceImg.height; y += step) {
      for (let x = 0; x < sourceImg.width; x += step) {
        let maskData = maskImg.get(x, y);
        if (maskData[0] > 128) {
          let c = color(sourceImg.get(x, y));
          let b = brightness(c);
          let dotSize = map(b, 40, 100, step, 2); // darker = bigger dot

          fill(0); // semi-transparent black
          noStroke();
          ellipse(x, y, dotSize);
        }
      }
    }

  renderCounter = renderCounter + 1;
  if(renderCounter > 10) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}