#ifdef GL_ES
precision highp float;
#endif

#define PI 3.141592653589793
#define PI2 6.28318530718
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
//varying vec2 vUv;
vec2 movingTiles(vec2 _st,float _zoom,float _speed,float _s){
    _st*=_zoom;
    float time=_s*_speed;
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

vec2 rotate2D(vec2 _st,float _angle){
    _st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    _st+=.5;
    return _st;
}

float random(in vec2 _st){
    return fract(sin(dot(_st.xy,
                vec2(12.9898,78.233)))*
            43758.5453123);
        }
        
        vec2 truchetPattern(in vec2 _st,in float _index){
            _index=fract(((_index-.5)*2.));
            if(_index>.75){
                _st=vec2(1.)-_st;
            }else if(_index>.5){
                _st=vec2(1.-_st.x,_st.y);
            }else if(_index>.25){
                _st=1.-vec2(1.-_st.x,_st.y);
            }
            return _st;
        }
        
        void main(){
            vec2 px=gl_FragCoord.xy/u_resolution.xy;
            float animationSeconds=16.;
            float s=sin(PI2*(u_time-.75)/animationSeconds)/2.+.5;
            float c=cos(PI2*(u_time-.75)/animationSeconds)/2.+.5;
            float t=u_time*.05;
            //px+=u_time;
            //px*=4.;
            //px=fract(px);
            // get a random index
            vec2 ipos=floor(px);// integer
            vec2 fpos=fract(px);// fraction
            if(mod(ipos.y,2.)==0.){
                px=rotate2D(px,t*PI2);
            }
            
            // get  vector in the center;
            vec2 ctr=vec2(.5)-px;
            for(float i=0.;i<1.;i+=.5){
                px.xy=abs(px)/abs(dot(ctr+s-px.x,px-s+px.y))-vec2(ctr+s);
                ctr.yx=abs(ctr)/abs(dot(ctr+s-px.x,-px-s+px.y))-vec2(0.);
                ctr.xy*=abs(ctr)/abs(dot(ctr+s-.75,-px-s+.75))-vec2(px+s);
            }
            vec3 color=vec3(px.x*.1,px.y*.1,px.x*px.y);
            vec2 tile=truchetPattern(fpos,random(ipos));
            // get  distance from the center;
            float tileAngle=atan(px.y-s,px.x+c);
            
            float radius=length(ctr);
            float angle=atan(ctr.y,ctr.x-dot(px,px))*2.;
            float f=cos(angle*4.);
            float cs=cos(angle*4.);
            
            //color+=vec3(smoothstep(f,f-f*.02,radius));
            //color+=step(ctr.x,fract(mod(ctr.y,10.)));
            color+=vec3(smoothstep(f,f-s,radius)-.1,smoothstep(f,f-s,radius)*.01-dot(ctr,ctr),smoothstep(f,f-s,radius)-s+.2*dot(ctr,ctr));
            //color.xyz += abs(color)/abs(dot(color, color))-vec3(0.5);
            // color*=smoothstep(cs,cs+.02,radius);
            //color-=smoothstep(c,c+.02,radius);
            color=normalize(color);
            gl_FragColor=vec4(color,1.);
        }