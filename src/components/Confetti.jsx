import React, { useRef, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import soundManager from "../utils/soundManager";

// Enhanced confetti with pooling, shapes, and adaptive caps for mobile
export default function Confetti() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const celebration = useGameStore((s) => s.celebration);
  const settings = useGameStore((s) => s.settings);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(DPR, DPR);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", resize);

    // adaptive cap
    const maxParticles = width < 640 ? 220 : 420;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const p = particlesRef.current;
      for (let i = p.length - 1; i >= 0; i--) {
        const o = p[i];
        o.x += o.vx;
        o.y += o.vy;
        // gravity & drag
        o.vy += 0.06;
        o.vx *= 0.998;
        o.rot += o.speedRot;
        o.ttl -= 1;

        ctx.save();
        ctx.translate(o.x, o.y);
        ctx.rotate(o.rot);
        ctx.fillStyle = o.color;
        switch (o.shape) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, o.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "triangle":
            ctx.beginPath();
            ctx.moveTo(0, -o.size / 1.2);
            ctx.lineTo(o.size / 1.2, o.size / 1.8);
            ctx.lineTo(-o.size / 1.2, o.size / 1.8);
            ctx.closePath();
            ctx.fill();
            break;
          default:
            // rect
            ctx.fillRect(-o.size / 2, -o.size / 2, o.size, o.size * 0.6);
        }
        ctx.restore();

        if (o.y > height + 60 || o.ttl <= 0 || p.length > maxParticles)
          p.splice(i, 1);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    // start render loop
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Spawn confetti when celebration.active toggles true
  useEffect(() => {
    if (!celebration?.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = window.innerWidth;

    // different intensity for finish vs streak
    const burst = celebration.type === "finish" ? 160 : 60;
    // adapt on mobile
    const scaledBurst = width < 640 ? Math.floor(burst * 0.6) : burst;

    const pRef = particlesRef.current;
    const centerX = width / 2;
    for (let i = 0; i < scaledBurst; i++) {
      pRef.push({
        x: centerX + (Math.random() - 0.5) * 360,
        y: -10 - Math.random() * 60,
        vx: (Math.random() - 0.5) * 10,
        vy: 2 + Math.random() * 8,
        size: 6 + Math.random() * 12,
        rot: Math.random() * Math.PI * 2,
        speedRot: (Math.random() - 0.5) * 0.5,
        color: [
          "#F59E0B",
          "#16A34A",
          "#10B981",
          "#EF4444",
          "#7C3AED",
          "#F97316",
        ][Math.floor(Math.random() * 6)],
        ttl: 180 + Math.random() * 240,
        shape:
          Math.random() < 0.6
            ? "rect"
            : Math.random() < 0.85
            ? "circle"
            : "triangle",
      });
    }
    // play confetti sound if allowed
    try {
      if (settings?.sound) soundManager.play("confetti");
    } catch {
      // ignore
    }
  }, [celebration, settings?.sound]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 60,
      }}
    />
  );
}
