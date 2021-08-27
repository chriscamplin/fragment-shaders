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

vec2 rotate(vec2 v, float a) {
    float angleInRadians = radians(a);
    float s = sin(angleInRadians);
    float c = -cos(angleInRadians);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

void main(void)
{
    //uv is pixel coordinates between -1 and +1 in the X and Y axiis with aspect ratio correction
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
    // sineVal is a floating point value between 0 and 1
    // starts at 0 when time = 0 then increases to 1.0 when time is half of animationSeconds and then back to 0 when time equals animationSeconds
    float sineVal = sin(PI2 * (u_time - 0.75) / animationSeconds) / 2.0;
    float cosVal = cos(PI2 * (u_time - 0.75) / animationSeconds) / 2.0 + 0.5;
    //rotate the uv coordinates between 0 and 180 degrees during the animationSeconds time length
    vec2 rotated_uv = rotate(uv,u_time/animationSeconds*90.);
    vec4 color = vec4(0.0); //init color variable to black

    //default pixel color is black
    color = vec4(0.0,0.0,0.0,1.0);
    for (int i=0;i<10;++i) {
      float idx = float(i);
      float normalizedIdx = idx * 0.123;
      float circle1Radius = normalizedIdx+(1.0-cosVal * idx * 0.03 - 0.3)*0.2; //radius of circle
      vec2 circle1Center = mix(vec2(-0.0,0.01 * idx * 0.3 ),vec2(0.58,0.0),sineVal * idx * 0.1);
      
      float circle2Radius = normalizedIdx+(sineVal * idx * 0.03 )*0.; //radius of circle
      vec2 circle2Center = mix(vec2(0.0,-0.0 * idx * 0.3 ),vec2(0.0,0.0 * idx * 0.1 ),cosVal * idx * 0.1);
      
      float circle3Radius = normalizedIdx+(idx * 0.05-cosVal * idx * 0.21 ) * 0.2; //radius of circle
      vec2 circle3Center = mix(vec2(-0.0 * idx * 0.1 ,-0.),vec2(0.58 * idx * 0.1 ,0.8),sineVal * idx * 0.1);
      
      float circle4Radius = normalizedIdx * 0.5+(idx * 0.05-sineVal * idx * 0.21 ) * 0.0002;  //radius of circle
      vec2 circle4Center = mix(vec2(-0.0 * idx * 0.1 ,-0.0),vec2(0.58 * idx * 0.1 ,0.8),sineVal * idx * 0.1);
      //test if pixel is within the circle
      float torusWidth = PI *.01 * normalizedIdx;
      float torusSmoothsize = 0.055;

      //vec4 color = vec4(0.0); //init color variable to black

      //default pixel color is black
      // color = vec4(0.0,0.0,0.0,1.0); 
      float c = normalizedIdx;
      c = smoothstep(torusWidth,torusWidth-torusSmoothsize,(abs(length(-rotated_uv - circle1Center)-circle1Radius)));        
      // c *= pow(c, 6.0);
      color += vec4(c,c,0.0,1.0);
      c = smoothstep(torusWidth,torusWidth-torusSmoothsize,(abs(length(-rotated_uv  -circle2Center)-circle2Radius)));        
      color += vec4(c-0.,0.0,c,1.0);
      c = smoothstep(torusWidth,torusWidth-torusSmoothsize,(abs(length(-rotated_uv - circle3Center)-circle3Radius)));        
      color += vec4(0.0,0.0,c,1.0);
      c = smoothstep(torusWidth,torusWidth-torusSmoothsize,(abs(length(-rotated_uv - circle4Center)-circle4Radius)));        
      color += vec4(0.0,c-0.1,c,1.0);
      c = smoothstep(torusWidth * 0.5, torusWidth * 0.5-torusSmoothsize * 0.5,(abs(length(-rotated_uv - circle4Center)-circle4Radius * 0.5)));        
      color += vec4(c,c-0.1,c,1.0);
      c = smoothstep(torusWidth * normalizedIdx - .01, torusWidth * normalizedIdx-torusSmoothsize * 0.25,(abs(length(-rotated_uv - circle4Center)-circle4Radius * 0.5)));        
      color += vec4(c,c,c,1.0);
    }

   
   
    gl_FragColor = color;
}
