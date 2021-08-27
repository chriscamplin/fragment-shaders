// Author https://www.youtube.com/watch?v=2R7h76GoIJM
// Title: Truchet - 10 print

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846
#define PI2 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0;// ./texture.png
uniform sampler2D u_tex1;// ./texture2.jpeg

float hash21(vec2 p){
    p=fract(p*vec2(234.34,435.345));
    p+=dot(p,p+34.23);
    return fract(p.x*p.y);
}
vec2 rotate2D(vec2 _st,float _angle){
    //_st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    //_st+=.5; 
    return _st;
}
vec2 movingTiles(vec2 _st,float _zoom,float _speed){
    _st*=_zoom;
    float time=u_time*_speed;
    if(fract(time)>.5){
        if(fract(_st.y*.5)>.5){
            _st.x+=fract(time)*2.;
        }else{
            _st.x-=fract(time)*2.;
        }
    }else{
        if(fract(_st.x*.5)>.5){
            _st.y+=fract(time)*2.;
        }else{
            _st.y-=fract(time)*2.;
        }
    }
    return fract(_st);
}

void main(){
    vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 UV = gl_FragCoord.xy/u_resolution.xy;
    vec3 color=vec3(0.);
    float animDuration=8.;
    float s=sin(PI2*(u_time-.75)/animDuration)/2.+.5;

    float d = length(uv);
    uv*=20.;

    vec2 gv=fract(uv)-.5;
    gv+=d;
    vec2 id=floor(uv);
    float n=hash21(id);// random val between 0 & 1;

    // grid uv coord
    if(gv.x>.48 || gv.y>.48) color = vec3(1.,0,0);

    
    gl_FragColor=vec4(color,1.);
}