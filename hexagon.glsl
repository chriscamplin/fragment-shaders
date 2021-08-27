#ifdef GL_ES
precision mediump float;
#endif
#define POWDERBLUE vec3(0.1843, 0.0, 1.0)
#define SUNFLOWER vec3(1.0, 0.7686, 0.0)
#define WHITE vec3(1.0, 1.0, 1.0)
#define PI2 6.28318530718


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}


float smoothedge(float v, float f) {
    return smoothstep(0.0, f / u_resolution.x, v);
}

float circle(vec2 _px, float r) {
  return length(_px) - r;
}


float hexagon(vec2 p, float radius) {
    vec2 q = abs(p);
    return max(abs(q.y), q.x * 0.866025 + q.y * 0.5) - radius;
}

float animationSeconds = 8.0;
void main() {
  vec2 px = gl_FragCoord.xy / u_resolution.xy;
  float s = sin(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 

  vec2 ctr = vec2(0.5);
  float dst = length(px - ctr);
  px *= 20.0;    
  px = fract(px);
  px = rotate2D(px, radians(u_time * 50.));
  //px -= fract(2.2);
  float d = hexagon(px - vec2(0.5), 0.8 - s + dst + 0.1);
  float d2 = hexagon(px - vec2(0.5), 0.2 - s + pow(dst, 2.) + 0.1);
  vec3 color = mix(POWDERBLUE, SUNFLOWER, smoothedge(d2, 1.0));
  color * s;
  color *= mix(SUNFLOWER, POWDERBLUE, smoothedge(d, 1.0));
  gl_FragColor = vec4(color, 1.0);
  
}
