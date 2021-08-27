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
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 UV=gl_FragCoord.xy/u_resolution.xy;
    vec3 color=vec3(0.);
    float animDuration=32.;
    float s=sin(PI2*(u_time-.75)/animDuration)/2.+.5;
    // grid uv coord
    //uv.y+=2.; 
    uv*=80.*s+9.*UV.y;//*UV.y;
    float r=sqrt(dot(uv,uv));
    for(float i = 0.; i< 20.5;i+=1.5) {
        if(r<float(i)*(s+.25)){
            uv=rotate2D(uv,mod(float(i), 2.)==0.?-PI2*abs(s):PI2*abs(s));
        }

    }
    //uv=movingTiles(uv,uv.y,.25);
    
    vec2 gv=fract(uv)-.5;
    vec2 id=floor(uv);
    float n=hash21(id);// random val between 0 & 1;
    if(r<25.5*(s+.125)){
        //gv=fract(gv)+.25;
        //gv.x*=-1.;
        float width=.05*(s+1.);
        if(n<.5)gv.x*=-1.;
        //if(n>.5)gv.x*=s;
        float line=abs(abs(gv.x+gv.y)-.5);
        vec2 cUv = gv-sign(gv.x+gv.y+0.001)*.5;
        line=length(cUv)-.5;
        float arc = abs(line);
        float a=atan(cUv.x,cUv.y); // -PI to PI

        float mask=smoothstep(.01,-.01,line-width);
        float checker = mod(id.x+id.y, 2.)*2.-1.;
        float flow = sin(u_time+checker+a*1.);

        //float x = fract(checker*a/1.57+u_time*.3);
       // float y = (line - (.5-width))/(2.*width);
        //y = abs(y-.5)*2.;
        vec3 tUv = vec3(mask, 0, mask);
        //mask+=smoothstep(.01,-.01,line-width*2.5);
        //gv=rotate2D(gv,a);
        
        //float line2=abs(abs(gv.x+gv.y)-.5);
        //float mask2=smoothstep(.01,-.01,line-width);
        
        //color+=vec3(mask2);//,.01,mask2);
        //color+=tUv;//,.01,mask);
        color=texture2D(u_tex1,uv*.0125+0.5).rgb*vec3(mask);//,.01,mask);
        //color*=mix(vec3(1.), color, uv.y*0.25);
        //color.rgb+=gv.x;
        
    }
    //if(gv.x>.48 || gv.y>.48) color = vec3(1,0,0);
    gl_FragColor=vec4(color,1.);
}