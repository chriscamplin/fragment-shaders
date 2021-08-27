// Author https://www.youtube.com/watch?v=2R7h76GoIJM
// Title: Truchet - 10 print

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846
#define PI2 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p,p +34.23);
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
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 UV=gl_FragCoord.xy /u_resolution.xy;
    vec3 color = vec3(0.);
    float animDuration = 10.;
    float s = sin(PI2 * (u_time-0.75)/animDuration)/2.+0.5;
    // grid uv coord    
    //uv.y+=2.;
    uv*=20.*s+6.;//*UV.y;
    float r=sqrt(dot(uv,uv));
    if(r<6.*(s+.25)){
        uv=rotate2D(uv,u_time*PI2*.25);
    } else {
        uv=rotate2D(uv,-u_time*PI2*.125);
    }
    //uv.y+=2.;
    //uv+=movingTiles(uv,1.,.25);

    vec2 gv = fract(uv) - .5;
    vec2 id = floor(uv);
    float n = hash21(id); // random val between 0 & 1;
    if(r<10.*(s+.25)) {
        //gv=fract(gv)+.25;
        gv.x*=-1.;
        float width=.1*(s+1.0);
        if(n<.5)gv.x*=-1.;
        //if(n>.5)gv.x*=s;
        float a=atan(gv.x,gv.y);
        float line=abs(abs(gv.x+gv.y)-.5);
        float mask=smoothstep(.01,-.01,line-width);
        //mask+=smoothstep(.01,-.01,line-width*2.5);
        //gv=rotate2D(gv,a);

        //float line2=abs(abs(gv.x+gv.y)-.5);
        //float mask2=smoothstep(.01,-.01,line-width);
    
        //color+=vec3(mask2);//,.01,mask2);
        color+=vec3(mask);//,.01,mask);

        //color.rgb+=gv.x;

    }
    //if(gv.x>.48 || gv.y>.48) color = vec3(1,0,0);
    gl_FragColor = vec4(color, 1.);
}