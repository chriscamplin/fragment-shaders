// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265358979323846
#define PI2 6.28318530718

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
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

vec2 truchetPattern(in vec2 _st, in float _index){
    _index = fract(((_index-0.5)*2.0));
    if (_index > 0.75) {
        _st = vec2(1.0) - _st;
    } else if (_index > 0.5) {
        _st = vec2(1.0-_st.x,_st.y);
    } else if (_index > 0.25) {
        _st = 1.0-vec2(1.0-_st.x,_st.y);
    }
    return _st;
}


float animationSeconds =8.0;  
void main(void){
  
    float exponent = 4.0;
    vec2 px = gl_FragCoord.xy/u_resolution.xy;

    vec3 color = vec3(1.0, 1.0, 1.0);
    vec2 ctr = vec2(0.5);
    float d = length(px-ctr);
    //float s = sin(u_time * 0.75) / animationSeconds/2.0 + 0.25;
    float s = sin(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
    float c = cos(PI2*(u_time-0.75)/animationSeconds)/2.0+0.5; 
    px = rotateTilePattern(px);
    px *= -rotateTilePattern(px * 0.25);
    px += rotateTilePattern(px * 0.25);
    // Divide the space in 4
    // Apply the brick tiling
    px = rotateTilePattern(px  * s);
    vec2 ipos = floor(px);  // integer
    vec2 fpos = fract(px);  // fraction
    //1px = rotateTilePattern(px);

    vec2 tile = truchetPattern(fpos, random( ipos ));
    // Use a matrix to rotate the space 45 degrees
    //px = rotate2D(px,PI2*fract(s));
    //float numSquares = 10.0;
    // Draw a square
    color = vec3(box(ctr, vec2(s+0.75), 0.001)); 
    color += 2.0;
    //px *= rotate2D(px,4.  * s);
    //px = rotateTilePattern(px);
    px = rotateTilePattern(px);
    px += rotateTilePattern(px);
    px = movingTiles(px, s, 0.5);
    //color = normalize(color); 
    float h = box(px, ctr, 1.0-s);
    float sat = smoothstep(pow(tile.x-d * s, exponent), abs(s-d), s) * 0.01;
    float v = smoothstep(d * pow(tile.x, exponent), tile.x - s + d, c) * 0.01;
    sat += fract(box(px - ctr, vec2(d, s), d));
    v -= box(tile * px, vec2(px), tile.x  );
    h -= smoothstep(tile.x, tile.y, s+c);
    float maze = smoothstep(tile.x-0.3,tile.x,tile.y)-
            smoothstep(tile.x,tile.x+0.3,tile.y);

    vec3 hsv = vec3(h, sat, v);
    //hsv *= normalize(hsv);
    px = movingTiles(px - tile - d, 1.0  -c, 0.25);

    color -= mix(hsv, hsv, pow(s, exponent));
    color = rgb2hsv(color);
    color -=maze;
    gl_FragColor = vec4(color,1.0);
}
