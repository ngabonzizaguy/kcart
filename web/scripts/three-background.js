// Subtle floating 3D background using Three.js
// Creates a few translucent spheres with slow parallax motion

export function initThreeBackground(canvasId = 'bg3d') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 8);

  const light = new THREE.DirectionalLight(0xffffff, 0.6);
  light.position.set(2, 2, 4);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const spheres = [];
  const palette = [0xefa7a7, 0xffd972, 0xc7eae4, 0xa7e8bd, 0xfcbcb8, 0xbad6ff];
  const geometries = [
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.TetrahedronGeometry(0.9, 0),
    new THREE.IcosahedronGeometry(0.9, 0),
  ];
  for (let i = 0; i < 8; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: palette[i % palette.length],
      roughness: 0.35,
      metalness: 0.25,
      transparent: true,
      opacity: 0.38,
    });
    const geometry = geometries[i % geometries.length];
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
    mesh.scale.setScalar(0.8 + Math.random() * 0.9);
    scene.add(mesh);
    spheres.push(mesh);
  }

  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  let t = 0;
  function animate() {
    t += 0.003;
    spheres.forEach((s, idx) => {
      s.rotation.x += 0.002 + idx * 0.00025;
      s.rotation.y -= 0.0015 + idx * 0.0002;
      s.position.y += Math.sin(t * 1.2 + idx) * 0.003;
      s.position.x += Math.cos(t * 0.8 + idx) * 0.0015;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  return { renderer, scene, camera };
}
