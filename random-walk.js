// Daniel Shiffman
// http://codingtra.in
// https://youtu.be/l__fEY1xanY
// https://thecodingtrain.com/CodingChallenges/052-random-walk.html
// Adapted by RoyEden

const BG = 28;
const BGA = 2 ** 3;
const A = 255;
const SIZE = 400;
const CELLS = 2;
const CELLS_COUNT = CELLS ** 2;
const CELL_SIZE = SIZE / CELLS;
const HALF_CELL_SIZE = CELL_SIZE / 2;
const MAX_CELL_DISTANCE = HALF_CELL_SIZE ** 2 * 2;

const TEXT_SIZE = CELL_SIZE / 4;
const LABEL_TEXT_SIZE = TEXT_SIZE / 3;
const MAX_STEP = 3;
const SEED = 2;
// Math.floor(Math.random() * 10);

// Controls
let stallChance = 10 / 100;
let userInterface = false;
let logging = false;
let averaging = false;

console.log(`SEED: ${SEED}`);

const MIDI_VALUE_MODULO = 128;

function cellQuadrantBound(coordinate) {
  const delta = 0.1;
  return floor(constrain(coordinate / CELL_SIZE, delta, CELL_SIZE - delta));
}

let randomPoints;

function createRandomPoints() {
  const randomPointsColors = [
    color(255, 0, 0),
    color(0, 0, 255),
    color(0, 255, 0),
    // color(0, 255, 255),
    // color(255, 255, 0),
  ];

  class RandomWalkPoint {
    constructor(c) {
      c.setAlpha(A);
      this.color = c;
      this.x = floor(random(width));
      this.y = floor(random(height));
      this.setQuadrant();
    }

    draw() {
      stroke(this.color);
      strokeWeight(2);
      point(this.x, this.y);
    }

    update() {
      const direction = floor(random(4));
      const stepValue = floor((stallChance - 1) * random(0, MAX_STEP));
      let x = this.x;
      let y = this.y;

      switch (direction) {
        case 0:
          x += x + stepValue > width ? -stepValue : stepValue;
          break;
        case 1:
          x -= x - stepValue < 0 ? -stepValue : stepValue;
          break;
        case 2:
          y += y + stepValue > height ? -stepValue : stepValue;
          break;
        case 3:
          y -= y - stepValue < 0 ? -stepValue : stepValue;
          break;
      }

      // this should now be redundant, but redundancy is nice 😁
      this.x = constrain(x, 0, width);
      this.y = constrain(y, 0, height);
      this.setMidiValue();
      this.setQuadrant();
    }

    setMidiValue() {
      const x = abs(HALF_CELL_SIZE - (this.x % CELL_SIZE)); // Normalize x
      const y = abs(HALF_CELL_SIZE - (this.y % CELL_SIZE)); // Normalize y

      this.midiValue = round(
        abs(map(x ** 2 + y ** 2, 0, MAX_CELL_DISTANCE, -127, 127, true))
      );
    }

    setQuadrant() {
      this.quadrant = constrain(
        cellQuadrantBound(this.x) + cellQuadrantBound(this.y) * CELLS,
        0,
        CELLS_COUNT - 1
      );
    }
  }

  randomPoints = randomPointsColors.map((c) => new RandomWalkPoint(c));
}

let cells;

function createCells() {
  class Cell {
    constructor(i) {
      this.index = i;
      this.x = (i % CELLS) * CELL_SIZE;
      this.y = floor(i / CELLS) * CELL_SIZE;
      this.cx = this.x + CELL_SIZE / 2;
      this.cy = this.y + CELL_SIZE / 2;
    }

    draw() {
      // BORDERS
      noFill();
      stroke(255, 1);
      rect(this.x, this.y, CELL_SIZE);

      // INDEX
      if (userInterface) {
        textSize(TEXT_SIZE);
        textAlign(CENTER);
        fill(255);
        stroke(255, 10);
        strokeWeight(1);
        text(this.index, this.cx - TEXT_SIZE / 16, this.cy + TEXT_SIZE / 4);
      }
    }
  }

  cells = Array.from({ length: CELLS_COUNT }, (_, i) => new Cell(i));
}

