var speed = 2

var lastT = 0
var origX = 0.5
var origY = 0.5
var maxD = maxDist(origX, origY)

var hCount = 9
var hMap = array(hCount)
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

var cIdx = 0
var cStart = hMap[0]
var cEnd = hMap[1]

function maxDist(x, y) {
  x1 = x * x
  x2 = (1 - x) * (1 - x)
  y1 = y * y
  y2 = (1 - y) * (1 - y)
  return sqrt(max(x1, x2) + max(y1, y2))
}

export function beforeRender(delta) {
  t1 = time(speed * .02)

  // Check if we went past the reset on the sawtooth.
  if (lastT - t1 > 0.9) {
    origX = random(1)
    origY = random(1)
    maxD = maxDist(origX, origY)

    cStart = hMap[cIdx]
    cIdx += 1
    cIdx %= hCount
    cEnd = hMap[cIdx]
    if (cEnd < cStart) {
      cEnd += 1
    }
  }

  lastT = t1
}

export function render2D(index, x, y) {
  // Change reference coordinates
  x -= origX
  y -= origY


  // Get pixel distance from center
  d = sqrt(x * x + y * y)
  r = d

  // We have a color wave of width 0.2 and sparks of width 0.25
  // To ensure that the last spark is over before we start a new wave, we need
  // to have sqrt(2) * scale + .2 + .25 to fit into one cycle.
  //
  // Project distance by 0.375 to ensure this.
  r *= 0.375

  // Start the wave at t1 = 0
  // Wave v is +ve if triangle > 0.75 so about 1/4 duty cycle
  r -= t1
  r -= (3/8)

  // Spark trails wave by 0.2
  // (overlaps the wave a bit since the wave runs for a quarter cycle)
  // Spark probability is 1/8
  spark = triangle(r + .2) - .75 > random(2)

  if (spark) {
    hsv(cEnd, 0.94, 1)
  } else {
    v = triangle(r) - .75

    v *= 4 // bring the triangle's peak back to 0-1 range
    v = v * v * v // gives more definition to the wave, preserve negatives
    v *= 0.2 // reduce wave brightness to give the sparks a bit more *zing*

    // range hue from start to end of the current palette
    h = cStart + (cEnd - cStart) * (d / maxD)

    hsv(h, 1, v)
  }
}
