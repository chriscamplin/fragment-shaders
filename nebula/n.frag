// Created by beautypi - beautypi/2012
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Inigo Quilez
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.141592653589793
#define PI2 6.28318530718
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const mat2 m=mat2(.80,.60,-.60,.80);

vec2 rotate2D(vec2 _st,float _angle){
    //_st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    //_st+=.5;
    return _st;
}

float hash(float n)
{
    return fract(sin(n)*43758.5453);
}

float noise(in vec2 x)
{
    vec2 p=floor(x);
    vec2 f=fract(x);
    
    f=f*f*(3.-2.*f);
    
    float n=p.x+p.y*57.;
    
    return mix(mix(hash(n+0.),hash(n+1.),f.x),
    mix(hash(n+57.),hash(n+58.),f.x),f.y);
}
float fbm(vec2 p)
{
    float f=0.;
    
    f+=.50000*noise(p);p=m*p*2.02;
    f+=.25000*noise(p);p=m*p*2.03;
    f+=.12500*noise(p);p=m*p*2.01;
    f+=.06250*noise(p);p=m*p*2.04;
    f+=.03125*noise(p);
    
    return f/.984375;
}

float length2(vec2 p)
{
    vec2 q=p*p*p*p;
    return pow(q.x+q.y,1./4.);
}

void main()
{
    vec2 q=gl_FragCoord.xy/u_resolution.xy;
    vec2 p=-1.+2.*q;
    p.x*=u_resolution.x/u_resolution.y;
    float r=length(p);
    //p*=p.y;
    p*=rotate2D(p,PI2*u_time*.25);
    p*=rotate2D(p,-PI2*u_time*.25);
    float a=atan(p.y,q.x);
    float dd=sin(u_time*.5);
    float ss=1.+clamp(1.,0.,1.);
    r*=ss;
    
    vec3 col=vec3(0.,.3,.6);
    float f=fbm(5.*p);
    //col = mix( col, vec3(0.2,.5,0.4), f );
    
    col=mix(col,vec3(1.,0.,.6157),1.-smoothstep(.2,2.9-dd,r));
    
    a=(dd*.1)+fbm(5.*q);
    
    //noise pattern
    f=smoothstep(.01,1.,fbm(vec2(10.*a,5.*r)));
    f*=smoothstep(.01,1.,fbm(vec2(10.*a,2.*r)));
    col=mix(col,vec3(.0196,.8863,1.),f);
    
    f=smoothstep(.4,.9,fbm(vec2(15.+a+dd,10.*r-dd)));
    
    //fbm rings
    //col *= 1.0-.5*f;
    
    col*=1.-.25*smoothstep(.6,.8,r);
    // shadow
    f=1.-smoothstep(0.,.6,length2(mat2(.6,.8,-.8,.6)*(p-vec2(.3,.5))*vec2(1.,2.)));
    
    //col+=vec3(1.,1.-dd,.9)*f;
    //col+=vec3(1.,1.-dd,.9)*f*.5;
    
    //col *= vec3(0.8+.2*cos(r/a));
    
    f=1.-smoothstep(dd-.5,dd,r);
    //col = mix( col, vec3(0.0), f );
    
    f=smoothstep(dd-.5,dd,r*dd);
    //col = mix( col, vec3(0.0, 0.0, 0.0), f);
    
    col*=.5+.5*pow(16.*q.x*q.y*(1.-q.x)*(1.-q.y),.1);
    
    gl_FragColor=vec4(col,1.);
}