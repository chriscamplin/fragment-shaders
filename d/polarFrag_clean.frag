    #ifdef GL_ES
    precision mediump float;
    #endif

    #define PI 3.141592653589793
    #define PI2 6.28318530718
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;


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
                vec2 px=gl_FragCoord.xy*2./u_resolution.xy*2.0-vec2(1.5);
                float animationSeconds=16.;
                float s=sin(PI2*(u_time-.75)/animationSeconds)/2.+.5;
                float c=cos(PI2*(u_time-.75)/animationSeconds)/2.+.5;

                // get a random index
                vec2 ipos=floor(px);// integer
                vec2 fpos=fract(px);// fraction
                //if(mod(ipos.y,2.)==0.){
                    px=rotate2D(px,u_time*.0675*PI2);
                //}
                
                // get  vector in the center;
                vec2 ctr=vec2(.5)-px;
                for(int i=0;i<1;i++){
                    //px.xy=abs(px)/abs(dot(px,px))-vec2(.5*s);
                    ctr.xy=abs(ctr)/abs(dot(ctr.yx,ctr.xy))-vec2(s);
                    //ctr.xy=abs(ctr)/abs(dot(ctr+s-.5,ctr-s+.5))-vec2(s-.25);
                }
                vec3 color=vec3(.1);
                vec2 tile=truchetPattern(fpos,random(ipos));
                // get  distance from the center;
                float tileAngle=atan(tile.y,tile.x);
                
                float radius=length(ctr)*2.*s;
                float angle=atan(ctr.y,ctr.x)*4.;
                float f=cos(angle*4.);
                float cs=cos(angle*4.);
                

                color+=vec3(smoothstep(f,.9-cs,radius-s));
                color*=vec3(smoothstep(cs,.9-f,radius+s));

                gl_FragColor=vec4(color,1.);
            }