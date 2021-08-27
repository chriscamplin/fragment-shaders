// Author @patriciogv - 2015
// Title: Truchet - 10 print

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846
#define PI2 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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
        vec2 rotate2D(vec2 _st,float _angle){
            _st-=.5;
            _st=mat2(cos(_angle),-sin(_angle),
            sin(_angle),cos(_angle))*_st;
            _st+=.5;
            return _st;
        }
        
        void main(){
            float animationSeconds=8.;
            vec2 st=gl_FragCoord.xy/u_resolution.xy;
            vec2 ctr=vec2(.5);
            vec2 tl=vec2(.25);
            vec2 tr=vec2(.25,.75);
            vec2 bl=vec2(.25,.75);
            vec2 br=vec2(.5);
            float d=distance(st,ctr);
            float s=sin(PI2*(u_time-.75)/animationSeconds)/2.+.5;
            float c=cos(PI2*(u_time-.75)/animationSeconds)/2.+.5;
            st*=4.;
            //st = movingTiles(st, 1.0, 0.1);
            //st = (st-vec2(5.0))*(abs(s *c)*5.);
            //st.x+=u_time*.5;
            vec2 ipos=floor(st);// integer
            vec2 fpos=fract(st);// fraction
            
            vec2 tile=truchetPattern(fpos,random(ipos));
            //tile = rotate2D(tile, -PI   * d);
            //tile = movingTiles(tile, 1.0, 0.5);
            float color=0.;
            
            // Maze
            // color = smoothstep(tile.x-s,tile.x,tile.y)-
            //         smoothstep(tile.x,tile.x+c,tile.y);
            
            // Circles
            // color = (step(length(tile + s),0.6) -
            //          step(length(tile -c),0.4) ) +
            //         (step(length(tile-vec2(1.)),0.6) -
            //          step(length(tile-vec2(1.)),0.4) );
            
            // Truchet (2 triangles)
            color+=step(tile.x,tile.y);
            
            //color += step(mod(tile.y + s + 0.5, 10.),mod(tile.x + s + 0.5, 10.));
            float fColor=fract(color);
            gl_FragColor=vec4(vec3(color),1.);
        }
        