import { glMatrix, mat4, quat, toRadian, vec2, vec3 } from "gl-matrix";

import fragmentShaderPattern from "../draw.glsl";

// intro demo
// lower precision less quality but faster...
// defines the points
const vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec2 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "uniform mat4 mWorld;",
  "uniform mat4 mView;",
  "uniform mat4 mProj;",
  "",
  "void main()",
  "{",
  " fragColor = vertColor;",
  " gl_Position = mProj * mView * mWorld * vec4(vertPosition, 0.0, 1.0);", // example of multiplying matrices together
  "}",
].join("\n");

const fragmentShaderText = [
  "precision mediump float;",
  "",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  "gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n");

function initWebGL() {
  console.log("this is working");
  let identity = new Float32Array(16);
  mat4.identity(identity);

  const canvas = document.getElementById("my-canvas");
  let gl = canvas.getContext("webgl");

  if (!gl) {
    console.log("WEBGL NOT SUPPORTED FALLING BACK ON EXPERIMENTAL");
    gl = canvas.getContext("experimental-webgl");
  }
  if (!gl) {
    console.log("WEBGL NOT SUPPORTED AT ALL");
  }

  gl.clearColor(0.75, 0.86, 0.8, 1.0);
  // multiple buffers
  // colour buffer & depth buffer- how deep into the screen a pixel is.
  // depth buffer when it draws pixel to the screen, ignores hidden pixels to save resources
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // set Source of the shader
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderPattern);
  gl.compileShader(fragmentShader);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(vertexShader)
    );
    return;
  }
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling fragmentShader shader!",
      gl.getShaderInfoLog(fragmentShader)
    );
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  // catch additional errors, not used in prod, too expensive
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program", gl.getShaderInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  // catch additional errors, not used in prod, too expensive
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR linking program", gl.getShaderInfoLog(program));
    return;
  }

  // CREATE BUFFERS
  // prettier-ignore
  const boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];
  // prettier-ignore
  const boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

  // prettier-ignore
  // var triangleVertices = [
  // X,  Y    Z       R    G    B
  //   0.0, 0.5, 0.0,  1.0, 1.0, 0.0, //
  //   -0.5, -0.5, 0.0,  0.7, 0.0, 1.0, //
  //   0.5, -0.5, 0.0,  0.1, 1.0, 0.6, //
  // ];

  var boxVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

  var boxIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(boxIndices),
    gl.STATIC_DRAW
  );

  var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  var colorAttribLocation = gl.getAttribLocation(program, "vertColor");

  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // NUmber of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex Elements
    0 // Offset from the beginning of a single vertex to this attr
  );
  gl.vertexAttribPointer(
    colorAttribLocation, // Attribute location
    3, // NUmber of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of individual Vertex Elements
    3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attr
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  //tell openGl state machine, which program should be active;
  gl.useProgram(program);

  const matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
  const matViewUniformLocation = gl.getUniformLocation(program, "mView");
  const matProjUniformLocation = gl.getUniformLocation(program, "mProj");

  const worldMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const projMatrix = new Float32Array(16);

  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
  // mat4.identity(viewMatrix);
  // z vale represents how far away from teh camera
  mat4.perspective(
    projMatrix,
    glMatrix.toRadian(45),
    canvas.width / canvas.height,
    0.1,
    1000.0
  );
  // now send these matrices over to the shader
  // set to true if you want the matrix to be...
  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  // MAIN RENDER loop
  // var loop = function () {
  //   update()
  // }

  //  gl.useProgram(program);
  // most of the time use TRIANGLES to draw
  // gl.drawArrays(gl.TRIANGLES, 0, 3);
  // gl.drawElements(gl.TRIANGLES, boxVertices.length, gl.UNSIGNED_SHORT);
  // gl.drawArrays(gl.TRIANGLES, 0, 3);
  const identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);
  let angle = 0; // don't assign variables inside game loops, memory allocation is expensive;
  const loop = function () {
    angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
    mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
    //gl.drawArrays(gl.TRIANGLES, 0, 3);
    // if a user switches tab this (RAF) will not be called
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

initWebGL();
