uniform float time;
uniform vec2 resolution;

void main()	{
    float value = step(resolution.x * 0.5, gl_FragCoord.x) * 1.0;
    gl_FragColor = vec4(value, value, value, 0.5);
}