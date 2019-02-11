uniform float time;
uniform vec2 resolution;
uniform vec2 center;
uniform float flicker;
uniform float invert;
uniform sampler2D butterflyTexture;

void main()	{
    vec2 scaledFragCoord = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
    vec2 screenCoord = scaledFragCoord.xy;
    vec2 screenCenter = center.xy;
    float aspect = resolution.x / resolution.y;
    screenCoord.x *= aspect;
    screenCenter.x *= aspect;

    float l = length(screenCoord - screenCenter) + (flicker * 0.003);

    float lightAlpha = (1.0 - smoothstep(0.0, 0.1, l)) * 0.4;
    lightAlpha += (smoothstep(0.05, 0.2, l) - smoothstep(0.15, 0.2, l)) * 0.1;

    float darkAlpha = smoothstep(0.2, 0.4, l) * 0.7;
    darkAlpha += smoothstep(0.2, 2.4, l) * 0.3;
    darkAlpha *= (1.0 - invert);

    gl_FragColor = texture2D(butterflyTexture, (scaledFragCoord - center) * 1.5 + 0.5);
    gl_FragColor.rgb = mix(vec3(step(0.001, lightAlpha)), gl_FragColor.rgb, gl_FragColor.a);
    gl_FragColor.rgb = invert - ((invert * 2.0 - 1.0) * gl_FragColor.rgb);
    gl_FragColor.a = gl_FragColor.a + darkAlpha + lightAlpha;
}
