#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846
#define PI2 6.28318530718
#define MAX_STEPS 30
#define MAX_DIST 100.
#define SURF_DIST .01
#define NUM_LAYERS 6.

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex1;// ./hound.png
//uniform sampler3D u_tex2;// ./chongo.jpg
vec2 repeat=vec2(2,2);
float t=u_time*.95;


float Hash21(vec2 p){
    p=fract(p*vec2(123.34,465.21));
    p+=dot(p,p+45.32);
    return fract(p.x*p.y);
}

float Star(vec2 uv,float flare){
    // star
    float d=length(uv);
    float m=.05/d;
    
    float rays=max(0.,1.-abs(uv.x*uv.y*1000.));
    m+=rays*flare;
    //uv*=rot2D(PI*.25);
    rays=max(0.,1.-abs(uv.x*uv.y*1000.));
    m+=rays*.3*flare;
    
    // prevent glow bleeding into neighbouring cells
    m*=smoothstep(.75,.2,d);
    return m;
}

vec3 StarLayer(vec2 uv,float s){
    vec3 col=vec3(0.);
    // fract & floor 2 sides of the same coin
    // for(int i=0;i<1;i++){
    //     uv=abs(uv)/abs(dot(uv,uv))-vec2(.25);
    // }

    vec2 gv=fract(uv)-.5;
    // Tile ID
    vec2 id=floor(uv);
    // grid coord
    vec2 dotGv=fract(uv)-.5;
    // Tile ID
    vec2 dotId=floor(uv);
    // iterate through getting neighbours by offset
    
    for(float y=-1.;y<=1.;y++){
        for(float x=-1.;x<=1.;x+=1.){
            vec2 offset=vec2(x,y);
            float n=Hash21(id+offset);// rand between 0 & 1
            float size=.125;
            vec3 color=sin(vec3(.3,.9,.89)*fract(n*2345.2)*PI2*20.)*.5+.5;
            color*=color*vec3(1.,.5,1.+size);
            float star=Star(gv-offset-vec2(n-.5,fract(n*34.))+.5,smoothstep(.9,1.,size));
            col+=star*size;
        }
    }
    return col;
    
}


vec2 rotate2D(vec2 _st,float _angle){
    //_st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    //_st+=.5;
    return _st;
}

// pos in 3D space as input
float GetDist(vec3 p) {
    float loop = sin(PI2*(u_time-.75)/1.5)/2.+.5;
    // sphere at middle left to right, 1 above the ground plane, radius is 1 (w)
    vec4 s = vec4(0,1.125+1.125,6.,1.5);
    //p.z-=loop;
    // length of position - sphere, - sphere radius
    float sphereDist = length(p-s.xyz)-s.w;
    float planeDist = p.y;
    // total distance is minimum of those two distances
    float d = min(sphereDist, planeDist);
    return d;
}

float rayMarch(vec3 ro, vec3 rd) {
    //distance origin
    float dO = 0.;
    for(int i=0; i<MAX_STEPS;i++) {
        vec3 p = ro + rd * dO;
        float dS = GetDist(p);
        dO+=dS;
        if(dO>MAX_DIST || dS<SURF_DIST) break;
    }
    return dO;
}

vec3 GetNormal(vec3 p) {
    float s=sin(PI2*(u_time-.75)/20.)/2.+.5;

    float d = GetDist(p);
    vec2 e = vec2(.01, 0);

    vec3 n = d - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx)
    );

    // repeat pattern
    vec2 repeater=vec2(mod(p.x+repeat.x,2.),mod(p.y+repeat.y,2.));
    //repeater*=1.05;
    vec3 txt = texture2D(u_tex1, repeater*.5).rgb;

    return normalize(n)*txt;
}

float GetLight(vec3 p) {
    vec3 lightPos = vec3(0,2.5,0);
    lightPos.xz+=vec2(sin(t),cos(t));
    lightPos.yx+=vec2(sin(t),cos(t));
    
    //light
    vec3 l = normalize(lightPos - p);
    
    // normal
    vec3 n = GetNormal(p);

    float dif = clamp(dot(n, l), 0., 1.);
    float d = rayMarch(p+n*SURF_DIST*2., l);

    // sphere shadow
    if(d<length(lightPos-p)) dif *= .341;
    return dif;
}



void main() {
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 UV=gl_FragCoord.xy/u_resolution.xy;
    vec3 col = vec3(0.);

    float s=sin(PI2*(u_time-.75)/4.)/2.+.5;
    //uv=rotate2D(uv,PI2*u_time*.1);
    // Ray origin
    vec3 ro = vec3(0, 2., 0);
    for(int i = 0; i<2;i++) {
       //uv=abs(uv)/dot(uv,uv)-vec2(.25);
        //uv=abs(uv)*dot(uv+1.,uv-1.)-vec2(.1);
    }
    //uv=abs(uv);
    // Ray direction
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));
    float d = rayMarch(ro, rd);
    for(int i=0;i<1;i++){
            //d=abs(d)/dot(d,d)-.5;
    }
    vec3 p=ro+rd*d;
    vec3 p2=ro+rd*d;
    //p2.x += .75;
    repeat.x*=t;

    //p.y+=s;
    float dif = GetLight(p);
    float x=atan(p.x,p.z)+t;// atan returns -pi t pi
    float y=atan(length(p.xzy),p.y);
    float bands=sin(y*300.+x*100.)*cos(x+y);
    float b1=smoothstep(.100002,.100001,bands+.5);
    float b2=smoothstep(.100002,.100001,bands);
    //col=b1;
    vec3 red = vec3(.5,0.,0.25);
    // col = red;
    vec3 norm=GetNormal(p).rgb*.666;
    for(float i=0.;i<1.;i+=1./NUM_LAYERS){
        float depth=fract(i+t);
        float scl=mix(20.,.54,depth);
        float fade=depth*smoothstep(1.,.9,depth);
        col+=StarLayer(uv*scl+i*4.2,s+.125)*fade;
    }

    vec3 difV =vec3(dif+.125);
    //col += mix(red*difV, difV-norm, s);
    col+=difV;
    //col += txt;
    //col *= vec3(abs(s), 0.1, s);
    //col *= vec3(d);
    gl_FragColor = vec4(col, 1.);
}