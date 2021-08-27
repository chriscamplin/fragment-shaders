

// Author https://www.youtube.com/watch?v=2R7h76GoIJM
// Title: Truchet - Art of code's algorithm

float hash21(vec2 p){
    p=fract(p*vec2(234.34,435.345));
    p+=dot(p,p+34.23);
    return fract(p.x*p.y);
}
vec2 rotate2D(vec2 _st,float _angle){
    //_st-=.5;
    _st=mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle))*_st;
    //_st+=.5;
    return _st;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    vec2 uv=(fragCoord.xy-.5*iResolution.xy)/iResolution.y;
    vec2 UV=fragCoord.xy/iResolution.xy;
    vec3 color=vec3(0.);
    float animDuration=16.;
    float s=sin(PI2*(u_time-.75)/animDuration)/2.+.5;
    // grid uv coord
    //uv.y+=2.;
    uv*=20.*s+6.;//*UV.y;
    float r=sqrt(dot(uv,uv));
    for(float i=0.;i<9.5;i+=1.5){
        if(r<float(i)*(s+.25)){
            uv=rotate2D(uv,mod(float(i),2.)==0.?PI2*s:-PI2*s);
        }
        
    }

    vec2 gv=fract(uv)-.5;
    vec2 id=floor(uv);
    float n=hash21(id);// random val between 0 & 1;
    if(r<9.*(s+.25)){
        gv.x*=-1.;
        float width=.1*(s+1.);
        if(n<.5)gv.x*=-1.;
        float a=atan(gv.x,gv.y);
        float line=abs(abs(gv.x+gv.y)-.5);
        float mask=smoothstep(.01,-.01,line-width);

        color+=vec3(mask);//,.01,mask);
                
    }

    // Output to screen
    fragColor = vec4(color,1.0);
}