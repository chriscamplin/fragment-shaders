#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1472
#define PI2 6.24842
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// from https://thebookofshaders.com/edit.php#11/wood.frag
vec2 rotate2D(vec2 _st,float _angle){
  _st-=.5;
  _st=mat2(cos(_angle),-sin(_angle),
  sin(_angle),cos(_angle))*_st;
  _st+=.5;
  return _st;
}
/* dot()

returns the dot product of
two vectors, x and y.
i.e., x[0]⋅y[0]+x[1]⋅y[1]+...

*/
//// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
// create circle using dot(): https://thebookofshaders.com/07/
//dot returns the dot product of two vectors, x and y. i.e.,

float circle (vec2 _px, in float _radius, vec2 pos) {
  vec2 dist = _px - pos;
  return 1.- smoothstep(_radius-(_radius * 0.01),
  _radius+ (_radius * 0.01),
  /* If x and y are the same the square root of
  the dot product is equivalent to the
  length of the vector. */
  dot(dist,dist)*4.);
}

void main(){
  // Normalized pixel coordinates (from 0 to 1)
  vec2 px=gl_FragCoord.xy/u_resolution.xy;
  vec2 ctr=vec2(.25);
  
  // Time varying pixel color
  px.x*=u_resolution.x/u_resolution.y;
  vec3 color=vec3(0.);
  float d=0.;
  d=length(abs(px)-.5);
  float d2=length(min(abs(px)-.25,0.));
  // d = length( max(abs(px)-.5,0.) );
  float animationSeconds=6.;
  float s=abs(sin(PI2*(u_time-d)/animationSeconds)/2.-d);
  px=rotate2D(px,radians(4.*180.*s*d+d2));
  px=px*2.-1.-d;
  color+=fract(s*s);
  s=s*.5;
  color+=vec3(circle(px,.3,vec2(s,.5)));
  color+=vec3(circle(px,.3,vec2(s-.5,-0)));
  color+=vec3(circle(px,.3-px.x*0.,vec2(s)));
  color+=vec3(circle(px,.3-px.y*0.,vec2(s,-.5)));
  color+=vec3(circle(px,.3-px.x*0.,vec2(.5,s)));
  color*=vec3(fract(d*px.x-px.y),0.,fract(px.x+px.y));
  gl_FragColor=vec4(color,1.);
}