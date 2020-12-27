// Seconds for a flame to spread
flameSpreadDuration = 2000 // In ms

// Matrix dimensions
var columns = 10 // x, left = 0, right = `columns - 1`
var rows = 15    // y, top = 0, bottom = `rows - 1`

function eucledianDist(x1, y1, x2, y2) {
  return sqrt(pow((x1 - x2), 2) + pow((y1 - y2), 2))
}

// Length of the matrix diagonal
fullDiag = eucledianDist(0, 0, columns, rows)


// Helper function to create 2d arrays initialized with `value`
function initPixels(value) {
  arr = array(columns)
  for (var column = 0; column < columns; column++) {
    arr[column] = array(rows)
    for (var row = 0; row < rows; row++) arr[column][row] = value
  }
  return arr
}

// Allocate h, s, and v 2D arrays initialize to 0, 1, 0 resp
pixels_h = initPixels(0)
pixels_s = initPixels(1)
pixels_v = initPixels(0)

msElapsed = 0

export function beforeRender(delta) {
  msElapsed += delta

  if (msElapsed >= flameSpreadDuration) {
    // It's time to start a new flame progression
    msElapsed = 0

    // Define a new center for the next flame animation
    xCenter = random(columns)
    yCenter = random(rows)

    // Change the flame spread duration to a random number.
    // Uniform [1000, 3000] in ms
    flameSpreadDuration = 1000 + random(2000)
  }

  // What frame of the animation are we in? Range [0-1]
  animationPct = msElapsed / flameSpreadDuration

  // Let's figure out what each pixel looks like
  for (var c = 0; c < columns; c++) {
    for (var r = 0; r < rows; r++) {
      d = eucledianDist(c, r, xCenter, yCenter)

      // Distance from animation center, normalized to range [0-1]
      d = (fullDiag - d)/fullDiag

      // d range [0-0.625]
      d /= 1.6

      if (d + animationPct > 0.885) {
        // If this pixel is past 0.885, assume the flame burnt out, set the pixel_v to 0.
        pixels_v[c][r] = 0
      } else {
        // pixels_h is ranged
        pixels_h[c][r] = 0.1 * pow(d + animationPct,3)

        pixels_v[c][r] = pow(d + animationPct,9.6)
      }
    }
  }
}

export function render2D(index, x, y) {
  thisColumn = x * columns
  thisRow = y * rows
  h = pixels_h[thisColumn][thisRow]
  s = pixels_s[thisColumn][thisRow]
  v = pixels_v[thisColumn][thisRow]
  hsv(h, s, v)
}