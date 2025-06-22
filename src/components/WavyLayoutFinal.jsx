// src/components/WavyLayoutFinal.jsx

import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import BoatIcon from './BoatIcon';

const PATH_ID = "kalani-sailing-path-final";

export default function WavyLayoutFinal({ children, childWidth, childHeight, verticalStep, className = '' }) {
    const [containerWidth, setContainerWidth] = useState(0);
    const layoutRef = useRef(null);

    const { scrollYProgress } = useScroll({ target: layoutRef });
    const pathProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useLayoutEffect(() => {
        const layout = layoutRef.current;
        if (!layout) return;

        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                setContainerWidth(entries[0].contentRect.width);
            }
        });
        observer.observe(layout);
        setContainerWidth(layout.offsetWidth);

        return () => observer.disconnect();
    }, []);

    const items = React.Children.toArray(children);
    const PATTERN_SIZE = 7; // 웨이브 모양을 정의하는 패턴 크기 (0~6)
    const PATTERN_PEAK_INDEX = Math.floor((PATTERN_SIZE - 1) / 2); // 3
    const totalItems = items.length;

    const itemPositions = useMemo(() => {
        console.log('--- itemPositions 계산 ---');
        if (containerWidth === 0) return items.map(() => 0);
        const maxIndent = containerWidth - childWidth;

        return items.map((_, index) => {
            let indexInPattern;

            // ✨ 1. 패턴 인덱스 계산 로직 수정
            // 이 부분이 문제 해결의 핵심입니다.
            if (index === 0) {
                // 첫 번째 카드는 항상 패턴의 시작(0)입니다.
                indexInPattern = 0;
            } else {
                // 두 번째 카드부터는 6개 주기로 패턴이 반복됩니다 (패턴 인덱스 1~6).
                // (index - 1)은 0부터 시작하는 카운터 역할을 합니다.
                // % 6 연산은 0~5 범위의 값을 만듭니다.
                // + 1 을 통해 최종적으로 1~6 범위로 조정합니다.
                indexInPattern = ((index - 1) % 6) + 1;
            }

            // 예시:
            // index 0 -> indexInPattern = 0 (1번 카드)
            // index 1 -> ((1-1)%6)+1 = 1 (2번 카드)
            // index 6 -> ((6-1)%6)+1 = 6 (7번 카드)
            // index 7 -> ((7-1)%6)+1 = 1 (8번 카드) -> 2번 카드와 동일한 패턴 위치!

            let stepRatio = 0;

            // ✨ 2. 수정된 indexInPattern을 사용하여 계단식 정렬 로직은 그대로 적용합니다.
            // 이 로직은 이제 올바른 `indexInPattern` 값을 받으므로 수정할 필요가 없습니다.
            if (indexInPattern <= PATTERN_PEAK_INDEX) {
                stepRatio = PATTERN_PEAK_INDEX > 0 ? indexInPattern / PATTERN_PEAK_INDEX : 0;
            } else {
                const stepsFromEndInPattern = (PATTERN_SIZE - 1) - indexInPattern;
                stepRatio = PATTERN_PEAK_INDEX > 0 ? stepsFromEndInPattern / PATTERN_PEAK_INDEX : 0;
            }

            const finalPosition = stepRatio * maxIndent;
            return Number.isFinite(finalPosition) ? finalPosition : 0;
        });
    }, [containerWidth, items.length, childWidth, PATTERN_PEAK_INDEX]); // 의존성 배열에 PATTERN_PEAK_INDEX 추가

    const fullPathD = useMemo(() => {
        if (itemPositions.length <= 1) return '';
        const startX = childWidth / 2;
        const startY = childHeight;
        
        let path = `M ${startX + itemPositions[0]} ${0 * verticalStep + startY}`;

        for (let i = 0; i < itemPositions.length - 1; i++) {
            const currentPosition = itemPositions[i];
            const nextPosition = itemPositions[i + 1];
            
            const pX = startX + currentPosition;
            const pY = i * verticalStep + startY;
            const cX = startX + nextPosition;
            const cY = (i + 1) * verticalStep + startY;
            
            // ✨ 경로 전환 로직은 기존대로 유지해도 괜찮습니다.
            // 이 로직은 7번째 카드(i=6)에서 8번째 카드로 넘어갈 때를 감지하여
            // 커브를 부드럽게 만들어줍니다.
            const isPatternTransition = (i + 1) % PATTERN_SIZE === 0;

            if (isPatternTransition) {
                path += ` C ${pX} ${pY + verticalStep * 0.8}, ${cX} ${cY - verticalStep * 0.2}, ${cX} ${cY}`;
            } else {
                path += ` C ${pX} ${pY + verticalStep * 0.5}, ${cX} ${cY - verticalStep * 0.5}, ${cX} ${cY}`;
            }
        }
        return path;
    }, [itemPositions, childWidth, childHeight, verticalStep, PATTERN_SIZE]);

    return (
        <div
            ref={layoutRef}
            className={`relative w-full transition-opacity duration-300 ${className}`}
            style={{
                height: `${(totalItems - 1) * (verticalStep || 0) + (childHeight || 0)}px`,
                opacity: containerWidth > 0 ? 1 : 0,
            }}
        >
            <svg width="0" height="0" style={{ position: 'absolute' }}><path id={PATH_ID} d={fullPathD} fill="none" /></svg>
            <svg className="absolute top-0 left-0 w-full h-full" style={{ overflow: 'visible', zIndex: 1 }}>
                <path d={fullPathD} stroke="url(#visible-line-gradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <defs><linearGradient id="visible-line-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{ stopColor: '#B5835A', stopOpacity: 0.5 }} /><stop offset="100%" style={{ stopColor: '#B5835A', stopOpacity: 0.05 }} /></linearGradient></defs>
            </svg>
            {items.map((child, index) => (
                <div key={child.key || index} style={{ position: 'absolute', width: childWidth, top: `${index * (verticalStep || 0)}px`, transform: `translateX(${itemPositions[index] || 0}px)`, zIndex: 10, transition: 'transform 0.6s ease-out' }}>
                    {child}
                </div>
            ))}
            {totalItems > 1 && (<BoatIcon progress={pathProgress} pathId={PATH_ID} />)}
        </div>
    );
}