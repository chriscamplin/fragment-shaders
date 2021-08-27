#define PI 3.141592653589793
#define PI2 6.28318530718
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform sampler2D backbuffer;
void main(){
    float time=u_time;
    vec2 res=u_resolution;
    vec2 p=(gl_FragCoord.xy*2.-res)/min(res.x,res.y);
    float animationSeconds=8.;
    float s=sin(PI2*(u_time-.75)/animationSeconds)/2.+.5;
    float c=cos(PI2*(u_time-.75)/animationSeconds)/2.+.5;
    //p = fract(p);
    for(int i=0;i<4;++i){
        p.xy=abs(p)/abs(dot(p,p))-vec2(s);//.9+cos(time*.2)*.4);
        p.xy+=fract(p);
    }
    vec3 color=vec3(p.y*p.x,.05,p.y+s);
    color*=abs(color)*abs(cross(color,color))-vec3(s+.25);
    vec3 pastelBlue=vec3(.380,.670,1);
    vec3 newColor=abs(cross(pastelBlue,color));
    // newColor+=abs(cross(pastelBlue * s,color-s));
    gl_FragColor=vec4(newColor,1);
    
}