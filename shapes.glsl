#define PI 3.14159265359

#define PI2 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif
// Common uniforms
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_frame;

float animationSeconds = 4.0; // how long do we want the animation to last before looping

void main(void)
{
    //uv is pixel coordinates between -1 and +1 in the X and Y axiis with aspect ratio correction
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
    // sineVal is a floating point value between 0 and 1
    // starts at 0 when time = 0 then increases to 1.0 when time is half of animationSeconds and then back to 0 when time equals animationSeconds
    float sineVal = sin(PI2 * (u_time - 0.75) / animationSeconds) / 2.0 + 0.5;
    float cosVal = cos(PI2 * u_mouse.x * 0.25 * (u_time - 0.75) / animationSeconds) / 2.0 + 0.5;

    float circle1Radius = 0.2+(1.0-sineVal)*0.2; //radius of circle
    vec2 circle1Center = mix(vec2(-0.8,0.0),vec2(0.8,0.0),sineVal);
    
    float circle2Radius = 0.2+(sineVal)*0.2; //radius of circle
    vec2 circle2Center = mix(vec2(0.0,-0.8),vec2(0.0,0.8),cosVal);
    
    float circle3Radius = 0.2+(1.0-sineVal)*0.2; //radius of circle
    vec2 circle3Center = mix(vec2(-0.8,-0.55),vec2(0.8,0.8),sineVal);
    
    vec4 color = vec4(0.0); //init color variable to black

    //default pixel color is black
    color = vec4(0.0,0.0,0.0,1.0);

    //test if pixel is within the circle
    if (length(uv-circle1Center)<circle1Radius)
    {
        color += vec4(1.0,0.0,0.0,1.0);
    } 
    if (length(uv-circle2Center)<circle2Radius)
    {
        color += vec4(0.0,0.0,1.0,1.0);
    } 
    if (length(uv-circle3Center)<circle3Radius)
    {
        color += vec4(0.0,1.0,0.0,1.0);
    } 
   
    gl_FragColor = color;
}
