import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
// [수정 1] Bounds와 ContactShadows를 추가로 import 합니다.
import { OrbitControls, Environment, Bounds, ContactShadows } from '@react-three/drei';

import Model from "./Model";

export default function ModelViewer({imgname}) {
    return (
        <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
            {/* [수정 3] camera prop을 제거합니다. Bounds가 자동으로 카메라를 조절합니다. */}
            <Canvas shadows>
                <Suspense fallback={null}>
                    {/* 조명 설정 */}
                    <ambientLight intensity={0.7} />
                    <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />

                    {/*
                        [수정 4] Bounds 컴포넌트로 모델을 감쌉니다.
                        - fit: Bounds가 모델에 딱 맞게 뷰를 조절하도록 합니다.
                        - clip: 경계 상자를 기준으로 뷰를 맞춥니다.
                        - margin: 모델과 화면 가장자리 사이에 약간의 여백을 줍니다. (예: 1.2)
                    */}
                    <Bounds fit clip margin={1.2}>
                        <Model imgname={imgname}/>
                    </Bounds>

                    {/* [추가] 바닥 그림자를 추가하여 더 사실적인 느낌을 줍니다. */}
                    <ContactShadows
                        position={[0, -1, 0]} // 그림자 위치를 모델 아래로
                        opacity={0.75}
                        scale={10}
                        blur={2}
                        far={2}
                    />

                    {/* 환경맵 */}
                    <Environment preset="city" />
                </Suspense>

                {/* OrbitControls는 Bounds와 함께 사용할 때 약간의 설정이 필요합니다. */}
                <OrbitControls
                    makeDefault // Bounds가 카메라를 조작한 후, OrbitControls가 그 제어권을 이어받습니다.
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 1.75} // 약간 위에서 내려다보는 각도까지 허용
                    enableZoom={true} // 줌을 다시 활성화하여 사용자가 확대/축소할 수 있게 합니다.
                    enablePan={false}
                    autoRotate
                />
            </Canvas>
        </div>
    );
}