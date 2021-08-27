#ifdef GL_ES
precision highp float;
#endif

#define PI 3.141592653589793
#define PI2 6.28318530718
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0;// ./chongo.jpg

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

vec2 rotate2D(vec2 _st,float _angle){
    //_st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    //_st+=.5;
    return _st;
}



void main() {
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 UV=(gl_FragCoord.xy/u_resolution.xy);
    float dur = 20.;
    float s=sin(PI2*(u_time-.75)/dur)/2.+.5;
    float t = u_time*0.5;
    //UV=rotate2D(uv, t);
    float r=dot(uv,uv);
    vec4 txt=vec4(texture2D(u_tex0,((uv+.98765)*.5)).rgba);
    
    for(int i = 0; i <1; i++) {
        uv=abs(uv)/abs(dot(uv-1., uv+1.))-vec2(s);
    }

    vec3 color = vec3(0);

    uv*=400.;//*(s+2.);
    vec2 gv =fract(uv)-.5;
    float width = .05;
    float d = abs(abs(gv.x+gv.y)-.5);
    float y = smoothstep(.01, -.01, d-width);
    float a = atan(uv.x, uv.y)-(PI);
    if(r<.5155) {
        color+=y;
        color+= txt.r+cos(uv.x-s+uv.y+s)+txt.b;
    }
    if(r<0.015){
        //color=vec3(0.);
    }

    gl_FragColor = vec4(color, 1.);
}