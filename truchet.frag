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

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 truchetPattern(in vec2 _st, in float _index){
    _index = fract(((_index-0.5)*2.0));
    if (_index > 1.) {
        _st = vec2(1.0) - _st;
    } else if (_index > 0.5) {
        _st = vec2(1.0-_st.x,_st.y);
    } else if (_index > 0.25) {
        _st = 1.0-vec2(1.0-_st.x,_st.y);
    }
    return _st;
}
vec2 movingTiles(vec2 _st, float _zoom, float _speed){
    _st *= _zoom;
    float time = u_time*_speed;
    if( fract(time)>0.5 ){
        if (fract( _st.y * 0.5) > 0.5){
            _st.x += fract(time)*2.0;
        } else {
            _st.x -= fract(time)*2.0;
        }
    } else {
        if (fract( _st.x * 0.5) > 0.5){
            _st.y += fract(time)*2.0;
        } else {
            _st.y -= fract(time)*2.0;
        }
    }
    return fract(_st);
}
vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle), -sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float sdEquilateralTriangle(in vec2 p)
{
    float k=sqrt(3.);
    
    p.x=abs(p.x)-1.;
    p.y=p.y+1./k;
    if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
    p.x-=clamp(p.x,-2.,0.);
    return-length(p)*sign(p.y);
}


void main() {
    float animationSeconds = 8.0;
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    vec2 ctr = vec2(0.5);
    vec2 tl = vec2(0.25);
    vec2 tr = vec2(0.25, 0.75);
    vec2 bl = vec2(0.25, 0.75);
    vec2 br = vec2(0.5);
    float d = distance(st, ctr);
    float s = sin(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
    float c = cos(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
    st *= 2.0; 
    //st = movingTiles(st, 1.0, 0.1);
    //st = (st-vec2(5.0))*(abs(s *c)*5.);
    //st.x += u_time * 0.5;
    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    vec2 tile = truchetPattern(fpos, random( ipos ));
    for(int i=0;i<2;++i){
        //tile.xy=abs(tile)/abs(dot(tile.xy,tile.xy))-vec2(1.);//.9+cos(time*.2)*.4);
        //p.xy += fract(p.yx*0.5*s);
    }

    tile = rotate2D(tile, -PI2   * u_time*0.125);

    for(int i=0;i<2;++i){
        st.xy=abs(st)/abs(dot(st.xy,st.xy))-vec2(s);//.9+cos(time*.2)*.4);
        tile.xy=abs(tile)/abs(dot(tile.xy,tile.xy))-vec2(s);//.9+cos(time*.2)*.4);
            //p.xy += fract(p.yx*0.5*s);
            //color-=step(tile.x,fract(mod(tile.y+s+.5,10.)));
        
    }
    float tri=sdEquilateralTriangle(tile-s);
    //tile = movingTiles(tile, 1.0, 0.5);
    float color = 0.0;

    // Maze
    color += smoothstep(tile.x-s,tile.x,tile.y)-
             smoothstep(tile.x,tile.x+c,tile.y);  

    // Circles
    color += (step(length(tile + s),0.6) -
             step(length(tile -c),0.4) ) +
            (step(length(tile-vec2(1.)),0.6) -
             step(length(tile-vec2(1.)),0.4) );

    // Truchet (2 triangles)
    // color += step(tile.x , fract(mod(tile.y + s + 0.5, 10.)));
    color += tri;
    //color += step(mod(tile.y + s + 0.5, 10.),mod(tile.x + s + 0.5, 10.));
    float fColor = fract(color);
    gl_FragColor = vec4(vec3(color),1.0);
}
