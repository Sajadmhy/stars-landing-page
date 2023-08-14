"use client"
import { useState, useRef, useEffect, use } from "react"
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Text } from "@react-three/drei";

export default function Home() {
  const [scroll, setScroll] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [velocity, setVelocity] = useState(0)
  const [width, setWidth] = useState(false);

  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      setScroll(window.scrollY)
      setOpacity(1 - (window.scrollY / 500))
      setZoom(1 + (window.scrollY / 500))
      setVelocity(window.scrollY / 5000)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scroll])

  return (
    <div>
      <div className="fixed w-screen h-screen" >
        <Canvas
        camera={{
          fov: 100,
          near: 0.1,
          far: 200,
          // position: [15, 5, 5],
        }}
        >
        { width &&
          <Text
          fontSize={width/1000}
          scale={zoom}
          fillOpacity={opacity > 0 ? opacity : 0}
          >
            Let&apos;s make something great.
          </Text>
          }
          <Scene velocity={velocity} />
        </Canvas>
      </div>
      <div className="h-screen">
      </div>
      <div className="h-screen">
      </div>
    </div>
  )
}

