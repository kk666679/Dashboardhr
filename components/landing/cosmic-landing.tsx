"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, CalendarDays } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

export default function CosmicLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const diskMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const auraMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const frameRef = useRef<number>(0);
  const camControl = useRef({ distance: 85 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── scene setup ──
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(60, 30, 60);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.setClearColor(0x010103);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controlsRef.current = controls;

    // ── noise chunk ──
    const noiseChunk = `
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 = v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }
    `;

    // ── black hole core ──
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bhGeo = new THREE.SphereGeometry(4, 64, 64);
    coreGroup.add(new THREE.Mesh(bhGeo, bhMat));

    const auraMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uIntensity: { value: 1.0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vView = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 4.0);
          gl_FragColor = vec4(vec3(1.0, 0.45, 0.1) * rim * uIntensity * 5.0, 1.0);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    auraMaterialRef.current = auraMat;
    coreGroup.add(new THREE.Mesh(new THREE.SphereGeometry(4.25, 64, 64), auraMat));

    // ── accretion disk ──
    const instanceCount = 5000;
    const streakGeo = new THREE.CylinderGeometry(0.01, 0.12, 2.2, 3);
    streakGeo.rotateX(Math.PI / 2);

    const diskMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0.1 },
        uCompression: { value: 1.0 },
        uIntensity: { value: 1.0 },
        uOrbitScale: { value: 1.0 },
      },
      vertexShader: `
        ${noiseChunk}
        uniform float uTime;
        uniform float uMorph;
        uniform float uCompression;
        uniform float uIntensity;
        uniform float uOrbitScale;
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float rOriginal = length(instPos.xz);
          float r = rOriginal * uCompression;
          float initialAngle = atan(instPos.z, instPos.x);
          float orbitalVelocity = (1.5 / sqrt(rOriginal)) * uOrbitScale;
          float currentAngle = initialAngle + (uTime * orbitalVelocity);
          vec3 morphedWorldPos = vec3(cos(currentAngle) * r, instPos.y, sin(currentAngle) * r);
          float noise = snoise(vec3(morphedWorldPos.x * 0.08, morphedWorldPos.z * 0.08, uTime * 0.3));
          morphedWorldPos.y += noise * uMorph * 4.0;
          vec3 viewDir = normalize(cameraPosition - morphedWorldPos);
          vec3 orbitDir = normalize(vec3(-sin(currentAngle), 0.0, cos(currentAngle)));
          float doppler = dot(orbitDir, viewDir);
          vec3 hot = vec3(1.0, 0.95, 0.9);
          vec3 warm = vec3(1.0, 0.45, 0.1);
          vec3 cool = vec3(0.1, 0.35, 1.0);
          vec3 color = mix(cool, warm, smoothstep(45.0, 12.0, r));
          color = mix(color, hot, smoothstep(10.0, 4.0, r));
          vColor = color * (1.3 + doppler * 0.7) * uIntensity;
          vOpacity = (smoothstep(3.8, 5.5, r) * (1.0 - smoothstep(38.0, 48.0, r))) * 0.8;
          float deltaAngle = currentAngle - initialAngle;
          float c = cos(deltaAngle);
          float s = sin(deltaAngle);
          mat3 rotY = mat3(
            c, 0, s,
            0, 1, 0,
            -s, 0, c
          );
          vec3 localPos = (instanceMatrix * vec4(position, 0.0)).xyz;
          vec3 rotatedLocalPos = rotY * localPos;
          gl_Position = projectionMatrix * viewMatrix * vec4(morphedWorldPos + rotatedLocalPos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          gl_FragColor = vec4(vColor, vOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    diskMaterialRef.current = diskMat;

    const instancedDisk = new THREE.InstancedMesh(streakGeo, diskMat, instanceCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < instanceCount; i++) {
      const r = 5 + Math.pow(Math.random(), 1.3) * 40;
      const angle = Math.random() * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * (8 / r), Math.sin(angle) * r);
      dummy.lookAt(dummy.position.x + Math.sin(angle), dummy.position.y, dummy.position.z - Math.cos(angle));
      dummy.updateMatrix();
      instancedDisk.setMatrixAt(i, dummy.matrix);
    }
    instancedDisk.instanceMatrix.needsUpdate = true;
    scene.add(instancedDisk);

    // ── starfield ──
    const starCount = 3000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 150 + Math.random() * 350;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xaaccff,
      size: 0.6,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── transition config ──
    const configs = [
      { morph: 0.1, compress: 1.0, intensity: 1.0, rotate: 0.4, camY: 25, camDist: 85, orbit: 1.0 },
      { morph: 4.5, compress: 1.15, intensity: 1.4, rotate: 1.5, camY: 45, camDist: 95, orbit: 1.8 },
      { morph: 0.8, compress: 0.38, intensity: 3.5, rotate: 5.0, camY: 12, camDist: 55, orbit: 4.5 },
    ];
    let stateIdx = 0;

    function transition() {
      stateIdx = (stateIdx + 1) % configs.length;
      const s = configs[stateIdx];
      const tl = gsap.timeline({ defaults: { duration: 4.0, ease: "power2.inOut" } });
      tl.to(diskMat.uniforms.uMorph, { value: s.morph }, 0);
      tl.to(diskMat.uniforms.uCompression, { value: s.compress }, 0);
      tl.to(diskMat.uniforms.uIntensity, { value: s.intensity }, 0);
      tl.to(diskMat.uniforms.uOrbitScale, { value: s.orbit }, 0);
      tl.to(auraMat.uniforms.uIntensity, { value: s.intensity }, 0);
      tl.to(controls, { autoRotateSpeed: s.rotate }, 0);
      tl.to(camera.position, { y: s.camY }, 0);
      tl.to(camControl.current, { distance: s.camDist }, 0);
    }
    const interval = setInterval(transition, 10000);

    // ── animation loop ──
    const clock = new THREE.Clock();

    function animate() {
      const time = clock.getElapsedTime();
      diskMat.uniforms.uTime.value = time;
      auraMat.uniforms.uTime.value = time;
      instancedDisk.rotation.y += 0.0005;
      stars.rotation.y += 0.00008;

      const currentDir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      camera.position.x = controls.target.x + currentDir.x * camControl.current.distance;
      camera.position.z = controls.target.z + currentDir.z * camControl.current.distance;

      controls.update();
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    }
    animate();

    // ── resize ──
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ── cleanup ──
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #071827 0%, #10233b 45%, #0a1627 100%)",
      }}
    >
      {/* Three.js container - full background */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Hero overlay — value prop first, canvas as background */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(52,152,219,0.16),transparent_42%),linear-gradient(180deg,rgba(7,24,39,0.3),rgba(7,24,39,0.7))]" />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none">

        {/* Logo + brand */}
        <div className="float-glow-title pointer-events-auto flex flex-col items-center gap-3 mb-6">
          <Image
            src="/logo.svg"
            alt="AiFWMS logo"
            priority
            width={72}
            height={72}
            style={{
              width: "clamp(44px, 8vw, 72px)",
              height: "auto",
              filter: "drop-shadow(0 0 18px rgba(125,211,252,0.4))",
            }}
          />
          <span
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "clamp(10px, 1.4vw, 13px)",
              letterSpacing: "0.28em",
              color: "rgba(125,211,252,0.7)",
              textTransform: "uppercase",
            }}
          >
            AiFWMS by Chemmara Enterprise
          </span>
        </div>

        {/* Primary headline */}
        <h1
          className="font-black text-center pointer-events-auto"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(20px, 5vw, 48px)",
            lineHeight: 1.15,
            color: "#f8fafc",
            textShadow: "0 10px 30px rgba(2, 10, 22, 0.45)",
            maxWidth: "860px",
          }}
        >
          <span className="text-white">Unify work. Empower people.</span>{" "}
          <span style={{ color: "#f5b041" }}>Reduce costs.</span>{" "}
          <span className="text-white">Move faster.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="mt-5 pointer-events-auto"
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "clamp(13px, 1.8vw, 18px)",
            color: "#ecf0f1",
            maxWidth: "560px",
            lineHeight: 1.6,
          }}
        >
          Malaysia&apos;s enterprise HR &amp; foreign worker & expatriate platform.
        </p>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-10 fade-in-up pointer-events-auto">
          <Button
            asChild
            size="lg"
            className="bg-[#e67e22] text-white font-bold text-base shadow-[0_16px_40px_rgba(230,126,34,0.28)] hover:bg-[#cf6413] hover:scale-105 transition-all duration-300 px-8 py-6 border-0 min-w-[180px]"
          >
            <Link href="/dashboard">
              <Zap className="w-5 h-5 mr-2" />
              Request a demo
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#3498db]/45 text-[#ecf0f1] bg-[#3498db]/12 backdrop-blur-sm hover:bg-[#3498db]/20 hover:scale-105 transition-all duration-300 px-8 py-6 text-base min-w-[180px]"
          >
            <Link href="/employees/onboarding">
              <CalendarDays className="w-5 h-5 mr-2" />
              See onboarding workflow
            </Link>
          </Button>
        </div>

        {/* Social proof */}
        <p
          className="mt-6 pointer-events-auto"
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "clamp(10px, 1.2vw, 12px)",
            color: "rgba(236,240,241,0.8)",
            letterSpacing: "0.05em",
          }}
        >
          Trusted by manufacturers, plantations &amp; construction firms across Malaysia
        </p>
      </div>

      {/* Hint badge - keep as before */}
      <div
        className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[92vw] whitespace-nowrap rounded-full border px-3 py-[6px] backdrop-blur-sm"
        style={{
          fontFamily: "'Exo 2', monospace",
          fontSize: "clamp(8px, 1.5vw, 10px)",
          letterSpacing: "0.18rem",
          background: "rgba(0,0,0,0.4)",
          color: "rgba(125,211,252,0.7)",
          borderColor: "rgba(125,211,252,0.2)",
        }}
      >
        ✦ MOVE MOUSE • CLICK FOR COMETS ✦
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Exo+2:wght@300;400&display=swap');
        .float-glow-title {
          animation: floatGlow 8s ease-in-out infinite;
        }
        .float-glow-button {
          animation: floatGlow 4s ease-in-out infinite;
        }
        @keyframes floatGlow {
          0%,100% { transform: translateY(0); filter: drop-shadow(0 0 8px rgba(125,211,252,0.3)); }
          50% { transform: translateY(-8px); filter: drop-shadow(0 0 28px rgba(125,211,252,0.6)); }
        }
        @keyframes shimmerText {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .fade-in-up {
          animation: fadeInUp 1s ease-out 0.5s forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}