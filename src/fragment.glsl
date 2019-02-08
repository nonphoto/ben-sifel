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

    vec4 sample = texture2D(butterflyTexture, scaledFragCoord - center + 0.5);

    float l = length(screenCoord - screenCenter) + (flicker * 0.003);
    float glow = (1.0 - smoothstep(0.0, 0.1, l)) * 0.4;
    float ring = (smoothstep(0.05, 0.2, l) - smoothstep(0.15, 0.2, l)) * 0.1;
    float dark = smoothstep(0.2, 0.4, l) * 0.7;
    float vignette = smoothstep(0.2, 2.4, l) * 0.3;
    float alpha = glow + ring + (dark * invert);
    float value = step(0.2, l) - sample.r;
    value = invert - ((invert * 2.0 - 1.0) * value);

    gl_FragColor = vec4(value, value, value, alpha + sample.a);
}
