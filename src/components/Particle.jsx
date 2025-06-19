import { useCallback, useEffect, useState } from "react";

import Particles, { initParticlesEngine } from "@tsparticles/react";

import { loadFull } from "tsparticles";



export default function Particle() {

    const [init, setInit] = useState(false);



    useEffect(() => {

        console.log("init");

        initParticlesEngine(async (engine) => {

            await loadFull(engine);

        }).then(() => {

            setInit(true);

        });

    }, []);



    const particlesLoaded = (container) => {

        // You can add any logic here that should run when particles are loaded

    };



    return (

        <>

            {init && (

                <Particles

                    id="tsparticles"

                    particlesLoaded={particlesLoaded}

                    options={{
                        fullScreen: {
                            enable: false, // 전체 화면 모드를 끕니다.
                        },
                        fpsLimit: 120,

                        interactivity: {

                            events: {

                                onClick: {

                                    enable: true,

                                    mode: "push",

                                },

                                onHover: {

                                    enable: true,

                                    mode: "repulse",

                                },

                                resize: true,

                            },

                            modes: {

                                push: {

                                    quantity: 4,

                                },

                                repulse: {

                                    distance: 200,

                                    duration: 0.4,

                                },

                            },

                        },

                        particles: {

                            color: {

                                value: [
                                    "#5DADE2",  // 시원한 바다 (톤 다운된 스카이 블루)
                                    "#3498DB",  // 딥 블루 (고급스러운 중간톤 바다)
                                    "#154360",  // 딥 네이비 (수심 깊은 바다 느낌)
                                    "#F5DEB3",  // 위트 베이지 (따뜻한 모래 느낌)
                                    "#EED9C4",  // 샌드핑크 (햇볕에 데운 고운 모래)
                                    "#FFF5E1"   // 밝은 햇빛 아래의 해변 (부드러운 모래 배경)
                                ],
                            },

                            move: {
                                enable: true,
                                direction: "bottom", // 아래 방향으로 움직임
                                speed: 2, // 속도를 조금 더 빠르게
                                straight: false, // 직선으로 떨어지지 않음
                                random: true, // 움직임이 좀 더 랜덤해짐
                                outModes: {
                                    default: "out", // 화면 아래로 나가면 사라짐
                                },
                            },
                            // 눈처럼 보이게 하려면 연결선(links)은 끄는 게 자연스럽습니다.
                            links: {
                                enable: false,
                            },

                            number: {

                                density: {

                                    enable: true,

                                    area: 800,

                                },

                                value: 160,

                            },

                            opacity: {

                                value: 1,

                            },

                            shape: {

                                type: "circle",
                                polygon: {
                                    edges: 3, // 삼각형 (물방울과 유사)
                                },

                            },

                            size: {

                                value: { min: 1, max: 5 },

                            },

                        },
                        emitters: { // 추가 파티클 효과 (예: 물방울이 튀는 효과)
                            direction: "top",
                            particles: {
                                color: {
                                    value: "#00BFFF",
                                },
                                shape: {
                                    type: "circle",
                                },
                                opacity: {
                                    value: 0.5,
                                },
                                size: {
                                    value: 2,
                                },
                                move: {
                                    enable: true,
                                    speed: 5,
                                    outModes: {
                                        default: "destroy",
                                    },
                                },
                            },
                            position: {
                                x: 50,
                                y: 100,
                            },
                            rate: {
                                delay: 0.1,
                                quantity: 1,
                            },
                        },

                        detectRetina: true,

                    }
                    }

                />

            )}

        </>

    );

}