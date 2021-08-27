#define PI 3.14159265359

#define PI2 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// from https://thebookofshaders.com/edit.php#11/wood.frag
mat2 rotate2d(float angle){
    return mat2(-cos(angle),-sin(angle),
                -sin(angle),-cos(angle));
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
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


vec2 ctr = vec2(0.5);
float animationSeconds = 2.;

float sWave = abs(sin(PI2*(u_time * 0.25)/animationSeconds)/2.0 + 0.5);

vec2 plot(vec2 st) {
  return log(st + sWave  );
}
float scale = sWave * 10.;

float lines(in vec2 pos, float b){
  pos *= scale;
  return smoothstep(0.0, .25 + b * .25, abs((sin(pos.x * (PI * 0.5)))) * .5);
}



void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.y *= u_resolution.y / u_resolution.x;
  //vec2 newSt = plot(st);
  vec2 pos = st.xy * vec2(scale, st.yx);
    // Add noise
  pos = noise(st - ctr) * pos;
  pos = rotate2d( noise(pos *  ctr) ) * pos;
  float pattern = pos.y - pos.x;
  pattern += floor(pos.x);

    // Draw lines
  pattern = lines(pos, 0.09);
  gl_FragColor = vec4(vec3(pattern), 1.0);
}