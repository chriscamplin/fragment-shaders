#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846
#define PI2 6.28318530718
#define NAVY vec3(0.,.1,.2)
#define SUNFLOWER vec3(1.,1.,.6)
// #include "space/ratio.glsl"
// #include "math/decimation.glsl"
// #include "draw/circle.glsl"
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 rotate2D(vec2 _st,float _angle){
  _st-=.5;
  _st=mat2(cos(_angle),-sin(_angle),
  sin(_angle),cos(_angle))*_st;
  _st+=.5;
  return _st;
}

float smoothedge(float v,float f){
  return smoothstep(0.,f/u_resolution.x,v);
}

void circle(vec2 cirleCenter,float r){
  step(cirleCenter.x,r);
}
float hexagon(vec2 p,float radius){
  vec2 q=abs(p);
  return max(abs(q.y+dot(p,p)),q.x*.866025+q.y*.5-dot(p,p))-radius;
}

void main(){
  float animationSeconds=8.;
  
  vec2 px=gl_FragCoord.xy/u_resolution.xy;
  float s=sin((PI2*u_time-.75)/animationSeconds)/2.+.5;
  vec2 center=vec2(.5);
  px=rotate2D(px,u_time);
  //px*=2.5;
  float d=hexagon(px-vec2(.5,.5),abs(s));
  float e=hexagon(px-vec2(.5,.5),s+.24);
  //px-=abs(dot(px,px * fract(s)));
  px=rotate2D(px,u_time);
  float f=hexagon(px-vec2(.5,.5),s+.4);
  float g=hexagon(px-vec2(.5,.5),s*.24);
  //circle(center, 0.1);
  vec3 color=mix(NAVY,SUNFLOWER,smoothedge(d,.5));
  color+=mix(SUNFLOWER,NAVY,smoothedge(e,.5));
  for(int i=0;i<10;i++){
    //color+=mix(NAVY,SUNFLOWER,smoothedge(hexagon(px-vec2(.5,.5),s+float(i)*.5+.25),.5));
  }
  color-=mix(NAVY,SUNFLOWER,smoothedge(g*s,.5));
  
  //color -= dot(px, px) - fract(s);
  gl_FragColor=vec4(color,1.);
}