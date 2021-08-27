precision mediump float;

#define PI 3.1472
#define PI2 6.24842

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

//// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
// create circle using dot(): https://thebookofshaders.com/07/
//dot returns the dot product of two vectors, x and y. i.e., 


// from https://thebookofshaders.com/edit.php#11/wood.frag
vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}
/* dot()

returns the dot product of 
two vectors, x and y. 
i.e., x[0]⋅y[0]+x[1]⋅y[1]+...

*/
float circle (in vec2 _px, in float _radius, in vec2 pos) {
  vec2 dist = _px - pos;
  return 1.- smoothstep(_radius-(_radius * 0.01),
                        _radius+ (_radius * 0.01),
                        /* If x and y are the same the square root of 
                        the dot product is equivalent to the 
                        length of the vector. */
                        dot(dist, dist) * 4.);
}
vec2 ctr = vec2(0.25);
  float animationSeconds = 6.0;

void main() {
  vec2 px = gl_FragCoord.xy / u_resolution.xy;
  px.x *= u_resolution.x/u_resolution.y;
  px.y *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;
  d = length(abs(px) - .5);
  float s = sin(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
  float y = step(0.1, px.x);

  float d2 = length( min(abs(px)-d,s) );
  // d = length( max(abs(px)-.5,0.) );
  px = rotate2D(px - ctr, radians(u_mouse.x* -720. * s * d * d2));
  px = rotate2D(-px, radians(-u_mouse.y * 720. * -s * -d * -d2));
  px = px * 2.0 - 1. - d * d2;
  color += fract(s * s);
  s = s * 0.5;
  color += vec3(circle(px, 0.3, vec2(s, 0.5)));
  color += vec3(circle(ctr * px, 0.3, vec2(fract(pow(s, s)) - 0.5, -0)));
  color += vec3(circle(ctr / px, 0.3 - px.x * 0., vec2(s)));
  //px = rotate2D(px - ctr, radians(720. * s * d + d2));

  color += vec3(circle(ctr, u_mouse.x - px.y * 0., vec2(s, -0.5)));
  color += vec3(circle(ctr, 0.3 - px.x * 0., vec2(0.5, s)));
  color *= vec3(fract(d * px.x - s), 0, fract(d * s * px.x + px.y));
  
  gl_FragColor = vec4(color, 1.0);
}
