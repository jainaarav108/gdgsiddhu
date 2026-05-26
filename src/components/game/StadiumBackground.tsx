"use client";

import { useEffect, useRef } from "react";

export default function StadiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Spotlight beams
    const lights = Array.from({ length: 6 }, (_, i) => ({
      x: (canvas.width / 5) * (i + 0.5),
      angle: Math.random() * 0.4 - 0.2,
      speed: (Math.random() * 0.002 + 0.001) * (i % 2 === 0 ? 1 : -1),
      opacity: Math.random() * 0.3 + 0.1,
    }));

    // Particle dots (crowd)
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4 + canvas.height * 0.6,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.05 + 0.02,
    }));

    let animFrame: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const bg = ctx.createRadialGradient(
        canvas.width / 2, 0, 0,
        canvas.width / 2, canvas.height * 0.5, canvas.width * 0.8
      );
      bg.addColorStop(0, "rgba(26,39,68,0.6)");
      bg.addColorStop(0.5, "rgba(10,15,30,0.8)");
      bg.addColorStop(1, "rgba(5,8,16,0.95)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stadium spotlight beams
      lights.forEach((light) => {
        light.angle += light.speed;
        const endX = canvas.width / 2 + Math.sin(light.angle) * canvas.height * 1.5;
        const endY = canvas.height * 1.2;

        const gradient = ctx.createLinearGradient(light.x, -20, endX, endY);
        gradient.addColorStop(0, `rgba(255,215,0,${light.opacity})`);
        gradient.addColorStop(0.4, `rgba(255,215,0,${light.opacity * 0.3})`);
        gradient.addColorStop(1, "rgba(255,215,0,0)");

        ctx.beginPath();
        ctx.moveTo(light.x - 15, -10);
        ctx.lineTo(light.x + 15, -10);
        ctx.lineTo(endX + 120, endY);
        ctx.lineTo(endX - 120, endY);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Crowd particles
      particles.forEach((p) => {
        p.flicker += p.flickerSpeed;
        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.flicker + t));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,0,${alpha})`;
        ctx.fill();
      });

      t += 0.01;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
