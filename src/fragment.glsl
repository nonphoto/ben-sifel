uniform float time;
uniform vec2 resolution;
uniform vec2 center;

void main()	{
    float value = step(resolution.x * 0.5, gl_FragCoord.x) * 1.0;
    float alpha = smoothstep(100.0, 150.0, length(gl_FragCoord.xy - center)) * 0.5;
    gl_FragColor = vec4(value, value, value, alpha);
}