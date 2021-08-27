#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846
#define PI2 6.28318530718
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .01

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex1;// ./hound.png
//uniform sampler3D u_tex2;// ./chongo.jpg
vec2 repeat=vec2(2,2);
float t=u_time*.125;

// pos in 3D space as input
float GetDist(vec3 p) {
    float loop = sin(PI2*(u_time-.75)/3.)/2.+.5;
    // sphere at middle left to right, 1 above the ground plane, radius is 1 (w)
    vec4 s = vec4(0,loop*2.+1.,6.,1.5);
    //p.z+=loop;
    // length of position - sphere, - sphere radius
    float sphereDist = length(p-s.xyz)-s.w;
    float planeDist = p.y;
    // total distance is minimum of those two distances
    float d = min(sphereDist, planeDist);
    return d;
}

float rayMarch(vec3 ro, vec3 rd) {
    //distance origin
    float dO = 0.;
    for(int i=0; i<MAX_STEPS;i++) {
        vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO+=dS;
        if(dO>MAX_DIST || dS<SURF_DIST) break;
    }
    return dO;
}

vec3 GetNormal(vec3 p) {
    float d = GetDist(p);
    vec2 e = vec2(.01, 0);

    vec3 n = d - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx)
    );

    // repeat pattern
    vec2 repeater=vec2(mod(p.x+repeat.x,1.),mod(p.y+repeat.y,1.));
    vec3 txt = texture2D(u_tex1, repeater).rgb;

    return normalize(n)*txt;
}

float GetLight(vec3 p) {
    vec3 lightPos = vec3(0,2.5,0);
    lightPos.xz += vec2(sin(t), cos(t));
    //light
    vec3 l = normalize(lightPos - p);
    
    // normal
    vec3 n = GetNormal(p);

    float dif = clamp(dot(n, l), 0., 1.);
    float d = rayMarch(p+n*SURF_DIST*2., l);

    // sphere shadow
    if(d<length(lightPos-p)) dif *= .341;
    return dif;
}

void main() {
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 UV=gl_FragCoord.xy/u_resolution.xy;
    vec3 col = vec3(0.1);

    float s=sin(PI2*(u_time-.75)/20.)/2.+.5;

    // Ray origin
    vec3 ro = vec3(0, 2., 0);
    for(int i = 0; i<4;i++) {
        //uv=abs(uv)/dot(uv*s,uv/s)-vec2(.5);
        //uv=abs(uv)*dot(uv+1.,uv-1.)-vec2(.1);
    }
    //uv*=abs(uv);
    // Ray direction
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));
    float d = rayMarch(ro, rd);

    vec3 p=ro+rd*d;
    vec3 p2=ro+rd*d;
    //p2.x += .75;
    // for(int i=0;i<1;i++){
    //     p*=abs(p)/dot(p,p)-vec3(.5);
    // }
    repeat.x*=t;
    //repeat.z+=t;
    //p.y+=s;
    float dif = GetLight(p);
    float x=atan(p.x,p.z)+t;// atan returns -pi t pi
    float y=atan(length(p.xzy),p.y);
    float bands=sin(y*400.+x*100.)*cos(x+y);
    float b1=smoothstep(.100002,.100001,bands+.5);
    float b2=smoothstep(.100002,.100001,bands);
    col=vec3(dif+.125);
    //col+=b1;
    //col += txt;
    //col -= GetNormal(p);
    //col *= vec3(d);
    gl_FragColor = vec4(col, 1.);
}