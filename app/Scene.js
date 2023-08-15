import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 600;
const XY_BOUNDS = 40;
const Z_BOUNDS = 20;
const MAX_SPEED_FACTOR = 2;
const MAX_SCALE_FACTOR = 50;

const CHROMATIC_ABBERATION_OFFSET = 0.007;

export const Scene = ({velocity}) => {
  const meshRef = useRef();
  const effectsRef = useRef();
  const tempColor = new THREE.Color();

  useEffect(() => {
    if (!meshRef.current) return;
    
    const t = new THREE.Object3D();
    let j = 0;
    for (let i = 0; i < COUNT * 3; i += 3) {
      t.position.x = generatePos();
      t.position.y = generatePos();
      t.position.z = (Math.random() - 0.5) * Z_BOUNDS;
      t.updateMatrix();
      meshRef.current.setMatrixAt(j++, t.matrix);
    }
    for (let i = 0; i < COUNT; i++) {
      tempColor.r = getRandomRGBColor()[0];
      tempColor.g = getRandomRGBColor()[1];
      tempColor.b = getRandomRGBColor()[2];
      meshRef.current.setColorAt(i, tempColor);
    }
  }, []);

  const temp = new THREE.Matrix4();
  const tempPos = new THREE.Vector3();
  const tempObject = new THREE.Object3D();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < COUNT; i++) {
      meshRef.current.getMatrixAt(i, temp);

      // update scale
      tempObject.scale.set(1, 1, Math.max(1, velocity * MAX_SCALE_FACTOR));

      // update position
      tempPos.setFromMatrixPosition(temp);
      if (tempPos.z > Z_BOUNDS / 2) {
        tempPos.z = -Z_BOUNDS / 2;
      } else {
        tempPos.z += Math.max(delta, velocity * MAX_SPEED_FACTOR);
      }
      tempObject.position.set(tempPos.x, tempPos.y, tempPos.z);

      // apply transforms
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;

    // update post processing uniforms
    if (!effectsRef.current) return;
    effectsRef.current.offset.x = Math.max(
      0
    );
    effectsRef.current.offset.y = Math.max(
      0
    );
  });

  return (
    <>
      <color args={["#0E1525"]} attach="background" />
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, COUNT]}
        matrixAutoUpdate
      >
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color={[1.2, 1.2, 1.2]}  toneMapped={false} />
      </instancedMesh>
      <EffectComposer>
        <Bloom luminanceThreshold={1} mipmapBlur />
        <ChromaticAberration
          ref={effectsRef}
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={
              new THREE.Vector2(
                  CHROMATIC_ABBERATION_OFFSET,
                  CHROMATIC_ABBERATION_OFFSET
                  )
                }
        />
      </EffectComposer>
    </>
  );
};

function generatePos() {
  return (Math.random() - 0.5) * XY_BOUNDS;
}

function getRandomRGBColor() {
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();

    return [r, g, b];
}
