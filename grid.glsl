#define PI 3.14159265359

#define PI2 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif

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
    return a+b*cos(PI2*(c*t+d));
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

float HexDist(vec2 p){
    p=abs(p);
    
    float c=dot(p,normalize(vec2(1,1.73)));
    c=max(c,p.x);
    
    return c;
}

vec4 HexCoords(vec2 uv){
    vec2 r=vec2(1,1.73);
    vec2 h=r*.5;
    
    vec2 a=mod(uv,r)-h;
    vec2 b=mod(uv-h,r)-h;
    
    vec2 gv=dot(a,a)<dot(b,b)?a:b;
    
    float x=atan(gv.x,gv.y);
    float y=.5-HexDist(gv);
    vec2 id=uv-gv;
    return vec4(x,y,id.x,id.y);
}
vec2 rotate2D(vec2 _st,float _angle){
    _st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    _st+=.5;
    return _st;
}

void main(){
    vec2 px=(gl_FragCoord.xy-5.*u_resolution.xy)/u_resolution.y;
    float animationSeconds=10.;
    float s=sin(PI2*(u_time-.75)/animationSeconds)/2.+.5;
    float c=cos(PI2*(u_time-.75)/animationSeconds)/2.+.5;
    
    vec3 color=vec3(0.);
    for(int i=0;i<1;i++){
        // px.yx=abs(px.yx)/abs(dot(px.xy-s+.75,px.xy+s-.75)-vec2(.5));
    }
    
    float tri=sdEquilateralTriangle(px);
    float pent=sdPentagon(px,s);
    px*=8.;
    px.x+=1.65;
    px.y-=1.65;
    //px+=fract(px);
    vec4 hc=HexCoords(px);
    hc.xy=rotate2D(hc.xy,u_time*.25);
    
    hc.x+=sin(px.x*s*.1);
    hc.y+=cos(px.x*s*.1);
    float r=smoothstep(.5,tri+s,hc.x+s);
    float g=smoothstep(0.,pent,hc.x+s);
    float b=smoothstep(pent,tri-c,hc.x+c);
    color.r=r+tri;
    color.g=g*.1;
    color.b=b+tri;
    
    color.r+=r+pent;
    color.b+=b+pent;
    color*=r*b*g;
    color=normalize(color);
    gl_FragColor=vec4(color,1.);
}