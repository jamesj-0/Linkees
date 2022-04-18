import React from "react";
import ShadertoyReact from "shadertoy-react";

// Basic fragment shader for
// const fragmentShader = `
//   void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
//     vec2 uv = fragCoord.xy/iResolution.xy;
//     vec3 col = 0.5 + 0.5*cos((iTime*0.2)+uv.xyx+vec3(0,2,4));
//     fragColor = vec4(col ,1.0);
//   }
// `;

const fragmentShader = `

#define time iTime

const float arrow_density = .1;
const float arrow_length = .0;

const vec3 luma = vec3(0.2126, 0.7152, 0.0722);

float f(in vec2 p)
{
    return sin(p.x+sin(p.y+time*0.01)) * sin(p.y*p.x*0.1+time*0.07);
}


//---------------Field to visualize defined here-----------------
vec2 field(in vec2 p)
{
	vec2 ep = vec2(.05,0.);
    vec2 rz= vec2(0);
	for( int i=0; i<7; i++ )
	{
		float t0 = f(p);
		float t1 = f(p + ep.xy);
		float t2 = f(p + ep.yx);
        vec2 g = vec2((t1-t0), (t2-t0))/ep.xx;
		vec2 t = vec2(-g.y,g.x);
        
        p += .9*t + g*0.3;
        rz= t;
	}
    
    return rz;
}
//---------------------------------------------------------------

float segm(in vec2 p, in vec2 a, in vec2 b) //from iq
{
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp(dot(pa,ba)/dot(ba,ba), 0., 1.);
	return length(pa - ba*h)*20.*arrow_density;
}

float fieldviz(in vec2 p)
{
    vec2 ip = floor(p*arrow_density)/arrow_density + .5/arrow_density;   
    vec2 t = field(ip);
    float m = pow(length(t),0.5)*(arrow_length/arrow_density);
    vec2 b = normalize(t)*m;
    float rz = segm(p, ip, ip+b);
    vec2 prp = (vec2(-b.y,b.x));
    rz = min(rz,segm(p, ip+b, ip+b*0.65+prp*0.3));
    return clamp(min(rz,segm(p, ip+b, ip+b*0.65-prp*0.3)),0.,1.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = fragCoord.xy / iResolution.xy-0.5;
	p.x *= iResolution.x/iResolution.y;
    p *= 10.;
	
    vec2 fld = field(p);
    vec3 col = sin(vec3(-.5,0.1,0.5)+fld.x-fld.y)*0.65+0.35;
    // vec3 col = sin(vec3(-.5,0.1,0.5)+fld.x-fld.y)*0.65+0.35; blue
    float fviz = fieldviz(p);

	fragColor = vec4(col,1.0);
}
`;

function ShaderToy(){
    return <ShadertoyReact fs={fragmentShader} />
}

export default ShaderToy;
