#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415
#define PI2 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


float plot(vec2 st, float pct){
  return  smoothstep( pct - 0.02, pct, st.y) +
          smoothstep( pct, pct + 0.02, st.x);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    float animationSeconds = 8.0;
    float s = abs(sin(PI2*(u_time * 0.75)/animationSeconds)/2.0 + 0.5);
    float c = abs(cos(PI2*(u_time * 0.75)/animationSeconds)/2.0 + 0.5);
    float y = log(fract(s) * s / fract(st.y) / s);
    float x = log(fract(c) * s / fract(st.x) / s);

    vec3 color = vec3(y, 0, st.x);

    float pct = plot(st, y * x); 
    float pct2 = plot(st, x);
    float pct3 = plot(st, x - y);
    float pct4 = plot(st, x / y);
    float pct5 = plot(st, pow(x, y));
    float pct6 = plot(st, pow(y, x));
    vec2 topLeft = step(vec2(0.05), st);
    float pct7 = topLeft.x * topLeft.y;
    vec2 bottomRight = step(vec2(0.05), 1.0 - st);
    pct7 *= bottomRight.x * bottomRight.y;
    float pct8 = plot(topLeft, pow(x, y));
    color = (s-pct) * color + pct2 * vec3(c - 0.21, 0, c- 0.25);
    color *= (c-pct2) * color + pct4 *vec3(0.9608, 0.09608, 0.9608);
    color *= (s-pct8) * color + pct4 *vec3(0.9608, 0.09608, c);
    color *= (c-pct4) * color + pct3 *vec3(c, 0.09608, 0.9608);
    color *= (s-pct5) * color + pct8 *vec3(0.9608, 0.09608, c);
    color *= (c-pct8) * color + pct3 *vec3(c, 0.09608, 0.9608);

    color *= vec3(pct7, fract(pct7), pct7 - 0.5) * color +pct7;
    gl_FragColor = vec4(color,1.0);
}
