// Created by beautypi - beautypi/2012
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Inigo Quilez
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.141592653589793
#define PI2 6.28318530718
#define NUM_LAYERS 6.

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 rotate2D(vec2 _st,float _angle){
    //_st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    //_st+=.5;
    return _st;
}

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
    m+=rays*.3;
    
    // prevent glow bleeding into neighbouring cells
    m*=smoothstep(.75,.2,d);
    return m;
}

vec3 StarLayer(vec2 uv){
    vec3 col=vec3(0.);
    // fract & floor 2 sides of the same coin
    vec2 gv=fract(uv)-.5;
    // Tile ID
    vec2 id=floor(uv);
    // grid coord
    for(int i=0;i<1;i++){
        //uv=abs(uv)/abs(dot(uv,uv))-vec2(.25);
    }
    vec2 dotGv=fract(uv)-.5;
    // Tile ID
    vec2 dotId=floor(uv);
    // iterate through getting neighbours by offset
    
    for(float y=-1.;y<=1.;y++){
        for(float x=-1.;x<=1.;x+=1.){
            vec2 offset=vec2(x,y);
            float n=Hash21(id+offset);// rand between 0 & 1
            float size=.25;
            vec3 color=vec3(.1);
            //color*=color*vec3(1.,.5,1.+size);
            float star=Star(gv-offset-vec2(n-.5,fract(n*34.))+.5,0.);
            col+=star*size;
        }
    }
    return col;
    
}




void main() {
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 uv1=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    float dur = 20.;
    float s = abs(sin(PI2*(u_time-.75)/dur)/2.+.5);
    //uv=rotate2D(uv, PI2*u_time)*.125;
    //setup camera at pos 0
    //ray_origin
    vec3 ro=vec3(0., 1.25, -1.);
    vec3 lookat=vec3(0.);
    float zoom = .25;
    float t = u_time;
    // forward
    vec3 f = normalize(lookat - ro),
         r = normalize(cross(vec3(0,1,0), f)),
         u = cross(f, r),
         c = ro + f * zoom,
         i = c +uv.x * r +uv.y * u,
         rd = normalize(i-ro);

    float distSurface, distOrigin;    
    vec3 p;
    float centerRadius = .85;
    for(int i = 0; i< 100; i++) { 
        p = ro + rd * distOrigin;
        distSurface = (length(vec2(length(p.xz)-1.175, p.y))-centerRadius);
        if(distSurface < .001) break;
        distOrigin += distSurface;
    }
    vec3 col = vec3(1.);
    if(distSurface <.001) {
        // sin & cosine phase is 2PI long
        float x=atan(p.x,p.z)-t; // atan returns -pi t pi
        float y=atan(length(p.xzy)-1.,p.y);
        float bands = sin(y*20.+x*2.);
        float b1=smoothstep(-.2,.21,bands);
        float b2=smoothstep(-.2,.21,bands-.5);
        col *= b1;//*(1.-b2);
    }
    // uv*=8.;
    // for(float i=0.;i<1.;i+=1./NUM_LAYERS){
    //     float depth=fract(i+t);
    //     float scl=mix(20.,.54,depth);
    //     float fade=depth*smoothstep(1.,.9,depth);
    //     col+=StarLayer(uv)*fade;
    // }
    gl_FragColor = vec4(col, 1.);
    
}