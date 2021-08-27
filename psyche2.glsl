#define PI 3.141592653589793
#define PI2 6.28318530718
precision highp float;
uniform vec2 u_resolution;
uniform vec2 mouse;
uniform float u_time;
uniform sampler2D backbuffer;
vec2 skew(vec2 st){
    vec2 r=vec2(0.);
    r.x=1.1547*st.x;
    r.y=st.y+.5*r.x;
    return r;
}
vec2 rotate2D(vec2 _st,float _angle){
    _st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    _st+=.5;
    return _st;
}

vec3 simplexGrid(vec2 st){
    vec3 xyz=vec3(0.);
    
    vec2 p=fract(skew(st));
    if(p.x>p.y){
        xyz.xy=1.-vec2(p.x,p.y-p.x);
        xyz.z=p.y;
    }else{
        xyz.yz=1.-vec2(p.x-p.y,p.y);
        xyz.x=p.x;
    }
    
    return fract(xyz);
}

vec3 rgb2hsb(in vec3 c){
    vec4 K=vec4(0.,-1./3.,2./3.,-1.);
    vec4 p=mix(vec4(c.bg,K.wz),
    vec4(c.gb,K.xy),
    step(c.b,c.g));
    vec4 q=mix(vec4(p.xyw,c.r),
    vec4(c.r,p.yzx),
    step(p.x,c.r));
    float d=q.x-min(q.w,q.y);
    float e=1.e-10;
    return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),
    d/(q.x+e),
q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 c){
vec3 rgb=clamp(abs(mod(c.x*6.+vec3(0.,4.,2.),
6.)-3.)-1.,
0.,
1.);
rgb=rgb*rgb*(3.-2.*rgb);
return c.z*mix(vec3(1.),rgb,c.y);
}

void main(){
float time=u_time;
vec2 res=u_resolution;
vec2 p=(gl_FragCoord.xy*2.-res)/min(res.x,res.y);
float animationSeconds=10.;
float s=sin(PI2*(time-.75)/animationSeconds)/2.+.5;
float c=cos(PI2*(time-.75)/animationSeconds)/2.+.5;
//p = fract(p);
for(int i=0;i<2;++i){
p.xy=abs(p)/abs(dot(p.xy,p.xy))-vec2(s);//.9+cos(time*.2)*.4);
//p.xy += fract(p.yx*0.5*s);
}
p=rotate2D(p,.125*time*PI);
vec3 color=vec3(p.y*p.x,.05,p.y+s);
color+=abs(color)*abs(cross(color,color))-vec3(s+.75);
vec3 pastelBlue=vec3(.380,.670,1);
vec3 newColor=vec3(0.);///
newColor+=abs(cross(pastelBlue,color));
newColor*=abs(cross(newColor,color));
// Skew the 2D grid
newColor.rb=fract(skew(p.xy));

// Subdivide the grid into to equilateral triangles
newColor+=simplexGrid(p);
newColor=normalize(newColor);
newColor.g=.01;

gl_FragColor=vec4(newColor,1);

}