let channels;

async function setup() {
  await WebMidi.enable();
  createCanvas(400, 400);
  x = width / 2;
  y = height / 2;
  background(BG);
  stroke(255, 100);
  strokeWeight(2);
  randomSeed(SEED);

  createRandomPoints();
  createCells();
  channels = WebMidi.outputs[0].channels.filter(
    (channel) => channel !== undefined
  );
  channels.forEach((channel) => {
    channel.sendControlChange(0, 0);
  });
  console.log(`Device: ${WebMidi.outputs[0].name}`);
  console.log(`Channels: ${channels.length}`);
}

// Reused memory blocks in this order [x, y]
const CELL_OUTPUTS = Array.from({ length: CELLS ** 2 }, () => null);

function draw() {
  CELL_OUTPUTS.fill(null);
  background(BG, BGA);
  if (userInterface) {
    // INFO
    fill(BG);
    noStroke();
    rect(
      2,
      2,
      LABEL_TEXT_SIZE * 7,
      LABEL_TEXT_SIZE * (randomPoints.length + 1)
    );
  }

  // GRID
  cells.forEach((cell) => {
    cell.draw();
  });

  // POINTS
  randomPoints.forEach((randomPoint, i) => {
    randomPoint.update();
    randomPoint.draw();
    fill(255);
    strokeWeight(1);
    textSize(LABEL_TEXT_SIZE);
    textAlign(LEFT);
    fill(255);
    stroke(randomPoint.color);
    if (userInterface) {
      text(randomPoint.quadrant, LABEL_TEXT_SIZE * (i + 1), LABEL_TEXT_SIZE);
      text(randomPoint.midiValue, LABEL_TEXT_SIZE, LABEL_TEXT_SIZE * (i + 2));
    }

    const output = CELL_OUTPUTS[randomPoint.quadrant];
    if (output === null) {
      CELL_OUTPUTS[randomPoint.quadrant] = randomPoint.midiValue;
    } else {
      if (averaging) {
        CELL_OUTPUTS[randomPoint.quadrant] = round(
          (output + randomPoint.midiValue) / 2
        );
      } else {
        CELL_OUTPUTS[randomPoint.quadrant] = max(output, randomPoint.midiValue);
      }
    }
  });

  if (logging) {
    console.log(CELL_OUTPUTS);
  }

  CELL_OUTPUTS.forEach((cell, i) => {
    const channel = floor(i / MIDI_VALUE_MODULO);
    const controlChangeMessage = i % MIDI_VALUE_MODULO;
    channels[channel].sendControlChange(
      controlChangeMessage,
      floor((cell ?? 0) / cells.length)
    );
  });
}

function mouseMoved() {
  const x = abs(HALF_CELL_SIZE - (mouseX % CELL_SIZE)); // Normalize x
  const y = abs(HALF_CELL_SIZE - (mouseY % CELL_SIZE)); // Normalize y

  if (logging) {
    console.log(
      round(abs(map(x ** 2 + y ** 2, 0, MAX_CELL_DISTANCE, -127, 127, true)))
    );
  }
}

function keyTyped() {
  switch (key.toLowerCase()) {
    case "p": {
      isLooping() ? noLoop() : loop();
      break;
    }
    case "a": {
      averaging = !averaging;
      console.log("Average: " + averaging);
      break;
    }
    case "l": {
      logging = !logging;
      break;
    }
    case "u": {
      if (userInterface) {
        background(BG);
      }
      userInterface = !userInterface;
      console.log("UI: " + userInterface);
      break;
    }
    case "-": {
      stallChance += 5 / 100;
      stallChance = constrain(stallChance, 0, 1);
      console.log("Stall chance: " + round(stallChance * 100) + " %");
      break;
    }
    case "+": {
      stallChance -= 5 / 100;
      stallChance = constrain(stallChance, 0, 1);
      console.log("Stall chance: " + round(stallChance * 100) + " %");

      break;
    }
  }
}

let wasPaused = false;

function mousePressed() {
  if (!isLooping()) {
    wasPaused = true;
    loop();
  }
}

function mouseReleased() {
  if (wasPaused) {
    wasPaused = false;
    noLoop();
  }
}
