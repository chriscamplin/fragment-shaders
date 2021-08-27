#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846
#define PI2 6.28318530718
#define NUM_LAYERS 6.


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0;// ./texture.png
uniform sampler2D u_tex1;// ./bowie.jpeg
uniform sampler2D u_tex2;// ./bowie2.jpeg

mat2 rot2D(float a){
    float s=sin(a);
    float c=cos(a);
    return mat2(c,-s,s,c);
}

float Hash21(vec2 p){
    p=fract(p*vec2(123.34,465.21));
    p+=dot(p,p+45.32);
    return fract(p.x*p.y);
}

float Star(vec2 uv,float flare){
    // star
    float d=length(uv);
    float m=.05/d;
    
    float rays=max(0.,1.-abs(uv.x*uv.y*1000.));
    m+=rays*flare;
    //uv*=rot2D(PI*.25);
    rays=max(0.,1.-abs(uv.x*uv.y*1000.));
    m+=rays*.3*flare;
    
    // prevent glow bleeding into neighbouring cells
    m*=smoothstep(.75,.2,d);
    return m;
}

vec3 StarLayer(vec2 uv,float s){
    vec3 col=vec3(0.);
    // fract & floor 2 sides of the same coin
    vec2 gv=fract(uv)-.5;
    // Tile ID
    vec2 id=floor(uv);
    // grid coord
    for(int i=0;i<1;i++){
        //uv=abs(uv)/abs(dot(uv,uv))-vec2(.25);
    }
    vec2 dotGv=fract(uv)-.5;
    // Tile ID
    vec2 dotId=floor(uv);
    // iterate through getting neighbours by offset
    
    for(float y=-1.;y<=1.;y++){
        for(float x=-1.;x<=1.;x+=1.){
            vec2 offset=vec2(x,y);
            float n=Hash21(id+offset);// rand between 0 & 1
            float size=1.5;
            vec3 color=sin(vec3(.7,0., .2)*fract(n*2345.2)*PI2*20.)*.5+.5;
            color*=color*vec3(1.,.5,1.+size);
            float star=Star(gv-offset-vec2(n-.5,fract(n*34.))+.5,smoothstep(.9,1.,size));
            col+=star*size*color;
        }
    }
    // for(float y=-1.;y<=1.;y++){
    //     for(float x=-1.;x<=1.;x+=1.){
    //         vec2 offset=vec2(x,y);
    //         float n=Hash21(dotId+offset);// rand between 0 & 1
    //         float size=1.75;
    //         vec3 color=sin(vec3(.9)*fract(n*2345.2)*PI2*20.)*.5+.5;
    //         color*=color*vec3(1.,.5,1.+size);
    //         float star=Star(dotGv-offset-s-vec2(n-.5,fract(n*34.))+.5,smoothstep(.9,1.,size));
    //         col+=star*size*color;
    //     }
    // }
    // add red border to grid for debugging
    //if(gv.x>.48||gv.y>.48) col.r=1.;
    return col;
    
}

void main()
{
    // Normalized pixel coordinates (from -1 to 1) with aspect ratio fix
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    // actual uv normalised 0-1;
    vec2 UV=gl_FragCoord.xy/u_resolution.xy;
    uv*=4.;
    float t=u_time*.125;
    float s=sin(PI2*(u_time-.75)/16.)/2.+.5;
    //vec3 snd = texture(iChannel1, UV).rgb;
    //uv*=rot2D(t);

    //  bg color
    vec3 col=vec3(0.);
    for(int i=0;i<1;i++){
        //uv=abs(uv)/abs(dot(uv,uv))-vec2(s);
        //UV=abs(UV)*sin(UV*atan(UV.x,UV.y)*1.125);
       // UV+=.125;
    }
    vec3 txt=texture2D(u_tex2,UV).rgb;
    vec3 tx2t=texture2D(u_tex1,UV).rgb;
    for(float i=0.;i<1.;i+=1./NUM_LAYERS){
        float depth=fract(i+t);
        float scl=mix(20.,.54,depth);
        float fade=depth*smoothstep(1.,.9,depth);
        col+=StarLayer(uv*txt.rg*txt.gb*tx2t.rb*scl+i*453.2-s,s+.125)*fade;
    }
    col = normalize(fract(col*.5));

    //col.rb += id * .4;
    //col += Hash21(id);
    // Output to screen
    for(int i = 0; i<2; i++) {
       //txt=abs(txt*sin(txt*PI))/abs(dot(txt,txt))-vec3(s-.5);
       //txt= col+txt;
    }
    //txt *= fract(txt);
    //txt=col+txt;

    vec3 finalCol = col+sin(txt)*txt*txt;
    for(int i=0;i<1;i++){
        //finalCol=abs(finalCol)/abs(dot(finalCol,finalCol))-vec3(s);
    }

    gl_FragColor=vec4(finalCol,1.);
}