uniform float time;
uniform vec2 resolution;
uniform vec2 center;
uniform float flicker;
uniform float invert;
uniform sampler2D butterflyTexture;

const float lightScale = 1.3;
const float butterflyScale = 3.5;

void main()	{
    vec2 uv = (gl_FragCoord.xy / resolution) - 0.5;
    vec2 p = uv.xy + (center * 0.5);
    float aspect = resolution.x / resolution.y;
    p.y -= 0.1;
    p.x *= -aspect;

    float l = length(p * lightScale) + (flicker * 0.003);

    float lightAlpha = (1.0 - smoothstep(0.0, 0.1, l)) * 0.4;
    lightAlpha += (smoothstep(0.05, 0.2, l) - smoothstep(0.15, 0.2, l)) * 0.1;

    float darkAlpha = smoothstep(0.2, 0.4, l) * 0.7;
    // darkAlpha += smoothstep(0.2, 2.4, l) * 0.3;
    darkAlpha *= (1.0 - invert);

    gl_FragColor = texture2D(butterflyTexture, (p * butterflyScale) + 0.5);
    gl_FragColor.rgb = mix(vec3(step(0.001, lightAlpha)), gl_FragColor.rgb, gl_FragColor.a);
    gl_FragColor.rgb = invert - ((invert * 2.0 - 1.0) * gl_FragColor.rgb);
    gl_FragColor.a = gl_FragColor.a + darkAlpha + lightAlpha;
}
