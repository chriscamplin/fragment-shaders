precision mediump float;

#define PI 3.14159265359

#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.- smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}


/*
 * Returns a value between 1 and 0 that indicates if the pixel is inside the square
 */
float square(vec2 pixel, vec2 bottom_left, float side) {
    vec2 top_right = bottom_left + side;

    return smoothstep(-1.0, 1.0, pixel.x - bottom_left.x) * smoothstep(-1.0, 1.0, pixel.y - bottom_left.y)
            * smoothstep(-1.0, 1.0, top_right.x - pixel.x) * smoothstep(-1.0, 1.0, top_right.y - pixel.y);
}

// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

float animationSeconds = 7.5;


void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  float s = sin(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
  float n = noise(st / st);
  float sWave = abs(sin(PI2*(u_time - n)/animationSeconds)/4.0 + n);
  float cWave = abs(cos(PI2*(u_time - n)/animationSeconds)/4.0 + n);
  // vec2 acc = vec2(0.1, 0.0);
  vec2 ctr = vec2( 1.0 - sWave, 1.0 -  cWave);
  vec2 ctr2 = vec2( -sWave, -cWave);
  float d = distance(ctr, st) * 1.;
  float d2= distance(ctr2, st) * .5;
  vec3 color = vec3(1.); 

  //st *= .5 * d;
  //st - ctr;
  st *= 30.0 * d * n + d2;
  st += pow(d2, 2.);
  st = fract(st); 
  //st += acc;
  color = vec3(circle(st, cWave - n * d2), n, n);
  st *= fract(-d);
  color = vec3(circle(st, sWave + 0.01 * d), n * sWave * n, n * cWave);

  gl_FragColor = vec4(color, 1.0);
}