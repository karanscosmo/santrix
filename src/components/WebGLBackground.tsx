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
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
      }

      float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
          
          // Deep background color
          vec3 backgroundColor = vec3(0.02, 0.02, 0.04);
          
          // Flowing data lines
          float flow = 0.0;
          for(float i = 1.0; i < 5.0; i++) {
              flow += 0.05 / abs(p.y + sin(p.x * i + u_time * 0.5) * 0.2 * noise(p + u_time * 0.1));
          }
          
          // Agent nodes (shimmering points)
          float nodes = 0.0;
          for(float i = 0.0; i < 10.0; i++) {
              vec2 nodePos = vec2(sin(u_time * 0.2 + i * 1.5), cos(u_time * 0.3 + i * 0.8)) * 0.8;
              float d = length(p - nodePos);
              nodes += 0.002 / pow(d, 1.5) * (0.5 + 0.5 * sin(u_time * 2.0 + i));
          }
          
          // Wolfram pulses (radial glows)
          float pulses = 0.0;
          vec2 pulsePos = vec2(0.0);
          float pulseDist = length(p - pulsePos);
          pulses = 0.1 * exp(-pulseDist * 2.0) * (0.5 + 0.5 * sin(u_time * 1.5));
          
          vec3 color = backgroundColor;
          color += flow * vec3(0.0, 0.4, 1.0) * 0.5; // Computational Blue
          color += nodes * vec3(0.0, 0.95, 1.0);     // Intelligence Cyan
          color += pulses * vec3(0.87, 0.07, 0.0);   // Wolfram Red
          
          // Subtle grid overlay
          vec2 grid = fract(uv * 40.0 + u_time * 0.02);
          float gridLine = step(0.98, grid.x) + step(0.98, grid.y);
          color += gridLine * 0.02;

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
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    function render(t: number) {
      if (!canvas || !gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />;
};
export default WebGLBackground;
