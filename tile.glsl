#define PI 3.14159265359

#define PI2 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif
// 1
// Common uniforms
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_frame;

// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

/*
 * Returns a value between 1 and 0 that indicates if the pixel is inside the square
 */
float square(vec2 pixel, vec2 bottom_left, float side) {
    vec2 top_right = bottom_left + side;

    return smoothstep(-1.0, 1.0, pixel.x - bottom_left.x) * smoothstep(-1.0, 1.0, pixel.y - bottom_left.y)
            * smoothstep(-1.0, 1.0, top_right.x - pixel.x) * smoothstep(-1.0, 1.0, top_right.y - pixel.y);
}

/*
 * Returns a value between 1 and 0 that indicates if the pixel is inside the rectangle
 */
float rectangle(vec2 pixel, vec2 bottom_left, vec2 sides) {
    vec2 top_right = bottom_left + sides;
    float rnd = random(pixel);
    return smoothstep(rnd, 1.0, pixel.x - bottom_left.x) * smoothstep(rnd, 1.0, pixel.y - bottom_left.y)
            * smoothstep(rnd, 1.0, top_right.x - pixel.x) * smoothstep(rnd, 1.0, top_right.y - pixel.y);
}

/*
 * Returns a value between 1 and 0 that indicates if the pixel is inside the circle
 */
float circle(vec2 pixel, vec2 center, float radius) {
    return 1.0 - smoothstep(radius - 1.0, radius + 1.0, length(pixel - center));
}

/*
 * Returns a value between 1 and 0 that indicates if the pixel is inside the ellipse
 */
float ellipse(vec2 pixel, vec2 center, vec2 radii) {
    vec2 relative_pos = pixel - center;
    float dist = length(relative_pos);
    float r = radii.x * radii.y * dist / length(radii.yx * relative_pos);

    return 1.0 - smoothstep(r - 1.0, r + 1.0, dist);
}

/*
 * Returns a value between 1 and 0 that indicates if the pixel is inside the line segment
 */
float lineSegment(vec2 pixel, vec2 start, vec2 end, float width) {
    vec2 pixel_dir = pixel - start;
    vec2 line_dir = end - start;
    float line_length = length(line_dir);
    float projected_dist = dot(pixel_dir, line_dir) / line_length;
    float tanjential_dist = sqrt(dot(pixel_dir, pixel_dir) - projected_dist * projected_dist);

    return smoothstep(-1.0, 1.0, projected_dist) * smoothstep(-1.0, 1.0, line_length - projected_dist)
            * (1.0 - smoothstep(-1.0, 1.0, tanjential_dist - 0.5 * width));
}

/*
 * Returns a rotation matrix for the given angle
 */
mat2 rotate(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

/*
 * The main program
 */
void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    // Set the background color
    vec3 pixel_color = vec3(0.0);
    vec2 center = vec2(0.5);
    // Divide the screen in a grid
    vec2 grid1_pos = mod(gl_FragCoord.xy, 250.0);
    float d = distance(st, center); 
    float animationSeconds = 2.;
    // Add a blue square to each grid element
    // pixel_color = mix(pixel_color, vec3(sin(u_time) * 0.03, sin(u_time) * 0.04, sin(u_time) * .3), square(grid1_pos, vec2(sin(u_time) * 5.0, sin(u_time) * 5.0), sin(u_time) *  250.0));
    float resistance = .2 + fract(-d) - d;
    float sinVal = abs(sin(PI2*(u_time * 0.25)/animationSeconds)/2.0 + 0.5);
    float cosVal = abs(cos(PI2*(u_time * 0.25)/animationSeconds)/2.0 + 0.5);
    //grid1_pos = mod(rotate(radians(u_time *2.)) * gl_FragCoord.xy, 400.0 * resistance * fract(d));

    // Define a second rotated grid
    vec2 grid2_pos = mod(rotate(radians(u_time)) * gl_FragCoord.xy, 400.0 * resistance * fract(-d));


    // Add a red circle to each grid element
    pixel_color = mix(pixel_color, vec3(0.0, sinVal, 1.0), circle(grid1_pos, vec2(0.0, 0.0), sinVal * 80.0));
    d = sqrt(d);

    // Add ten grey lines to each grid element
    for (float i = 0.0; i < 10.0; ++i) {
        pixel_color = mix(pixel_color, vec3(0.0, sinVal * 0.12, 0.502),
                lineSegment(grid1_pos, vec2(sinVal * 10.0 * d, 1. + d - -sinVal *  10.0 * i + sinVal), vec2(sinVal * 250.0, sinVal * 100.0 - 10.0 * i), 4.0 * sinVal));
    }
    grid1_pos = mod(rotate(radians(-u_time *10.)) * gl_FragCoord.xy, 200.0 * resistance * fract(d));
    // Apply some rotations to the grid
    // adjuting the position
    grid1_pos -= 100.0 * sinVal;
    grid1_pos = rotate(-sinVal) * fract(grid1_pos);
    grid1_pos += 100.0 * sinVal;
    grid1_pos -= 60.0 * sinVal;
    grid1_pos = rotate(sinVal) * fract(grid1_pos);
    grid1_pos += 60.0 * sinVal;

    // Draw a green rectangle to each grid element
    pixel_color = mix(pixel_color, vec3(sinVal * 0.5, sinVal * 0.1, 0.08314), rectangle(grid1_pos, vec2(sinVal * d * 10., 1. + sinVal * 50.0), vec2(abs(cosVal) * d * 20., 250.5)));
    // Add a  circle to each grid element
    pixel_color = mix(pixel_color, vec3(0.1, sinVal * d * 0.25, cosVal * d * 0.55), circle(grid2_pos, vec2(50. / sinVal * d, sinVal * 50. / sinVal), cosVal * d * 100.));
    // Add a white circle to each grid element
    pixel_color = mix(pixel_color, vec3(1.0), circle(grid2_pos, vec2(50. / sinVal * d, sinVal * 50. / sinVal), cosVal * d * 50.));
    pixel_color *= d;
    // Fragment shader output
    gl_FragColor = vec4(pixel_color, 1.0);
}