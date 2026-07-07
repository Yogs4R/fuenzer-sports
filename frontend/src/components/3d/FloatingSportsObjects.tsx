import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const Whistle: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} position={[2.2, 1.2, -4]}>
      <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
        {/* Main Chamber */}
        <Cylinder args={[0.3, 0.3, 0.5, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.4} />
        </Cylinder>
        {/* Mouthpiece */}
        <Box args={[0.2, 0.25, 0.4]} position={[0, 0, 0.35]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.3} />
        </Box>
        {/* Loop */}
        <Cylinder args={[0.12, 0.12, 0.08, 8]} position={[0, 0, -0.32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.5} />
        </Cylinder>
      </group>
    </Float>
  );
};

const Cleats: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.2} position={[2.2, -1.2, -4]}>
      <group ref={groupRef} rotation={[0.4, 0.2, -0.2]} scale={[0.8, 0.8, 0.8]}>
        {/* Sole */}
        <Box args={[0.3, 0.08, 0.9]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.3} />
        </Box>
        {/* Shoe Body */}
        <Box args={[0.3, 0.3, 0.6]} position={[0, 0.16, -0.1]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.4} />
        </Box>
        {/* Studs (Spikes) */}
        {[-0.3, -0.1, 0.1, 0.3].map((z, i) => (
          <group key={i}>
            <Cylinder args={[0.03, 0.03, 0.08, 8]} position={[-0.08, -0.06, z]}>
              <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.6} />
            </Cylinder>
            <Cylinder args={[0.03, 0.03, 0.08, 8]} position={[0.08, -0.06, z]}>
              <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.6} />
            </Cylinder>
          </group>
        ))}
      </group>
    </Float>
  );
};

const AnalyticsChart: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * -0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={1} position={[-2.2, -0.8, -4]}>
      <group ref={groupRef} rotation={[0.2, 0.5, 0]} scale={[0.8, 0.8, 0.8]}>
        {/* Bar 1 */}
        <Box args={[0.25, 0.8, 0.25]} position={[-0.4, 0.4, 0]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.4} />
        </Box>
        {/* Bar 2 */}
        <Box args={[0.25, 1.4, 0.25]} position={[0, 0.7, 0]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.6} />
        </Box>
        {/* Bar 3 */}
        <Box args={[0.25, 1.1, 0.25]} position={[0.4, 0.55, 0]}>
          <meshStandardMaterial color="#0b1326" wireframe={true} emissive="#4cd7f6" emissiveIntensity={0.3} />
        </Box>
      </group>
    </Float>
  );
};

const FloatingSportsObjects: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen">
      {/* Fade out mask at bottom to blend into the rest of the page */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#050814] z-10" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#4cd7f6" />
        <Whistle />
        <Cleats />
        <AnalyticsChart />
      </Canvas>
    </div>
  );
};

export default FloatingSportsObjects;
