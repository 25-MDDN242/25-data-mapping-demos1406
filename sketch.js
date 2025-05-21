let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile   = "mask_1.png";
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
  background("#00080f");
  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw () {
  for(let i=0;i<6500;i++) {
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    let pixData = sourceImg.get(x, y);
    let maskData = maskImg.get(x, y);
    fill(pixData);
    if (maskData[0] > 128) {
      // Statue area: draw lines that look like stars
      stroke(pixData);
      strokeWeight(1);
      for (let a = 0; a < TWO_PI; a += PI / 4) {
        let len = 5; // length of each line
        let x2 = x + cos(a) * len
        let y2 = y + sin(a) * len
        line(x, y, x2, y2)
      }
    } else {
      noStroke();
      fill(pixData);
      rect(x, y, 5, 30);
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

function brighten(col, amount) {
  return [
    min(col[0] + amount, 255),
    min(col[1] + amount, 255),
    min(col[2] + amount, 255)
  ];
}

function darken(col, amount) {
  return [
    max(col[0] - amount, 0),
    max(col[1] - amount, 0),
    max(col[2] - amount, 0)
  ];
}
