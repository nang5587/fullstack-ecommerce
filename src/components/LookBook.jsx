import { useEffect, useRef, useState } from "react";

export default function LookBook({ imageSrc, items, infoPosition = "right" }) {
    const [isHovered, setIsHovered] = useState(false);
    const [hasShownOnce, setHasShownOnce] = useState(false); // 한 번 보여줬는지 여부
    const containerRef = useRef(null);

    const flexDirection = infoPosition === "right" ? "flex-row" : "flex-row-reverse";
    const infoPositionStyles =
        infoPosition === "right"
            ? { left: "100%", right: "auto" }
            : { right: "100%", left: "auto" };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log("Observer Entry:", entry);
                if (entry.isIntersecting && !hasShownOnce) {
                    console.log(">>> Intersected <<<");
                    // 화면에 처음 등장하면 자동 hover
                    setIsHovered(true);
                    setHasShownOnce(true);

                    setTimeout(() => {
                        setIsHovered(false);
                    }, 1300);
                }
            },
            {
                threshold: 0.5,
            }
        );

        if (containerRef.current) {
            console.log("Observer set on", containerRef.current);
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [hasShownOnce]);

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-1 h-[800px] ${flexDirection} overflow-visible`}
        >
            <div
                className="relative w-[400px] h-full overflow-visible"
                onMouseEnter={() => hasShownOnce && setIsHovered(true)} // 한 번 보여준 후에만 hover 가능
                onMouseLeave={() => hasShownOnce && setIsHovered(false)}
            >
                <img
                    src={imageSrc}
                    alt="Model"
                    className={`w-full h-full object-contain ${isHovered ? "img-hovered" : "img-normal"
                        }`}
                />


                <div
                    className={`absolute top-0 h-full w-[200px] p-6 flex flex-col justify-center transition-opacity duration-300 ease-in-out ${isHovered
                        ? "opacity-100 pointer-events-auto translate-x-0"
                        : "opacity-0 pointer-events-none"
                        }`}
                    style={{
                        ...infoPositionStyles,
                        textAlign: infoPosition === "left" ? "right" : "left",
                    }}
                >

                </div>
            </div>
        </div>
    );
}