"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// A real 3D jack plug built from primitive geometry — no model file needed,
// since the shape is simple and fully rotationally symmetric. Two lathe
// geometries (smooth tip section + knurled grip section, the knurling
// built right into the profile as radius variation so real light actually
// catches each ridge) plus a separate thin cylinder for the dark
// insulator ring between them. Gold PBR material with three lights
// standing in for a small studio setup — a metal like this reads as
// "real" almost entirely through its highlights, which a flat icon can't
// reproduce no matter how carefully the gradient is tuned.
export default function JackPlug3D({ size = 60 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = size;
    const height = size * 2.75;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(2.6, 0.6, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xcda43a,
      metalness: 0.8,
      roughness: 0.28,
    });
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c0d0e,
      metalness: 0.2,
      roughness: 0.6,
    });

    const group = new THREE.Group();

    // smooth tip section, rounded cap at the very bottom
    const tipPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.32, 0.05),
      new THREE.Vector2(0.62, 0.22),
      new THREE.Vector2(0.82, 0.5),
      new THREE.Vector2(0.88, 1.0),
      new THREE.Vector2(0.88, 4.6),
    ];
    const tipGeo = new THREE.LatheGeometry(tipPoints, 32);
    const tip = new THREE.Mesh(tipGeo, goldMaterial);
    group.add(tip);

    // insulator ring
    const ringGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 32);
    const ring = new THREE.Mesh(ringGeo, ringMaterial);
    ring.position.y = 4.85;
    group.add(ring);

    // knurled grip — radius alternates to build real ridge geometry
    const gripPoints: THREE.Vector2[] = [new THREE.Vector2(0.88, 5.1)];
    const ridgeCount = 7;
    const gripTop = 9.6;
    const gripBottom = 5.1;
    for (let i = 0; i <= ridgeCount; i++) {
      const y = gripBottom + ((gripTop - gripBottom) * i) / ridgeCount;
      gripPoints.push(new THREE.Vector2(0.88, y));
      if (i < ridgeCount) {
        gripPoints.push(new THREE.Vector2(0.72, y + (gripTop - gripBottom) / ridgeCount / 2));
      }
    }
    gripPoints.push(new THREE.Vector2(0.88, gripTop));
    gripPoints.push(new THREE.Vector2(0, gripTop)); // flat top cap
    const gripGeo = new THREE.LatheGeometry(gripPoints, 32);
    const grip = new THREE.Mesh(gripGeo, goldMaterial);
    group.add(grip);

    group.position.y = -4.5;
    scene.add(group);

    // lighting — a small studio setup, not a flat single light
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3, 4, 5);
    scene.add(key);

    const fill = new THREE.PointLight(0xffd9a0, 1.1, 30);
    fill.position.set(-3, 1, 3);
    scene.add(fill);

    const rim = new THREE.PointLight(0xff2e3e, 1.4, 30);
    rim.position.set(0, -3, -4);
    scene.add(rim);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    let rafId = 0;
    function animate() {
      group.rotation.y += 0.012;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      tipGeo.dispose();
      gripGeo.dispose();
      ringGeo.dispose();
      goldMaterial.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [size]);

  return <div ref={containerRef} style={{ width: size, height: size * 2.75 }} />;
}
