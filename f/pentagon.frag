/*

daily: 023
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
uniform float u_fps;

uniform sampler2D u_buffer0;
uniform sampler2D u_buffer1;

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

float sdEquilateralTriangle(in vec2 p)
{
    float k=sqrt(3.);
    
    p.x=abs(p.x)-1.;
    p.y=p.y+1./k;
    if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
    p.x-=clamp(p.x,-2.,0.);
    return-length(p)*sign(p.y);
}

mat2 rotate(float angle)
{
    return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

vec2 center(vec2 st)
{
    float aspect=u_resolution.x/u_resolution.y;
    st.x=st.x*aspect-aspect*.5+.5;
    return st;
}

void main()
{
    // timing, if using cos+sin times are doubled
    float seconds=10.;
    float t=fract(u_time/seconds);
    
    // space
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    // st = center( st );
    
    // vars
    vec3 buffer,color;
    vec3 sdf=vec3(1.);
    vec3 sdf2=vec3(0.5);
    
    #if defined(BUFFER_0)
    st=center(st);
    buffer=texture2D(u_buffer1,st).rgb;
    
    vec2 pos=vec2(.5);
    pos.x+=.3*sin(TWO_PI*t);
    pos.y+=.13*cos(TWO_PI*t);
    
    sdf.x = length(st-pos)-0.05;
    sdf.x = 1.0 - smoothstep(0.0,0.001,sdf.x);
    
    st-=.5;
    st*=rotate(TWO_PI*t*3.);
    st+=.5;
    float base=.0125+.125*sin(TWO_PI*2.*t);
    
    for(int i=0;i<3;i++){
        //     st = abs(st)/abs(dot(st, st))-pos;
        sdf.y=sdPentagon(st-pos,base);
    }
    
    sdf.y=sdEquilateralTriangle((st-pos)/base)*base;
    //sdf.y/=sdPentagon(st-pos*0.89, base);
    sdf.y=abs(sdf.y-.03)-.001;
    sdf.y=1.-smoothstep(0.,.0003,sdf.y);
    sdf2.y=abs(sdf2.y-.03)-.001;
    sdf2.y=1.-smoothstep(0.,.0003,sdf2.y);
    sdf2.y=sdPentagon(st-pos,base*10.);

    color=vec3(sdf);
    color*=vec3(sdf2);
    gl_FragColor=vec4(color,1.);
    
    #elif defined(BUFFER_1)
    vec3 buffer_1=texture2D(u_buffer1,st).rgb;
    buffer=texture2D(u_buffer0,st).rgb;
    // buffer *= 0.999999;
    // color = mix(buffer_1,buffer,buffer*.003);
    float f=mod(u_fps,60.);
    
    color=mix(buffer,buffer_1,
        (1.-buffer)*.9);
        
        // color = vec3((1.0/u_fps));
        // (1.0-buffer)*4000000.9999999);
        // (1.0-buffer)*(1.0-mod(u_time,.075)* (1.0-mod(u_fps,60.0)) ));
        gl_FragColor=vec4(color,1.);
        #else
        // st = center( st );
        buffer=texture2D(u_buffer1,st).rgb;
        
        color=vec3(.07);
        color=mix(color,vec3(1.),buffer.y);
        // color = vec3(length(buffer));
        // color = mix(color,buffer,0.3);
        gl_FragColor=vec4(color,1.);
        #endif
    }