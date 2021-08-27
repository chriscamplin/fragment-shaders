// Author @patriciogv - 2015
// Title: Zigzag
#define PI 3.14159265359


#define PI2 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


vec2 mirrorTile(vec2 _st, float _zoom){
    _st *= _zoom;
    if (fract(_st.y * 0.5) > 0.5){
        _st.x = _st.x+0.5 * u_time;
        _st.y = 0.5-_st.y;
    }
    return fract(_st);
}

float fillY(vec2 _st, float _pct, float _antia){
  return smoothstep( _pct - _antia, _pct, _st.y);
}

void main(){
  vec2 st = gl_FragCoord.xy / u_resolution.xy * 0.5;
  //vec3 color = vec3(0.0);

  st = mirrorTile(st*vec2(.5,1.),u_mouse.x);
  float x = st.x * 0.5;
  float y = st.y * 5.;

  // floor - Find the nearest integer less than or equal to the parameter
  float a = floor(1. + cos(x * PI));
  float b = floor(1. + sin((y + PI) * PI));

  // Compute the fractional part of the argument
  float f = fract(y);
  float angle = 0.2; // your angle
  st *= mat2(cos(angle), -sin(angle), cos(angle), -sin(angle));
  float pct = 0.0;
  pct = distance(st, vec2(0.5));
      // pct = sqrt(tC.x*tC.x+tC.y*tC.y);

  vec3 color = vec3(0., 0.5, 0.1);
  color = vec3(st.x, st.y, abs(sin(u_time * 0.5)));
  color = vec3(pct, st.y, pct);
  gl_FragColor = vec4(color, 1.0);

}
