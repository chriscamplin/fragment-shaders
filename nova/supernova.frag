#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846
#define PI2 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Expanding Red Giant by Ubiquitous
// 2021-06-28

// Majority of code used is based from the following:
// Dwarf by Kali https://www.shadertoy.com/view/3sjGDV
// Corona effect based on https://www.shadertoy.com/view/4dXGR4
// Inspiration: kodelife https://hexler.net/software/kodelife/

float inner_radius=.7304;
float outer_radius=.225; 
float fov=.8;// not working in this version 
float zoom=1.8;
 
const float vol_steps=28.;
float vol_rot=.8;
float vol_fade=.15;

float surf_scale=6.95;
const int surf_iterations=6;
vec3 surf_param_1=vec3(.46,.35,.76);
float surf_param_2=.97;
float surf_param_3=.25;
float surf_exp=2.42;
float surf_base_value=.39;
float surf_intensity=.41;
float surf_brightness=3.6;
float surf_contrast=1.86;
float surf_rotation_speed=.25;
float surf_turbulence_speed=.15;

float cor_size=.57;
float cor_offset=.999999;
const int cor_iterations=14;
float cor_iteration_fade=2.3;
float cor_param_1=1.24;
float cor_param_2=1.3;
float cor_exp_1=1.6;
float cor_exp_2=1.5;
float cor_brightness=.81;
float cor_speed=.21;
float cor_speed_vary=1.2;

float glow_intensity=1.24;
float glow_size=3.42;

vec3 color_1=vec3(.21,.02,.01);
vec3 color_2=vec3(0.3412, 0.0, 0.2667);
float color_saturation=.13;
float color_contrast=3.8;
float color_brightness=.65;

mat3 lookat(vec3 fw,vec3 up){
    fw=normalize(fw);vec3 rt=normalize(cross(fw,normalize(up)));return mat3(rt,cross(rt,fw),fw);
}

float sphere(vec3 p,vec3 rd,float r){
    float b=dot(-p,rd),i=b*b-dot(p,p)+r*r;
    return i<0.?-1.5:b-sqrt(i);
}

mat2 rot(float a){
    float si=sin(a);
    float co=cos(a);
    return mat2(co,si,-si,co);
}

float snoise(vec3 uv,float res)//by trisomie21
{
    const vec3 s=vec3(1e0,1e2,1e4);
    uv*=res;
    vec3 uv0=floor(mod(uv,res))*s;
    vec3 uv1=floor(mod(uv+vec3(1.),res))*s;
    vec3 f=fract(uv);f=f*f*(3.-2.*f);
    vec4 v=vec4(uv0.x+uv0.y+uv0.z,uv1.x+uv0.y+uv0.z,
    uv0.x+uv1.y+uv0.z,uv1.x+uv1.y+uv0.z);
    vec4 r=fract(sin(v*3e-3)*4e5);
    float r0=mix(mix(r.x,r.y,f.x),mix(r.z,r.w,f.x),f.y);
    r=fract(sin((v+uv1.z-uv0.z)*3e-3)*1e5);
    float r1=mix(mix(r.x,r.y,f.x),mix(r.z,r.w,f.x),f.y);
    return mix(r0,r1,f.z)*2.-1.3;
}

float kset(vec3 p){//by me :P
    p*=surf_scale*(1.+outer_radius);
    float m=1000.;
    for(int i=0;i<surf_iterations;i++){
        float d=dot(p,p);
        p=abs(p)/d*surf_param_2-vec3(surf_param_1);
        m=min(m,abs(d-surf_param_3))*(1.+surf_param_3);
    }
    float c=pow(max(0.,1.-m)/1.,surf_exp);
    c=pow(c,surf_exp)*surf_exp*surf_intensity;
    return c;
}

