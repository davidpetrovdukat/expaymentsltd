"use client";

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// Configuration
const PRIMARY_COLOR = '#135bec';
const CONNECTION_DISTANCE = 180; // Distance within which nodes connect

// Node definitions moved outside of component for React Compiler optimization
class Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;

    constructor(w: number, h: number, shouldReduceMotion: boolean) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;

        // Random slow velocity (passive drift)
        const speed = shouldReduceMotion ? 0 : 0.2;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;

        this.radius = Math.random() * 2 + 2; // Size between 2 and 4
    }

    update(w: number, h: number) {
        // Move node
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges smoothly
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = PRIMARY_COLOR;
        // Add fill opacity based on radius for depth effect
        context.globalAlpha = this.radius > 3 ? 0.6 : 0.3;
        context.fill();
    }
}

export default function HeroNetworkSvg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas to full window size for fluid animation
        const resizeCanvas = () => {
            // Get dimensions of the parent container holding the canvas
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const MAX_NODES = Math.min(Math.floor(canvas.width / 15), 50); // Scale node count based on width

        // Initialize nodes
        const nodes: Node[] = Array.from({ length: MAX_NODES }, () => new Node(canvas.width, canvas.height, !!shouldReduceMotion));

        let animationFrameId: number;

        const render = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw connections
            for (let i = 0; i < nodes.length; i++) {
                const nodeA = nodes[i];

                // Update node position
                nodeA.update(canvas.width, canvas.height);
                nodeA.draw(ctx);

                // Draw connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const nodeB = nodes[j];
                    const dx = nodeA.x - nodeB.x;
                    const dy = nodeA.y - nodeB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        ctx.moveTo(nodeA.x, nodeA.y);
                        ctx.lineTo(nodeB.x, nodeB.y);

                        // Opacity depends on proximity
                        const opacity = (1 - (distance / CONNECTION_DISTANCE)) * 0.4;
                        ctx.strokeStyle = PRIMARY_COLOR;
                        ctx.globalAlpha = opacity;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Reset alpha
            ctx.globalAlpha = 1;

            if (!shouldReduceMotion) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        // Start animation loop
        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [shouldReduceMotion]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none w-full h-full"
            style={{ opacity: 0.8 }}
            data-testid="hero-canvas"
        />
    );
}
