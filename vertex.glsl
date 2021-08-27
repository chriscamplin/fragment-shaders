#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 vertPosition;

void main() {
  gl_Position = vec4(vertPosition,0.0, 1.0)

}
