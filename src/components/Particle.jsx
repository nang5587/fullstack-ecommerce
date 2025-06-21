import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function Particle() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => setInit(true));
    }, []);

    const particlesLoaded = (container) => { };

    return (
        <>
            {init && (
                <Particles
                    id="tsparticles"
                    particlesLoaded={particlesLoaded}
                    options={{
                        fullScreen: {
                            enable: false,
                        },
                        fpsLimit: 60,
                        interactivity: {
                            events: {
                                onClick: { enable: true, mode: "push" },
                                onHover: { enable: true, mode: "repulse" },
                                resize: true,
                            },
                            modes: {
                                push: { quantity: 4 },
                                repulse: { distance: 150, duration: 0.6 },
                            },
                        },
                        particles: {
                            color: {
                                value: [
                                    "#A0E9FD", // 연한 하늘색
                                    "#3DC9FF", // 선명한 스카이블루
                                    "#00A8E8", // 딥 블루
                                    "#FFF7B2", // 부드러운 해변 모래빛
                                    "#FFE8A1", // 노란 빛깔 햇살
                                    "#FFFAE1", // 밝은 햇빛 느낌
                                ],
                            },
                            move: {
                                enable: true,
                                direction: "bottom",
                                speed: 1.2,
                                straight: false,
                                random: true,
                                outModes: { default: "out" },
                            },
                            links: { enable: false },
                            number: { density: { enable: true, area: 900 }, value: 120 },
                            opacity: {
                                value: 0.8,
                                anim: {
                                    enable: true,
                                    speed: 1,
                                    opacity_min: 0.3,
                                    sync: false,
                                },
                            },
                            shape: {
                                type: "circle",
                            },
                            size: { value: { min: 2, max: 6 } },
                        },
                        emitters: {
                            direction: "bottom",
                            particles: {
                                color: { value: "#B3E5FC" },
                                shape: { type: "circle" },
                                opacity: { value: 0.6 },
                                size: { value: 3 },
                                move: {
                                    enable: true,
                                    speed: 2,
                                    outModes: { default: "destroy" },
                                },
                            },
                            position: { x: 50, y: 0 },
                            rate: { delay: 0.12, quantity: 1 },
                        },
                        detectRetina: true,
                    }}
                />
            )}
        </>
    );
}
