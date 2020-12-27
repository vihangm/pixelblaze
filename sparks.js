scale = .5
speed = 10

origX = 0.5
origY = 0.5

export var et1 = 0
export var sparks = false

export function beforeRender(delta) {
  t1 = time(speed * .02)
  t2 = time(.1)

  sparks = false
  if (t1 - 0.25 > 0 && t1 - 0.25 < 0.01) {
    origX = random(1)
    origY = random(1)
  }
}

export function render2D(index, x, y) {
  //center coordinates
  x -= origX
  y -= origY
  //get pixel distance from center
  r = sqrt(x*x + y*y) * scale
  //make colors
  h = (x+y)/2 + t2
  //blast wave - a triangle's peak moving based on the center
  //clipped to 75% of the waveform - v goes negative: +0.25 to -0.75
  v = triangle(r - t1) - .75
  //trailing the outward burst are random white sparks
  //between 0-12.5% chance depending on distance to peak
  spark = triangle(r - t1 + .2) - .75 > random(2)
  if (spark) {
    rgb(1,1,1) //sparks are white
    sparks = true
  } else {
    v = v*4 //bring the triangle's peak back to 0-1 range
    v = v*v*v //gives more definition to the wave, preserve negatives
    hsv(h,1,v)
  }
}