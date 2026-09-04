"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Real 3D jack plug, take two. The shape logic is the same idea as before
// (lathe-revolved gold body, separate dark insulator ring, knurled ridges
// built into the geometry itself) but two real bugs are fixed here:
//
// 1. Camera framing was wrong by a lot. The object is ~9 units tall, but
//    the perspective camera's distance and field of view only showed
//    about 3.5 units of vertical space — meaning most of the object was
//    cropped off-screen and what little showed was a tiny, unrecognizable
//    sliver. Switched to an orthographic camera specifically because its
//    framing is simple, fixed math (a view box you set directly) instead
//    of distance/FOV trigonometry that's easy to get wrong blind.
// 2. Proportions were too elongated (~5.5:1 height-to-diameter) for a
//    real 1/4" jack, which is closer to ~2.8:1. Rebuilt at more realistic
//    proportions.
//
// Lighting is also brighter overall and includes a stronger ambient
// floor, since the previous version rendered too dark to read clearly.
export default function JackPlug3D({ size = 60 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = size;
    const height = size * 2.75;
    const aspect = width / height;

    const OBJECT_HEIGHT = 9;
    const OBJECT_RADIUS = 1.6;

    const scene = new THREE.Scene();

    // orthographic: screen size depends only on this view box, not on
    // camera distance — verifiable by hand instead of guessed
    const viewHeight = OBJECT_HEIGHT * 1.35; // margin around the object
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

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6ad42,
      metalness: 0.75,
      roughness: 0.3,
    });
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c0d0e,
      metalness: 0.2,
      roughness: 0.6,
    });

    const group = new THREE.Group();

    const tipTop = OBJECT_HEIGHT * 0.47;
    const ringHeight = OBJECT_HEIGHT * 0.06;
    const gripTop = OBJECT_HEIGHT;
    const gripBottom = tipTop + ringHeight;

    // smooth tip section, rounded cap at the very bottom
    const tipPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(OBJECT_RADIUS * 0.32, tipTop * 0.01),
      new THREE.Vector2(OBJECT_RADIUS * 0.62, tipTop * 0.05),
      new THREE.Vector2(OBJECT_RADIUS * 0.85, tipTop * 0.13),
      new THREE.Vector2(OBJECT_RADIUS, tipTop * 0.28),
      new THREE.Vector2(OBJECT_RADIUS, tipTop),
    ];
    const tipGeo = new THREE.LatheGeometry(tipPoints, 40);
    const tip = new THREE.Mesh(tipGeo, goldMaterial);
    group.add(tip);

    // insulator ring
    const ringGeo = new THREE.CylinderGeometry(
      OBJECT_RADIUS * 1.02,
      OBJECT_RADIUS * 1.02,
      ringHeight,
      40
    );
    const ring = new THREE.Mesh(ringGeo, ringMaterial);
    ring.position.y = tipTop + ringHeight / 2;
    group.add(ring);

    // knurled grip — radius alternates to build real ridge geometry
    const gripPoints: THREE.Vector2[] = [new THREE.Vector2(OBJECT_RADIUS, gripBottom)];
    const ridgeCount = 6;
    for (let i = 0; i <= ridgeCount; i++) {
      const y = gripBottom + ((gripTop - gripBottom) * i) / ridgeCount;
      gripPoints.push(new THREE.Vector2(OBJECT_RADIUS, y));
      if (i < ridgeCount) {
        gripPoints.push(
          new THREE.Vector2(
            OBJECT_RADIUS * 0.84,
            y + (gripTop - gripBottom) / ridgeCount / 2
          )
        );
      }
    }
    gripPoints.push(new THREE.Vector2(OBJECT_RADIUS, gripTop));
    gripPoints.push(new THREE.Vector2(0, gripTop)); // flat top cap
    const gripGeo = new THREE.LatheGeometry(gripPoints, 40);
    const grip = new THREE.Mesh(gripGeo, goldMaterial);
    group.add(grip);

    // center the whole object on the world origin, which is what the
    // camera is looking at
    group.position.y = -OBJECT_HEIGHT / 2;
    scene.add(group);

    // lighting — brighter overall than the last version, with a real
    // ambient floor so no angle of the rotation goes too dark
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(3, 3, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffd9a0, 1.6);
    fill.position.set(-4, 1, 3);
    scene.add(fill);

    const rim = new THREE.PointLight(0xff2e3e, 2, 30);
    rim.position.set(-1, -3, -3);
    scene.add(rim);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
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
