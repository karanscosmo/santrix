"use client";

import React, { useEffect, useRef } from "react";

export const WebGLBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);
    syncSize();

    const rawGl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!rawGl) return;
    const gl = rawGl as WebGLRenderingContext;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      float network(vec2 uv, float speed) {
          vec2 g = uv * 8.0;
          vec2 id = floor(g);
          vec2 f = fract(g);
          
          float m = 0.0;
          for(float y=-1.0; y<=1.0; y++) {
              for(float x=-1.0; x<=1.0; x++) {
                  vec2 offs = vec2(x, y);
                  vec2 p = offs + sin(u_time * speed + (id + offs) * 123.4) * 0.4 + 0.5;
                  float d = length(f - p);
                  m += smoothstep(0.02, 0.0, d) * (0.5 + 0.5 * sin(u_time + id.x));
              }
          }
          return m;
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 centered_uv = (uv - 0.5) * (u_resolution.x / u_resolution.y);
          
          vec3 color = vec3(0.02, 0.02, 0.05); // Deep base
          
          float n1 = network(uv, 0.5);
          float n2 = network(uv * 1.5 + 10.0, 0.3);
          
          color += n1 * vec3(0.0, 0.4, 1.0) * 0.5;
          color += n2 * vec3(0.0, 0.8, 1.0) * 0.3;
          
          // Add a central glow
          float pulse = 0.5 + 0.5 * sin(u_time * 0.2);
          color += (0.05 / length(centered_uv)) * vec3(0.0, 0.2, 0.5) * pulse;
          
          // Scanline effect
          float scanline = sin(uv.y * 800.0) * 0.02;
          color -= scanline;

          gl_FragColor = vec4(color, 1.0);
      }
    `;

    function cs(glCtx: WebGLRenderingContext, type: number, src: string) {
      const s = glCtx.createShader(type);
      if (!s) return null;
      glCtx.shaderSource(s, src);
      glCtx.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    const vertexShader = cs(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = cs(gl, gl.FRAGMENT_SHADER, fs);

    if (!prog || !vertexShader || !fragmentShader) return;

    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    let animationFrameId: number;

    function render(t: number) {
      if (!canvas || !gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
};
export default WebGLBackground;
