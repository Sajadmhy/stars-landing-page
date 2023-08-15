"use client"
import { useState, useRef, useEffect, use } from "react"
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Html, Text } from "@react-three/drei";

export default function Home() {
  const [scroll, setScroll] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [velocity, setVelocity] = useState(0)

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

  // when reached the end of the page redirect to the next page
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
          window.location.replace("https://sajadm.me")
        }, 1500)
      }
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
          <Html transform={[0,0,0]}>
            <div>
              <p style={{opacity: opacity, scale: zoom}} className="text-white lg:text-5xl md:text-2xl w-screen text-center">Let&apos;s make something great.</p>
              <div style={{opacity: opacity}} className="mouse_scroll">
                <div className="mouse">
                  <div className="wheel"></div>
                </div>
                <div>
                  <span className="m_scroll_arrows unu"></span>
                  <span className="m_scroll_arrows doi"></span>
                  <span className="m_scroll_arrows trei"></span>
                </div>
              </div>
            </div>
          </Html>
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

