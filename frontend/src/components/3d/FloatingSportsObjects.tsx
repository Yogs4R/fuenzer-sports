import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const Football: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[-4, 1, -5]}>
      <Sphere ref={meshRef} args={[1.5, 16, 16]}>
        <meshStandardMaterial 
          color="#0b1326" 
          wireframe={true} 
          emissive="#4cd7f6" 
          emissiveIntensity={0.5} 
        />
      </Sphere>
    </Float>
  );
};

const Gamepad: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5} position={[4, -1, -3]}>
      <group ref={groupRef} rotation={[0.5, -0.5, 0]}>
        {/* Main Body */}
        <Box args={[2, 0.8, 1]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.3} />
        </Box>
        {/* Left D-pad / Stick */}
        <Cylinder args={[0.3, 0.3, 0.2, 8]} position={[-0.5, 0.4, 0]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.5} />
        </Cylinder>
        {/* Right Buttons */}
        <Cylinder args={[0.15, 0.15, 0.2, 8]} position={[0.4, 0.4, -0.2]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.5} />
        </Cylinder>
        <Cylinder args={[0.15, 0.15, 0.2, 8]} position={[0.7, 0.4, 0.1]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.5} />
        </Cylinder>
      </group>
    </Float>
  );
};

const FloatingSportsObjects: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen">
      {/* Fade out mask at bottom to blend into the rest of the page */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-bg-0 z-10" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#4cd7f6" />
        <Football />
        <Gamepad />
      </Canvas>
    </div>
  );
};

export default FloatingSportsObjects;
