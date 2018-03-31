uniform float time;
uniform vec2 resolution;
uniform vec2 center;
uniform float flicker;

void main()	{
    vec2 coord = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
    coord.x *= resolution.x / resolution.y;

    float l = length(coord - center) + (flicker * 0.003);
    float glow = (1.0 - smoothstep(0.0, 0.1, l)) * 0.4;
    float ring = (smoothstep(0.05, 0.2, l) - smoothstep(0.15, 0.2, l)) * 0.1;
    float dark = smoothstep(0.2, 0.4, l) * 0.7;
    float vignette = smoothstep(0.2, 2.4, l) * 0.3;
    float alpha = glow + ring + dark + vignette;
    float value = 1.0 - step(0.2, l);

    gl_FragColor = vec4(value, value, value, alpha);
}