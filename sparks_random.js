// Written by vihangm for a 12x14 matrix coat by ZacharyRD.
// Starting ideas taken from “firework nova” and “Utility: Perceptual hue”.

var speed = 2

var lastT = 0
var origX = 0.5
var origY = 0.5
var dMax = maxDistToCorners(origX, origY)

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

function maxDistToCorners(x, y) {
  x1 = x * x
  x2 = (1 - x) * (1 - x)
  y1 = y * y
  y2 = (1 - y) * (1 - y)
  return sqrt(max(x1, x2) + max(y1, y2))
}

export function sliderSpeed(v) {
  speed = floor(10 * (1 - v)) + 1
}

export function beforeRender(delta) {
  t1 = time(speed * .02)

  // Check if we went past the reset on the sawtooth time wave,
  // if so pick a new blast center and incrememnt the color palette section.
  if (lastT - t1 > 0.9) {
    origX = random(1)
    origY = random(1)
    dMax = maxDistToCorners(origX, origY)

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
  // Mainain original value since we color the pixel based on distance from
  // the centerpoint with the furthest corner beingn
  d = sqrt(x * x + y * y)

  // r will determine blast wave based on distance from center
  r = d

  // We have a color wave of width 0.25 and sparks of width 0.25 and a distance
  // of 0.1 between them.
  // To ensure that the last spark is over before we start a new wave, we need
  // to have sqrt(2) * scale + .25 + .25 + .10 to fit into one cycle.
  //
  // Project distance by 0.3 to ensure this.
  r *= 0.3

  // Start the wave at t1 = 0
  // Wave value(v) is +ve if triangle > 0.75 so about 1/4 duty cycle
  r -= t1
  r -= (3/8)

  // Spark wave peak trails blast wave peak by 0.35
  // (double the delta to the triangle input)
  // Since each wave is width 0.25, there's no overlap
  //
  // Spark probability is between [0-0.125] depending on random(2)
  // (random(2) needs to be < .25, and triangle needs to be > random(2) + .75)
  spark = triangle(r + .175) - .75 > random(2)

  if (spark) {
    // Spark color is end of our current palette section, with saturation
    // dropped a little bit to make them stand out a bit more.
    hsv(cEnd, 0.97, 1)
  } else {
    v = triangle(r) - .75

    v *= 4 // bring the triangle's peak back to 0-1 range
    v = v * v * v // gives more definition to the wave, preserve negatives
    v *= 0.4 // reduce wave brightness to give the sparks a bit more *zing*

    // Hue is dependent on distance from blast center
    // linearly spaced between start to end of the current palette section.
    h = cStart + (cEnd - cStart) * (d / dMax)

    hsv(h, 1, v)
  }
}
