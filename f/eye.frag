// Created by beautypi - beautypi/2012
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Inigo Quilez
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793
#define PI2 6.28318530718
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

vec2 rotate2D(vec2 _st,float _angle){
    //_st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    //_st+=.5;
    return _st;
}

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*57.0;

    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
}
float fbm( vec2 p )
{
    float f = 0.0;

    f += 0.50000*noise( p ); p = m*p*2.02;
    f += 0.25000*noise( p ); p = m*p*2.03;
    f += 0.12500*noise( p ); p = m*p*2.01;
    f += 0.06250*noise( p ); p = m*p*2.04;
    f += 0.03125*noise( p );

    return f/0.984375;
}

float length2( vec2 p )
{
    vec2 q = p*p*p*p;
    return pow( q.x + q.y, 1.0/4.0 );
}

void main(  )
{
    vec2 q = gl_FragCoord.xy/u_resolution.xy;
    vec2 p = -1.0 + 2.0 * q;
    p.x *= u_resolution.x/u_resolution.y;
    float r = length( p );
    //p*=rotate2D(q,PI*u_time*.125);
    //q*=rotate2D(q,PI*u_time*.125);
    float a = atan( p.y, q.x );
    float dd = 0.5*sin(u_time*.5);
    float ss = 1.0 + clamp(1.0,0.0,1.0);
    r *= ss;

    vec3 col = vec3( 0.0, 0.3, 0.4 );
    float f = fbm( 5.0*p );
    col = mix( col, vec3(0.2,.5,0.4), f );

    col = mix( col, vec3(1.0, 0.0, 0.6157), 1.0-smoothstep(0.2,1.92,r) );

    a += (dd*0.001)+fbm( 5.0*q );
    //noise pattern
    f = smoothstep( 0.01, 1.0, fbm( vec2(10.0*a,7.0*r) ) );
    col = mix( col, vec3(0.0196, 0.8863, 1.0), f-dd );

    f = smoothstep( 0.4, 0.9, fbm( vec2(15.0+a+dd,10.0*r-dd) ) );

    //fbm rings
    //col *= 1.0-.5*f;

    col *= 1.0-0.25*smoothstep( 0.6,0.8,r );
    // shadow
    f = 1.0-smoothstep( 0.0, 0.6, length2( mat2(0.6,0.8,-0.8,0.6)*(p-vec2(0.3,0.5) )*vec2(1.0,2.0)) );

    //col += vec3(1.0,dd,0.9)*f*0.985;

    //col *= vec3(0.8+dd*cos(r/a));

    f = 1.0-smoothstep( dd-.5,dd, r );
    //col = mix( col, vec3(0.0), f );

    f = smoothstep( dd-.5, dd, r*dd );
    //col = mix( col, vec3(0.0, 0.0, 0.0), f );

     col *= 0.5 + 0.5*pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.1);
 
	gl_FragColor = vec4( col, 1.0 );
}