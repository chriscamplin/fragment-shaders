precision mediump float;
#define NAVY vec3(0.4471, 0.5961, 0.7333)
#define SUNFLOWER vec3(1.0, 1.0, 1.0)
#define WHITE vec3(1.0, 1.0, 1.0)
#define PI 3.14159265359
#define PI2 6.28318530718


uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

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

float triangle(vec2 p, float size) {
    vec2 q = abs(p);
    return max(q.x * 0.866025 + p.y * 0.5, -p.y * 0.5) - size * 0.25;
}

float hexagon(vec2 p, float radius) {
    vec2 q = abs(p);
    return max(abs(q.y), q.x * 0.866025 + q.y * 0.5) - radius;
}

void main() {
  vec2 px = gl_FragCoord.xy / u_resolution.xy;
  vec2 ctr = vec2(0.5);
  float d = distance(ctr, px);
  float animationSeconds = 8.0;
  float s = sin(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
  px *= u_mouse.x  *0.1;
  px = fract(px);
  //px - 2.0;
  vec2 tri = vec2(0.5);
  // get the direction angle  of two vectors
  float angle = asin(dot(normalize(px - tri),normalize(ctr )));
  if(px.x > 0.5) {
    px = rotate2D(px, angle + u_time -d);
  } else {
    px = rotate2D(px, -angle + -u_time -d);
  }
  
  //d = min(d, triangle(px - tri, 0.3333));
  d = min(d, triangle(px - vec2(fract(d-s *PI), d * (PI *s)), d));
  d = min(d, triangle(px - vec2(fract(d+-s *PI2), d + (PI +s)), s+d));
  d = min(d, hexagon(px - vec2(0.05), 0.1));
  d -= fract(d + (s * 0.000000000095 - d));
  vec3 color = vec3(0.0);
  color = mix(NAVY-d, SUNFLOWER, smoothedge(d-s, d *s));
  color = mix(SUNFLOWER-d, NAVY-s, smoothedge(d/s, 1.0/s));
  gl_FragColor = vec4(color, 1);
}