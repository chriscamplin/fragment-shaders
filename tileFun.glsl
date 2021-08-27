  #define PI 3.14159265359

#define PI2 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif
  
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


//varying vec2 vUv;
vec2 movingTiles(vec2 _st, float _zoom, float _speed, float _s){
    _st *= _zoom;
    float time = _s*_speed;
    if( fract(time)>0.5 ){
        if (fract( _st.y * 0.5) > 0.5){
            _st.x += fract(time)*2.0;
        } else {
            _st.x -= fract(time)*2.0;
        }
    } else {
        if (fract( _st.x * 0.5) > 0.5){
            _st.y += fract(time)*2.0;
        } else {
            _st.y -= fract(time)*2.0;
        }
    }
    return fract(_st);
}

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle), -sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float x(float t) {
  return sin(t * PI / 100.); 
}

float y(float t) {
  return cos(t * PI / 10.); 
}

void main()	{
  //uv is pixel coordinates between -1 and +1 in the X and Y axiis with aspect ratio correction
  vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
  vec2 ctr = vec2(0.0);
  float animationSeconds = 8.;
    float s = sin(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
  ctr *= vec2(x(u_time), y(u_time));
  float d = distance(ctr, uv);
  uv *= 0.8;
  uv = fract(uv);
  //uv = rotate2D(uv, radians(s));

  //uv = movingTiles(uv ,2., .05, s);
  //uv = rotate2D(uv, PI2 * s - d);
  float tenS = s * u_mouse.x* 0.01 * 10.;
  vec3 color = vec3(1.0);
  float r = smoothstep(dot(d, d + tenS * 10.) - s -d, uv.y - s, s - dot(uv.x, s));
  float g = smoothstep(dot(uv.x, tenS), uv.y - d, pow(d, s));
  float b = smoothstep(uv.x - s-d, uv.y - s*d, s-d);
  color = vec3((r-d+s)*d, d, b * fract(s) +d-s);
  color += d;
  //  Calculate the unit vector in the same direction as the input vector
  color *= vec3(smoothstep(PI *fract(d) + 0.1, g - d, b));
  color *= dot(PI2, 0.75-d) ;
  color *= normalize(color);
  gl_FragColor = vec4( color, 1.0 );

}
