#define PI 3.14159265359


#define PI2 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st) {    
    return smoothstep(st.y - st.x * u_time, abs(u_time * st.y), abs(st.x * st.x * u_time));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 center = vec2(0.5);
    float y = distance(st.y, u_resolution.x * 0.1);
    float x = distance(st.x, u_resolution.y * 0.1);
    float m = abs(sin((u_time * 0.025) * PI2)) * 3.0;
    x = fract( pow(st.x * PI, st.y) * pow(st.x, st.y * PI2) * m * PI2); // return x modulo of 0.5
    //x =  x * PI2;
    y = fract(abs(sin(x * m) + 0.5)); // return only the fraction part of a number
    //x = ceil(st.x);  // nearest integer that is greater than or equal to x
   // y = floor(x * m); // nearest integer less than or equal to x
    //m = sign(st.x);  // extract the sign of x
   // y = abs(st.y);   // return the absolute value of x
    //y = clamp(st.x,0.0,1.0); // constrain x to lie between 0.0 and 1.0
    // y = min(0.0,m);   // return the lesser of x and 0.0
    //y = max(0.0,m);   // return the greater of x and 0.0 
    vec3 color = vec3(y * x * 0.5, x * 0.05, y * 0.5);

    // Plot a line 
    float pct = plot(st);
    //color = (1.0-pct)*color+pct*vec3(1.0, .5, 0.5);

	gl_FragColor = vec4(color,1.0);
}