//stolen and mutated code
float cor(vec2 p){
    float ti=u_time*cor_speed*cor_param_1+100.;
    float d=length(p);
    float fad=(exp(-13.5*d)-outer_radius)/(outer_radius+cor_size)*(1.3-step(2.5,d));
    
    float v1=fad;
    float v2=fad;
    float angle=atan(p.x,p.y)/6.2832;
    float dist=length(p)*cor_param_1/fov;
    vec3 crd=vec3(angle,dist,ti*1.2);
    float ti2=ti+fad*cor_speed_vary*cor_param_1;
    float t1=abs(snoise(crd+vec3(.3,-ti2*1.,ti2*.1),15.));
    float t2=abs(snoise(crd+vec3(.3,-ti2*.5,ti2*.2),45.));
    float it=float(cor_iterations);
    float s=1.;
    for(int i=1;i<=cor_iterations;i++){
        ti*=12.5;
        float pw=pow(.5,float(i));
        v1+=snoise(crd+vec3(.7,-ti,ti*.02),(pw*50.*(t1+1.5)))/it*s*.23;
        v2+=snoise(crd+vec3(.7,-ti,ti*.02),(pw*50.*(t2+1.5)))/it*s*.23;
    }
    v1=max(v1,0.);v2=max(v2,0.);
    float co=pow(v1*fad,cor_exp_2)*cor_brightness;
    co+=pow(v2*fad,cor_exp_2)*cor_brightness;
    co*=1.4-t1*cor_param_2*(1.-fad*.7);
    return co;
}
float dur=16.;

//messy code below
vec3 render(vec2 uv){
    vec3 ro=vec3(.2,.3,1.);
    float s=sin(PI2*(u_time-.75)/dur)/2.+.5;
    float cosi=cos(PI2*(u_time-.75)/dur)/2.+.5;
    ro.xz*=rot(u_time*surf_rotation_speed);
    vec3 rd=normalize(vec3(uv,fov));       
    //rd.xy*=s;
    rd=lookat(-ro,vec3(0.,1.,0.))*rd;
    float tot_dist=outer_radius-inner_radius;
    float st=tot_dist/vol_steps;
    float br=1./vol_steps;
    float tr=u_time*surf_rotation_speed;
    float tt=u_time*surf_turbulence_speed;
    float dist=0.;
    float c=0.;
    float dout=step(0.,sphere(ro,rd,outer_radius));
    float d;
    for(float i=0.;i<vol_steps;i++){ 
        d=sphere(ro,rd,inner_radius+i*st);
        d+=sphere(ro*.5,rd,inner_radius+i*st*s);
        dist+=st;
        vec3 p=ro+rd*d;
        float a=vol_rot*i+tt;
        p.yz*=rot(a); 
        p.xy*=rot(a);
        //c+=kset(p)*br*step(s+.25,d)*max(0.,1.-smoothstep(0.,tot_dist,dist)*vol_fade);
        c+=kset(p)*br*step(cosi,d)*max(s,1.-smoothstep(0.,tot_dist,dist)*vol_fade*tt);
    } 
    c+=surf_base_value;
    vec3 col=1.*mix(color_1,color_2,vec3(c))*c;
    inner_radius*=fov;
    outer_radius*=fov;
    glow_size*=fov;
    cor_size*=fov;
    float cor=cor(uv);
    float r1=inner_radius;
    float r2=outer_radius;
    float l=smoothstep(r1-cor_offset,r2,length(uv));
    float rt=outer_radius+glow_size;
    float sw=1.-smoothstep(.3,rt,length(uv));
    col=min(vec3(5.),pow(col,vec3(surf_contrast))*surf_brightness*surf_contrast);
    col+=cor*color_1*l+sw*color_2*glow_intensity;
    col=mix(vec3(length(col)),col,color_saturation)*color_brightness;
    return pow(col,vec3(color_contrast));
}

void main()  {
    vec2 uv=gl_FragCoord.xy/u_resolution.xy-.5;
    uv.x*=u_resolution.x/u_resolution.y;
    float s=sin(PI2*(u_time-.75)/dur)/2.+.5;
    float cosi=cos(PI2*(u_time-.75)/dur)/2.+.5;

    //uv.x+=cos(u_time*.178924387342)*.1;
    zoom*=1.+sin(u_time*.2)*.2;
    float r=sqrt(dot(uv,uv));
    vec3 col = vec3(.0);
    if(r<.375*(s+.25)) {
        col=render(uv/zoom);
        col=pow(col,vec3(1.5))*vec3(1.1,1.,1.);

    }
    gl_FragColor=vec4(col,1.);
}

