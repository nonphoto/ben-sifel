uniform float time;
uniform vec2 resolution;
uniform vec2 center;

void main()	{
    vec2 coord = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
    coord.x *= resolution.x / resolution.y;

    float alpha = smoothstep(0.2, 0.3, length(coord - center)) * 0.5;
    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}