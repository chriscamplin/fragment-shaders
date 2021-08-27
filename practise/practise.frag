precision mediump float;

#define PI 3.1415
#define PI2 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

mat2 rotate2D(float angle) {
  return mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
}

void main() {
  vec2 px = gl_FragCoord.xy / u_resolution.xy;
  float s = sin(PI2 * u_time * 0.25)/2.0/2.0+ 0.5;
  px -= 0.5;
  px *= rotate2D(0.25 * u_time * PI);
  px += 0.5;
  px *= px *= 4.0;
  px = fract(px / s);

  vec2 ctr = vec2(0.5);
  vec2 d = step(ctr, px);
  gl_FragColor = vec4(d,ctr.x,1.);
}