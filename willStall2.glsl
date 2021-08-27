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
float sdCircle(vec2 p,float r)
{
    return length(p)-r;
}

float sdPentagon(in vec2 p,in float r)
{
    const vec3 k=vec3(.809016994,.587785252,.726542528);
    p.x=abs(p.x);
    p-=2.*min(dot(vec2(-k.x,k.y),p),0.)*vec2(-k.x,k.y);
    p-=2.*min(dot(vec2(k.x,k.y),p),0.)*vec2(k.x,k.y);
    p-=vec2(clamp(p.x,-r*k.z,r*k.z),r);
    return length(p)*sign(p.y);
}

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
    for(int i=0;i<1;i++){
        //st=abs(st)/abs(dot(st,st))-vec2(.5);
        size=abs(size)/abs(dot(size,size))-vec2(.5);
        
    }
    float pent=sdPentagon(st,.2);
    float square=sdBox(st,size);
    float triangle=sdEquilateralTriangle(st);
    float triangle2=sdEquilateralTriangle(st*2.);
    float circle=sdCircle(st,.2);
    //triangle*=pent/2.0;
    float d=circle*triangle*triangle2;
    
    float a=(atan(st.y,st.x)+TWO_PI-d)*.5;// angle as signal
    a-=.6*log(d);
    a+=1.*(.5+.5*sin(TWO_PI*t*1.));
    d=a;
    d=sin(d*2.+-TWO_PI*t*3.);
    
    float smooth_d=smoothstep(0.,.001,d);
    // d = max(.01,a);
    
    vec3 r=vec3(.9216,0.,0.);
    vec3 g=vec3(.0824,1.,.9216);
    vec3 b=vec3(.4471,.0235,1.);
    
    vec3 color_1=palette(d-3.*t_i,vec3(1.,.0824,.8471),r,g,b);
    
    vec3 color=vec3(.2);
    // color = vec3(st.x, st.y, abs(sin(TWO_PI*t)));
    //
    color=mix(color,color_1,d);
    color=mix(color,vec3(.5),1.-d);
    color=mix(color,color_1,1.-d);
    color=mix(color,vec3(1.),1.-smooth_d);
    
    // color = mix(color,color_1,1.0-smooth_d);
    // // color = mix(color,color_1-0.5,smooth_d);
    // color = clamp(color,0.0,1.0);
    // color = mix(color,color_1 ,1.0-smoothstep(0.0,0.001,square));
    
    // color *= (color_1) * 2.0;
    color=mix(color,palette(d+t*6.,vec3(1.25),r,g,b),d);
    // color = mix(color,palette(d+t*6.0,vec3(1.25),r,g,b),d)/3.0 + 1.0;
    
    gl_FragColor=vec4(color,1.);
}