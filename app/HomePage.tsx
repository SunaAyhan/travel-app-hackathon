"use client";

import { useEffect, useRef } from "react";
import "../styles/ThreeScene.css";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";

const ThreeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    // Set scene background to match CSS (very light pink)
    scene.background = new THREE.Color('#fff5f7');
    
    const camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0xfff5f7); // Light pink background

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const radii = [
        1,
        0.6,
        0.8,
        0.4,
        0.9,
        0.7,
        0.9,
        0.3,
        0.2,
        0.5,
        0.6,
        0.4,
        0.5,
        0.6,
        0.7,
        0.3,
        0.4,
        0.8,
        0.7,
        0.5,
        0.4,
        0.6,
        0.35,
        0.38,
        0.9,
      
        0.3,
        0.6,
        0.4,
        0.2,
        0.35,
        0.5,
        0.15,
        0.2,
        0.25,
        0.4,
        0.8,
        0.76,
        0.8,
        1,
        0.8,
        0.7,
        0.8,
        0.3,
        0.5,
        0.6,
        0.55,
        0.42,
        0.75,
        0.66,
        0.6,
        0.7,
        0.5,
        0.6,
        0.35,
        0.35,
        0.35,
        0.8,
        0.6,
        0.7,
        0.8,
        0.4,
        0.89,
        0.3,
      
        0.3,
        0.6,
        0.4,
        0.2,
        0.52,
        0.5,
        0.15,
        0.2,
        0.25,
        0.4,
        0.8,
        0.76,
        0.8,
        1,
        0.8,
        0.7,
        0.8,
        0.3,
        0.5,
        0.6,
        0.8,
        0.7,
        0.75,
        0.66,
        0.6,
        0.7,
        0.5,
        0.6,
        0.35,
        0.35,
        0.35,
        0.8,
        0.6,
        0.7,
        0.8,
        0.4,
        0.89,
        0.3
      ];
      const positions = [
        { x: 0, y: 0, z: 0 },
        { x: 1.2, y: 0.9, z: -0.5 },
        { x: 1.8, y: -0.3, z: 0 },
        { x: -1, y: -1, z: 0 },
        { x: -1, y: 1.62, z: 0 },
        { x: -1.65, y: 0, z: -0.4 },
        { x: -2.13, y: -1.54, z: -0.4 },
        { x: 0.8, y: 0.94, z: 0.3 },
        { x: 0.5, y: -1, z: 1.2 },
        { x: -0.16, y: -1.2, z: 0.9 },
        { x: 1.5, y: 1.2, z: 0.8 },
        { x: 0.5, y: -1.58, z: 1.4 },
        { x: -1.5, y: 1, z: 1.15 },
        { x: -1.5, y: -1.5, z: 0.99 },
        { x: -1.5, y: -1.5, z: -1.9 },
        { x: 1.85, y: 0.8, z: 0.05 },
        { x: 1.5, y: -1.2, z: -0.75 },
        { x: 0.9, y: -1.62, z: 0.22 },
        { x: 0.45, y: 2, z: 0.65 },
        { x: 2.5, y: 1.22, z: -0.2 },
        { x: 2.35, y: 0.7, z: 0.55 },
        { x: -1.8, y: -0.35, z: 0.85 },
        { x: -1.02, y: 0.2, z: 0.9 },
        { x: 0.2, y: 1, z: 1 },
        { x: -2.88, y: 0.7, z: 1 },
      
        { x: -2, y: -0.95, z: 1.5 },
        { x: -2.3, y: 2.4, z: -0.1 },
        { x: -2.5, y: 1.9, z: 1.2 },
        { x: -1.8, y: 0.37, z: 1.2 },
        { x: -2.4, y: 1.42, z: 0.05 },
        { x: -2.72, y: -0.9, z: 1.1 },
        { x: -1.8, y: -1.34, z: 1.67 },
        { x: -1.6, y: 1.66, z: 0.91 },
        { x: -2.8, y: 1.58, z: 1.69 },
        { x: -2.97, y: 2.3, z: 0.65 },
        { x: 1.1, y: -0.2, z: -1.45 },
        { x: -4, y: 1.78, z: 0.38 },
        { x: 0.12, y: 1.4, z: -1.29 },
        { x: -1.64, y: 1.4, z: -1.79 },
        { x: -3.5, y: -0.58, z: 0.1 },
        { x: -0.1, y: -1, z: -2 },
        { x: -4.5, y: 0.55, z: -0.5 },
        { x: -3.87, y: 0, z: 1 },
        { x: -4.6, y: -0.1, z: 0.65 },
        { x: -3, y: 1.5, z: -0.7 },
        { x: -0.5, y: 0.2, z: -1.5 },
        { x: -1.3, y: -0.45, z: -1.5 },
        { x: -3.35, y: 0.25, z: -1.5 },
        { x: -4.76, y: -1.26, z: 0.4 },
        { x: -4.32, y: 0.85, z: 1.4 },
        { x: -3.5, y: -1.82, z: 0.9 },
        { x: -3.6, y: -0.6, z: 1.46 },
        { x: -4.55, y: -1.5, z: 1.63 },
        { x: -3.8, y: -1.15, z: 2.1 },
        { x: -2.9, y: -0.25, z: 1.86 },
        { x: -2.2, y: -0.4, z: 1.86 },
        { x: -5.1, y: -0.24, z: 1.86 },
        { x: -5.27, y: 1.24, z: 0.76 },
        { x: -5.27, y: 2, z: -0.4 },
        { x: -6.4, y: 0.4, z: 1 },
        { x: -5.15, y: 0.95, z: 2 },
        { x: -6.2, y: 0.5, z: -0.8 },
        { x: -4, y: 0.08, z: 1.8 },
      
        { x: 2, y: -0.95, z: 1.5 },
        { x: 2.3, y: 2.4, z: -0.1 },
        { x: 2.5, y: 1.9, z: 1.2 },
        { x: 1.8, y: 0.37, z: 1.2 },
        { x: 3.24, y: 0.6, z: 1.05 },
        { x: 2.72, y: -0.9, z: 1.1 },
        { x: 1.8, y: -1.34, z: 1.67 },
        { x: 1.6, y: 1.99, z: 0.91 },
        { x: 2.8, y: 1.58, z: 1.69 },
        { x: 2.97, y: 2.3, z: 0.65 },
        { x: -1.3, y: -0.2, z: -2.5 },
        { x: 4, y: 1.78, z: 0.38 },
        { x: 1.72, y: 1.4, z: -1.29 },
        { x: 2.5, y: -1.2, z: -2 },
        { x: 3.5, y: -0.58, z: 0.1 },
        { x: 0.1, y: 0.4, z: -2.42 },
        { x: 4.5, y: 0.55, z: -0.5 },
        { x: 3.87, y: 0, z: 1 },
        { x: 4.6, y: -0.1, z: 0.65 },
        { x: 3, y: 1.5, z: -0.7 },
        { x: 2.3, y: 0.6, z: -2.6 },
        { x: 4, y: 1.5, z: -1.6 },
        { x: 3.35, y: 0.25, z: -1.5 },
        { x: 4.76, y: -1.26, z: 0.4 },
        { x: 4.32, y: 0.85, z: 1.4 },
        { x: 3.5, y: -1.82, z: 0.9 },
        { x: 3.6, y: -0.6, z: 1.46 },
        { x: 4.55, y: -1.5, z: 1.63 },
        { x: 3.8, y: -1.15, z: 2.1 },
        { x: 2.9, y: -0.25, z: 1.86 },
        { x: 2.2, y: -0.4, z: 1.86 },
        { x: 5.1, y: -0.24, z: 1.86 },
        { x: 5.27, y: 1.24, z: 0.76 },
        { x: 5.27, y: 2, z: -0.4 },
        { x: 6.4, y: 0.4, z: 1 },
        { x: 5.15, y: 0.95, z: 2 },
        { x: 6.2, y: 0.5, z: -0.8 },
        { x: 4, y: 0.08, z: 1.8 }
      ];

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff69b4'), 
      metalness: 0.1,
      roughness: 0.25,
      envMapIntensity: 1.2
    });

    // Create a slightly different material for hover effect
    const hoverMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff45a0'), 
      metalness: 0.2,
      roughness: 0.2,
      envMapIntensity: 1.4
    });

    const group = new THREE.Group();
    const spheres: THREE.Mesh[] = [];

    positions.forEach((pos, index) => {
      const radius = radii[index];
      const geometry = new THREE.SphereGeometry(radius, 64, 64);
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(pos.x, pos.y, pos.z);
      sphere.userData = { originalPosition: { ...pos }, radius };
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      spheres.push(sphere);
      group.add(sphere);
    });

    scene.add(group);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.25);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(10, 15, 15);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xffffff, 0.6);
    rim.position.set(-10, -5, -8);
    scene.add(rim);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tempVector = new THREE.Vector3();
    const forces = new Map<string, THREE.Vector3>();

    const initY = -25;
    const revolutionRadius = 4;
    const revolutionDuration = 2;
    const breathingAmplitude = 0.1;
    const breathingSpeed = 0.002;

    spheres.forEach((sphere) => {
      sphere.position.y = initY;
    });

    const initLoadingAnimation = (): void => {
      spheres.forEach((sphere, i) => {
        const delay = i * 0.02;

        gsap
          .timeline()
          .to(sphere.position, {
            duration: revolutionDuration / 2,
            y: revolutionRadius,
            ease: "power1.out",
            onUpdate: function () {
              const progress = this.progress();
              sphere.position.z =
                sphere.userData.originalPosition.z +
                Math.sin(progress * Math.PI) * revolutionRadius;
            },
            delay
          })
          .to(sphere.position, {
            duration: revolutionDuration / 2,
            y: initY / 5,
            ease: "power1.out",
            onUpdate: function () {
              const progress = this.progress();
              sphere.position.z =
                sphere.userData.originalPosition.z -
                Math.sin(progress * Math.PI) * revolutionRadius;
            }
          })
          .to(sphere.position, {
            duration: 0.6,
            x: sphere.userData.originalPosition.x,
            y: sphere.userData.originalPosition.y,
            z: sphere.userData.originalPosition.z,
            ease: "power1.out"
          });
      });
    };

    let loadingComplete = false;

    const xTo = gsap.quickTo(".circle", "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(".circle", "y", { duration: 0.6, ease: "power3" });
    const xFollow = gsap.quickTo(".circle-follow", "x", { duration: 0.6, ease: "power3" });
    const yFollow = gsap.quickTo(".circle-follow", "y", { duration: 0.6, ease: "power3" });

    gsap.set(".circle", { xPercent: -50, yPercent: -50 });
    gsap.set(".circle-follow", { xPercent: -50, yPercent: -50 });

    const onMouseMove = (event: MouseEvent): void => {
      if (!loadingComplete) return;

      xTo(event.clientX);
      yTo(event.clientY);
      xFollow(event.clientX);
      yFollow(event.clientY);

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spheres);

      if (intersects.length > 0) {
        const hoveredSphere = intersects[0].object as THREE.Mesh;
        const force = new THREE.Vector3();
        force
          .subVectors(intersects[0].point, hoveredSphere.position)
          .normalize()
          .multiplyScalar(0.2);
        forces.set(hoveredSphere.uuid, force);

        // Change material on hover
        hoveredSphere.material = hoverMaterial;
      } else {
        // Reset material when not hovering
        spheres.forEach((sphere) => {
          sphere.material = material;
        });
      }
    };

    const handleCollisions = (): void => {
      for (let i = 0; i < spheres.length; i++) {
        const sphereA = spheres[i];
        const radiusA = sphereA.userData.radius;

        for (let j = i + 1; j < spheres.length; j++) {
          const sphereB = spheres[j];
          const radiusB = sphereB.userData.radius;

          const distance = sphereA.position.distanceTo(sphereB.position);
          const minDistance = (radiusA + radiusB) * 1.2;

          if (distance < minDistance) {
            tempVector.subVectors(sphereB.position, sphereA.position).normalize();
            const pushStrength = (minDistance - distance) * 0.4;
            sphereA.position.sub(tempVector.clone().multiplyScalar(pushStrength));
            sphereB.position.add(tempVector.clone().multiplyScalar(pushStrength));
          }
        }
      }
    };

    const animate = (): void => {
      requestAnimationFrame(animate);

      if (loadingComplete) {
        const time = Date.now() * breathingSpeed;
        spheres.forEach((sphere, i) => {
          const offset = i * 0.2;
          const breathingY = Math.sin(time + offset) * breathingAmplitude;
          const breathingZ = Math.cos(time + offset) * breathingAmplitude * 0.5;

          const force = forces.get(sphere.uuid);
          if (force) {
            sphere.position.add(force);
            force.multiplyScalar(0.95);
            if (force.length() < 0.01) forces.delete(sphere.uuid);
          }

          const originalPos = sphere.userData.originalPosition;
          tempVector.set(
            originalPos.x,
            originalPos.y + breathingY,
            originalPos.z + breathingZ
          );
          sphere.position.lerp(tempVector, 0.018);
        });

        handleCollisions();
      }

      controls.update();
      renderer.render(scene, camera);
    };

    initLoadingAnimation();

    // Use display:none instead of just opacity:0 to completely hide elements initially
    const hiddenElements = document.querySelectorAll<HTMLElement>(".hide-text");
    hiddenElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.display = "none"; // Completely hide the element initially
    });

    // Create animated main text
    const mainText = document.createElement("div");
    mainText.className = "main-txt auto-animate";
    
    // Split text into characters and create animated elements for each
    const titleText = "TravelBuddy";
    titleText.split('').forEach((char, index) => {
      const letterWrapper = document.createElement("div");
      letterWrapper.className = "letter-wrapper";
      
      const letter = document.createElement("div");
      letter.className = "letter";
      letter.textContent = char;
      letter.style.setProperty('--index', index.toString());
      
      const shadow = document.createElement("div");
      shadow.className = "shadow";
      shadow.textContent = char;
      shadow.style.setProperty('--index', index.toString());
      
      letterWrapper.appendChild(letter);
      letterWrapper.appendChild(shadow);
      mainText.appendChild(letterWrapper);
    });
    
    document.body.appendChild(mainText);

    setTimeout(() => {
      loadingComplete = true;
      
      // Fade out the main text after animation completes
      setTimeout(() => {
        mainText.style.opacity = "0";
        
        // Delay showing the welcome box until after the main text fades
        setTimeout(() => {
          // First make elements display:block but still opacity:0
          hiddenElements.forEach((el) => {
            el.style.display = "block"; // Make the element part of the layout again
            
            // Force a reflow before changing opacity for proper transition
            void el.offsetWidth;
            
            // Now transition to visible
            setTimeout(() => {
              el.style.opacity = "1";
            }, 50);
          });
          
          // Remove the main text from DOM
          setTimeout(() => {
            if (mainText.parentNode) {
              mainText.parentNode.removeChild(mainText);
            }
          }, 500);
        }, 1000); // Additional delay before showing welcome box
        
      }, 3000); // Wait for animations to complete
    }, (revolutionDuration + 1) * 1000);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", () => {});
      if (mainText && mainText.parentNode) mainText.parentNode.removeChild(mainText);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" id="webgl" />;
};

export default ThreeScene;
