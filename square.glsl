#define PI 3.14159265359

#define PI2 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float animationSeconds = 5.0; // how long do we want the animation to last before looping


mat2 m(float a) {
  float c=cos(a), s=sin(a);
  return mat2(c,-s,-s,c);
}

float plot(vec3 p) {
    p.xz *= m(u_time * 0.4); p.xy *= m(u_time * 0.3);
    vec3 q = p * 2. + u_time;
    return length(p+vec3(sin(u_time*0.7)))*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*5.5 - 1.;
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution;
  vec2 ctr = vec2(0.5, 0.5);
    // sineVal is a floating point value between 0 and 1
  // starts at 0 when time = 0 then increases to 1.0 when time is half of animationSeconds and then back to 0 when time equals animationSeconds
  float sineVal = sin(PI2*(u_time * 0.25)/animationSeconds)/2.0 + 0.25; 
  float cosVal = cos(PI2*(u_time * 0.25)/animationSeconds)/2.0 + 0.25; 

  vec2 mover = vec2(sineVal, -sineVal);
  vec2 mover2 = vec2(cosVal, -cosVal);
  // abs - of a real number x, denoted |x|, is the non-negative value of x without regard to its sign
  // useful to return positive values from sin & cosine
  float r = 0.0;
  float g = 0.4;
  float b = 0.09;
  float d = .9;
  vec3 p = vec3(0,0,5.) + normalize(vec3(st, -1.))*d;

  float pct = plot(p);

 // b *= distance(mover2, mover);
  r += distance(st, mover);
  // g -= distance(st, mover2);
  b += distance(st, mover2);
  //r *= distance(topRight, ctr);
  g *= distance(ctr, mover2);
  g = floor(b);
  r = floor(pct + b);
  //b = floor(abs(-b);
  vec3 color = vec3(r, g, b);
  // color *= pow(color, color);
	gl_FragColor = vec4(color,1.0);
}