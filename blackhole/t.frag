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

vec2 rotate2D(vec2 _st,float _angle){
    //_st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    //_st+=.5;
    return _st;
}

void main() {
    vec2 uv = (gl_FragCoord.xy-.5 *u_resolution.xy)/u_resolution.y;
    float dur = 20.;
    float s = abs(sin(PI2*(u_time-.75)/dur)/2.+.5);
    //uv=rotate2D(uv, PI2*u_time)*.125;
    //setup camera at pos 0
    //ray_origin
    vec3 ro=vec3(0., 1.275, -1.);
    vec3 lookat=vec3(0.);
    float zoom = .285;
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
    float centerRadius = .985;
    for(int i = 0; i< 100; i++) { 
        p = ro + rd * distOrigin;
        distSurface = (length(vec2(length(p.xz)-1.175, p.y))-centerRadius);
        if(distSurface < .001) break;
        distOrigin += distSurface;
    }
    vec3 col = vec3(0.);
   // col = rd;
    if(distSurface <.001) {
        // sin & cosine phase is 2PI long
        float x=atan(p.x,p.z)+t; // atan returns -pi t pi
        float y=atan(length(p.xzy)-1.,p.y);
        float bands = sin(y*30.+x*2.);
        float b1=smoothstep(.2,.21,bands);
        float b2=smoothstep(.2,.21,bands-.5);
        col += b1;//*(1.-b2);
    }

    
    gl_FragColor = vec4(col, 1.);
    
}