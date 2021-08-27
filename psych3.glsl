#define PI 3.141592653589793
#define PI2 6.28318530718
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform sampler2D backbuffer;
vec2 rotate(vec2 _st,float _angle){
    _st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    //_st+=.5;
    return _st;
}
float sdSphere(vec3 p,float s)
{
    return length(p)-s;
}

void main(){
    float time=u_time;
    vec2 res=u_resolution;
    vec2 p=(gl_FragCoord.xy*2.75-res)/min(res.x,res.y);
    float animationSeconds=8.;
    float s=sin(PI2*(u_time-.75)/animationSeconds)/2.+.5;
    float c=cos(PI2*(u_time-.75)/animationSeconds)/2.+.5;
    float r=sqrt(dot(p,p));
    vec2 ctr=vec2(0.);
    float a=atan(ctr.x,ctr.y);
    
    p=fract(p);
    p=rotate(p,.125*u_time*PI2);
    for(int i=0;i<1;++i){
        //p.xy=abs(p)/abs(dot(p,p))-vec2(c);//.9+cos(time*.2)*.4);
        //p.xy+=fract(p*.25)*sin(PI*p.x-c)/cos(p.y+s*PI);
        //p.yx+=fract(p)*cos(p.y+s)*cos(p.y+s*PI)*mod(p.x+c, 4.);
    }
    vec3 sdf=vec3(1.);
    sdf.x=abs(dot(p,p));
    sdf.y=abs(dot(p-s,p+s));
    sdf.z=abs(dot(p+10.,p-10.))*sin(p.x);
    
    p-=step(p.x,.3+c);
    //p=rotate(p,.125*u_time*-PI2);
    vec3 color=vec3(c);
    color+=vec3(p.x+c,.05,p.y+s);
    color*=abs(color)*abs(cross(color,color))-vec3(s+.25);
    vec3 pastelBlue=vec3(.3255,.5294,.7686);
    vec3 newColor=pastelBlue;
    newColor+=abs(cross(pastelBlue*s,color-s));
    newColor=vec3(sdSphere(color,.5));
    newColor=normalize(sdf);
    gl_FragColor=vec4(sdf*color*newColor,1);
    //gl_FragColor=vec4(color,1);
    
}