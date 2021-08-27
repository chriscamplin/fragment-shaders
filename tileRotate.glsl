// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265358979323846
#define PI2 6.28318530718

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

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

vec2 brickTile(vec2 _st, float _zoom, float _dist){
    _st *= _zoom;

    // Here is where the offset is happening
    //  _st.x += step(1.0, mod(_st.y, 2.0)) * u_time * 0.5;
    _st.y += step(1.0, mod(_st.x, 2.0)) * u_time * 0.5;

    return fract(_st);
}

 
float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x*uv.y;
}

vec2 rotateTilePattern(vec2 _st){

    //  Scale the coordinate system by 2x2
    _st *= 2.0;

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x,2.0));
    index += step(1., mod(_st.y,2.0))*2.0;

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // Rotate each cell according to the index
    if(index == 1.0){
        //  Rotate cell 1 by 90 degrees
        _st = rotate2D(_st,PI*0.5);
    } else if(index == 2.0){
        //  Rotate cell 2 by -90 degrees
        _st = rotate2D(_st,PI*-0.5);
    } else if(index == 3.0){
        //  Rotate cell 3 by 180 degrees
        _st = rotate2D(_st,PI);
    }

    return _st;
}

float animationSeconds =10.0; 
void main(void){
    vec2 px = gl_FragCoord.xy/u_resolution.xy;
    px = rotateTilePattern(px);
    vec3 color = vec3(1.);
    vec2 ctr = vec2(0.5);
    float d = length(px-ctr);
    //float s = sin(u_time * 0.75) / animationSeconds/2.0 + 0.25;
    float s = sin(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
    float c = cos(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
    //st = rotateTilePattern(st);
    // Divide the space in 4
    //st = tile(st, u_mouse.x * 0.01);
    // Apply the brick tiling
    px = rotateTilePattern(px);
    px = movingTiles(px ,1.0 , 0.5);

    // Use a matrix to rotate the space 45 degrees
    //px = rotate2D(px,PI2*fract(s));
    //float numSquares = 10.0;
    // Draw a square
    //color = vec3(box(st,vec2(0.555),0.001)); 
    //px *= rotate2D(px,-PI*u_time + s * d-s);
    //px = rotateTilePattern(px * .5);
    float r = box(px, vec2(d, s),0.01);
    float g = smoothstep(mod(px.x-d, px.y -d), abs(s)-d, s);
    float b = smoothstep(d * pow(d, s), mod(px.x-d, px.y -d), d);
    vec3 rgb = vec3(r, 0, b + d + s);
    color *= mix(rgb, color, d);
    color *= normalize(color); 
    
    gl_FragColor = vec4(color,1.0);
}
