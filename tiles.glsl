precision mediump float;

#define PI 3.14159265359
#define PI2 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_frame;

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}


vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x + uv.y;
}


void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float animationSecs = 10.0;
  float sWave = abs(sin(PI2*(u_time-0.75)/animationSecs)/2.0) - 0.025;
  vec2 topRight = vec2(0.5);
  vec2 bottomLeft = vec2(0.5);
  float d = distance(st, topRight);
  float d2 = distance(st, bottomLeft);
    // divide the space into 4
  st = tile(st, 2. / u_mouse.x * u_mouse.y);
  st = rotate2D(st, radians(u_time * 15. - d2));
  vec3 color = vec3(1.0);
  //color = fract(color);
  //color *= 30.;
  color = vec3(box(st, vec2(sWave - d+ 0.25), d - d2 + 0.1));
  color *= vec3(d - d2, 0.75, 0.8- sWave);
  //color *= vec3(d * 0.5, d * 0.3, d);
  // st = rotate2D(st, radians(-u_time * d2 - d2));
  //color = vec3(box(st,vec2(d2),0.01));
    // Draw a square

  gl_FragColor = vec4(color, 1.0);
}