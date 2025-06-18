import { useGLTF } from '@react-three/drei';

export default function Model({ imgname }) {
    const gltf = useGLTF(`/3dImg/${imgname}.glb`);

    return (
        <primitive object={gltf.scene} />
    );
}
