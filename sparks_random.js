var speed = 3

var lastT = 0
var origX = 0.5
var origY = 0.5

var cIdx = 0

var hMap = array(10)
// The values below were subjectively chosen for perceived equidistant color
hMap[0] = 0.00  // red
hMap[1] = 0.015 // orange
hMap[2] = 0.08  // yellow
hMap[3] = 0.30  // green
hMap[4] = 0.44  // cyan
hMap[5] = 0.65  // blue
hMap[6] = 0.70  // indigo
hMap[7] = 0.77  // purple
hMap[8] = 0.985 // pink
hMap[9] = 1.00  // red again - same as 0

var cStart = hMap[cIdx]
var cEnd = hMap[(cIdx + 1) % 10]

export function beforeRender(delta) {
  t1 = time(speed * .02)

  // Check if we went past the reset on the sawtooth.
  if (lastT - t1 > 0.9) {
    origX = random(1)
    origY = random(1)

    cStart = hMap[cIdx]
    cEnd = hMap[(cIdx + 1) % 10]
  }

  lastT = t1
}

export function render2D(index, x, y) {
  // Change reference coordinates
  x -= origX
  y -= origY


  // Get pixel distance from center
  r = sqrt(x * x + y * y)

  // We have a color wave of width 0.2 and sparks of width 0.25
  // To ensure that the last spark is over before we start a new wave, we need
  // to have sqrt(2) * scale + .2 + .25 to fit into one cycle.
  //
  // Project distance by 0.375 to ensure this.
  r *= 0.375

  // Start the wave at t1 = 0
  // Wave v is +ve if triangle > 0.75 so about 1/4 duty cycle
  r += t1
  r += (3/8)

  // Spark trails wave by 0.2
  // (overlaps the wave a bit since the wave runs for a quarter cycle)
  // Spark probability is 1/8
  spark = triangle(r + .2) - .75 > random(2)

  if (spark) {
    hsv(cEnd, 1, 1)
  } else {
    v = triangle(r) - .75

    v *= 4 // bring the triangle's peak back to 0-1 range
    v = v * v * v // gives more definition to the wave, preserve negatives
    v *= 0.8 // reduce wave brightness to give the sparks a bit more *zing*

    // range hue from start to end of the current palette
    h = cStart + (cEnd - cStart) * t1

    hsv(h, 1, v)
  }
}
