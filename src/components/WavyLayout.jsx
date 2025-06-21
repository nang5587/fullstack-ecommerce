import React, { useState, useRef, useLayoutEffect } from 'react';

// ✨ 1. 새롭고 더 유연한 props를 받도록 수정
export default function WavyLayout({
    children,
    childWidth,
    childHeight, // 카드의 전체 높이
    verticalStep, // 카드가 아래로 이동할 거리 (이 값이 childHeight보다 작으면 겹침)
    className = '',
}) {
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const items = React.Children.toArray(children);
    const totalItems = items.length;

    if (totalItems <= 1) {
        return <div className={`flex flex-col items-start ${className}`}>{items}</div>;
    }

    const maxIndent = containerWidth > 0 ? containerWidth - childWidth : 0;
    const peakIndex = Math.floor((totalItems - 1) / 2);

    const itemPositions = items.map((_, index) => {
        let stepRatio = 0;
        if (index <= peakIndex) {
            stepRatio = peakIndex > 0 ? index / peakIndex : 0;
        } else {
            const stepsFromEnd = totalItems - 1 - index;
            stepRatio = peakIndex > 0 ? stepsFromEnd / peakIndex : 0;
        }
        return stepRatio * maxIndent;
    });

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {items.map((child, index) => {
                const currentIndent = itemPositions[index];

                return (
                    <div
                        key={child.key || index}
                        style={{
                            position: 'absolute',
                            width: childWidth,
                            // ✨ 2. top 위치를 verticalStep을 이용해 계산합니다.
                            top: `${index * verticalStep}px`,
                            transform: `translateX(${currentIndent}px)`,
                            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                    >
                        {child}
                        {index < totalItems - 1 && (
                            <Connector
                                startIndent={currentIndent}
                                endIndent={itemPositions[index + 1]}
                                childWidth={childWidth}
                                childHeight={childHeight} // Connector에 높이 전달
                                verticalStep={verticalStep}   // Connector에 간격 전달
                            />
                        )}
                    </div>
                );
            })}
            {/* ✨ 3. 전체 컨테이너의 높이를 동적으로 계산하여 스크롤이 가능하게 합니다. */}
            <div
                style={{
                    height: `${(totalItems - 1) * verticalStep + childHeight}px`,
                }}
            />
        </div>
    );
}

// ✨ 4. Connector 컴포넌트도 새 props를 받도록 수정
function Connector({ startIndent, endIndent, childWidth, childHeight, verticalStep }) {
    // 시작점 (현재 카드 하단 중앙)
    const startX = childWidth / 2;
    const startY = childHeight;

    // 끝점 (다음 카드 하단 중앙, 현재 카드 기준 상대 좌표)
    const endX = startX + (endIndent - startIndent);
    const endY = startY + verticalStep;

    // ✨ "부드러운 길"을 만드는 새로운 S-Curve 경로
    const path = `M ${startX} ${startY} C ${startX} ${startY + verticalStep * 0.5}, ${endX} ${endY - verticalStep * 0.5}, ${endX} ${endY}`;

    // 이 path의 의미:
    // M ${startX} ${startY}: 시작점에서 펜을 든다.
    // C ... : 베지에 곡선을 그린다.
    //   ${startX} ${startY + verticalStep * 0.5}: 첫 번째 제어점. 시작점에서 수직으로 절반 내려온 위치.
    //   ${endX} ${endY - verticalStep * 0.5}: 두 번째 제어점. 끝점에서 수직으로 절반 올라온 위치.
    //   ${endX} ${endY}: 곡선의 끝점.

    return (
        <svg
            className="absolute top-0 left-0"
            style={{ overflow: 'visible', zIndex: -1 }}
        >
            <path
                d={path}
                stroke="#B0926A" // ✨ 단색 대신 그라데이션을 사용합니다.
                strokeWidth="20"
                fill="none"
                strokeLinecap="round"
            />
        </svg>
    );
}