"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Real 3D jack plug, take three. Two things were actually wrong before,
// now fixed against the actual reference photo:
//
// 1. Colors were backwards. The knurled grip section on a real 1/4" jack
//    is BLACK, not gold — it's the long shaft below it that's gold. Swapped
//    the materials to match.
// 2. Proportions read as a rounded blob ("looks like a buttplug") because
//    the grip-to-shaft transition wasn't a real step down and the shaft
//    was too short relative to the grip. Verified the actual profile as a
//    2D cross-section plot before rebuilding the 3D geometry from it —
//    wide short grip, a real step down, then a long tapered gold shaft to
//    a rounded tip, matching the photo's silhouette.
export default function JackPlug3D({ size = 60 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = size;
    const height = size * 2.75;
    const aspect = width / height;

    const OBJECT_HEIGHT = 9;
    const GRIP_RADIUS = 1.5;
    const SHAFT_RADIUS = 1.15;

    const scene = new THREE.Scene();

    const viewHeight = OBJECT_HEIGHT * 1.35;
    const viewWidth = viewHeight * aspect;
    const camera = new THREE.OrthographicCamera(
      -viewWidth / 2,
      viewWidth / 2,
      viewHeight / 2,
      -viewHeight / 2,
      0.1,
      100
    );
    camera.position.set(2.2, 0.4, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x151617,
      metalness: 0.3,
      roughness: 0.55,
    });
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6ad42,
      metalness: 0.8,
      roughness: 0.26,
    });
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xff2e3e,
      metalness: 0.1,
      roughness: 0.5,
    });

    const group = new THREE.Group();

    const gripTop = OBJECT_HEIGHT;
    const gripBottom = OBJECT_HEIGHT * 0.68;
    const shaftTop = gripBottom;
    const shaftBottom = OBJECT_HEIGHT * 0.14;

    // gold shaft — long smooth taper down to a rounded tip
    const shaftPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(SHAFT_RADIUS * 0.4, 0.15),
      new THREE.Vector2(SHAFT_RADIUS * 0.8, 0.5),
      new THREE.Vector2(SHAFT_RADIUS, 1.0),
      new THREE.Vector2(SHAFT_RADIUS, shaftTop),
    ];
    const shaftGeo = new THREE.LatheGeometry(shaftPoints, 40);
    const shaft = new THREE.Mesh(shaftGeo, goldMaterial);
    group.add(shaft);

    // thin red insulator ring at the step-down point
    const ringGeo = new THREE.CylinderGeometry(SHAFT_RADIUS * 1.05, GRIP_RADIUS, 0.35, 40);
    const ring = new THREE.Mesh(ringGeo, ringMaterial);
    ring.position.y = shaftTop + 0.12;
    group.add(ring);

    // black knurled grip — wider than the shaft, real step down, ridges
    // built into the geometry
    const gripPoints: THREE.Vector2[] = [new THREE.Vector2(GRIP_RADIUS, gripBottom)];
    const ridgeCount = 6;
    for (let i = 0; i <= ridgeCount; i++) {
      const y = gripBottom + ((gripTop - gripBottom) * i) / ridgeCount;
      gripPoints.push(new THREE.Vector2(GRIP_RADIUS, y));
      if (i < ridgeCount) {
        gripPoints.push(
          new THREE.Vector2(GRIP_RADIUS * 0.85, y + (gripTop - gripBottom) / ridgeCount / 2)
        );
      }
    }
    gripPoints.push(new THREE.Vector2(GRIP_RADIUS, gripTop));
    gripPoints.push(new THREE.Vector2(0, gripTop)); // flat top cap
    const gripGeo = new THREE.LatheGeometry(gripPoints, 40);
    const grip = new THREE.Mesh(gripGeo, blackMaterial);
    group.add(grip);

    group.position.y = -OBJECT_HEIGHT / 2;
    scene.add(group);

    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(3, 3, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffd9a0, 1.6);
    fill.position.set(-4, 1, 3);
    scene.add(fill);

    const rim = new THREE.PointLight(0xff2e3e, 1.4, 30);
    rim.position.set(-1, -3, -3);
    scene.add(rim);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
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
      shaftGeo.dispose();
      gripGeo.dispose();
      ringGeo.dispose();
      blackMaterial.dispose();
      goldMaterial.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [size]);

  return <div ref={containerRef} style={{ width: size, height: size * 2.75 }} />;
}
