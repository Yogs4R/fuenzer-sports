import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box } from '@react-three/drei';
import * as THREE from 'three';

const Football: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5} position={[3.2, 0, -3]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.75, 12, 12]} />
        <meshStandardMaterial 
          color="#0b1326" 
          wireframe={true} 
          emissive="#4cd7f6" 
          emissiveIntensity={0.8} 
        />
      </mesh>
    </Float>
  );
};


const AnalyticsChart: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = time * -0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={1} position={[-3.2, 0, -3]}>
      <group ref={groupRef} rotation={[0.2, 0.5, 0]} scale={[1.4, 1.4, 1.4]}>
        {/* Bar 1 */}
        <Box args={[0.25, 0.8, 0.25]} position={[-0.4, 0.4, 0]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.5} />
        </Box>
        {/* Bar 2 */}
        <Box args={[0.25, 1.4, 0.25]} position={[0, 0.7, 0]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.8} />
        </Box>
        {/* Bar 3 */}
        <Box args={[0.25, 1.1, 0.25]} position={[0.4, 0.55, 0]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.4} />
        </Box>
      </group>
    </Float>
  );
};

const FloatingSportsObjects: React.FC = () => {
  return (
    <div className="absolute -inset-x-16 md:-inset-x-36 -inset-y-8 z-0 pointer-events-none opacity-60 mix-blend-screen overflow-visible">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#4cd7f6" />
        <Football />
        <AnalyticsChart />
      </Canvas>
    </div>
  );
};

export default FloatingSportsObjects;
