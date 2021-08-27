/*

daily: 016
author: Will Stallwood
insta: https://www.instagram.com/willstall/

*/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define HALF_PI 1.57079632675
#define TWO_PI 6.283185307

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 palette(float t,vec3 a,vec3 b,vec3 c,vec3 d)
{
    return a+b*cos(TWO_PI*(c*t+d));
}

vec2 rotate(vec2 _st,float _angle){
    _st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    _st+=.5;
    return _st;
}

vec2 center(vec2 st)
{
    float aspect=u_resolution.x/u_resolution.y;
    st.x=st.x*aspect-aspect*.5+.5;
    return st;
}
float sdEquilateralTriangle(in vec2 p)
{
    float k=sqrt(3.);
    
    p.x=abs(p.x)-1.;
    p.y=p.y+1./k;
    if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
    p.x-=clamp(p.x,-2.,0.);
    return-length(p)*sign(p.y);
}

float sdBox(in vec2 p,in vec2 b)
{
    vec2 d=abs(p)-b;
    return length(max(d,vec2(0)))+min(max(d.x,d.y),0.);
}

void main(){
    float seconds=10.;
    float t=fract(u_time/seconds);
    float t_i=(t-.5)*2.;
    
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    st=center(st);
    // st.x *= u_resolution.x/u_resolution.y;
    // st = center( st );
    st=rotate(st,TWO_PI*-t*1.);
    st=st*2.-1.;
    
    vec2 size=vec2(.35)+.05*sin(TWO_PI*t);
    // float d = length(max(abs(st) - size,0.0));
    float square=sdBox(st,size);
    float triangle=sdEquilateralTriangle(st*2.);
    triangle*=triangle;
    float d=triangle;
    float a=(atan(st.y,st.x)+TWO_PI-d)*.5;// angle as signal
    a-=.6*log(d);
    a+=1.*(.5+.5*sin(TWO_PI*t*1.));
    d=a;
    d=sin(d*2.+-TWO_PI*t*6.);
    
    float smooth_d=smoothstep(0.,.001,d);
    // d = max(.01,a);
    
    vec3 r=vec3(.5,.5,.5);
    vec3 g=vec3(.5,.5,.5);
    vec3 b=vec3(0.,.1,.2);
    
    vec3 color_1=palette(d-3.*t_i,vec3(.50),r,g,b);
    
    vec3 color=vec3(.2);
    // color = vec3(st.x, st.y, abs(sin(TWO_PI*t)));
    //
    color=mix(color,color_1,d);
    // color = mix(color,vec3(.5),1.0-d);
    // color = mix(color,color_1,1.0-d);
    // color= mix(color,vec3(1.),1.-smooth_d);
    
    // color = mix(color,color_1,1.0-smooth_d);
    // // color = mix(color,color_1-0.5,smooth_d);
    // color = clamp(color,0.0,1.0);
    // color = mix(color,color_1 ,1.0-smoothstep(0.0,0.001,square));
    
    // color *= (color_1) * 2.0;
    // color = mix(color,palette(d+t*6.0,vec3(1.25),r,g,b),d);
    // color = mix(color,palette(d+t*6.0,vec3(1.25),r,g,b),d)/3.0 + 1.0;
    
    gl_FragColor=vec4(color,1.);
}