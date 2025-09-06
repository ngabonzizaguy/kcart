// Lightweight Three.js background with soft floating blobs.
// Keeps GPU/CPU usage low for mobile.

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  const blobMaterial = new THREE.MeshStandardMaterial({ color: 0x6ec1e4, metalness: 0.2, roughness: 0.8, transparent: true, opacity: 0.25 });
  const geo = new THREE.IcosahedronGeometry(1.2, 2);
  const blobs = [];
  for (let i = 0; i < 3; i++) {
    const mesh = new THREE.Mesh(geo, blobMaterial.clone());
    mesh.material.color.setHSL(0.55 + i * 0.1, 0.6, 0.6);
    mesh.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3, -i * 1.5);
    scene.add(mesh);
    blobs.push(mesh);
  }

  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(2, 3, 4);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  function onResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);
  onResize();

  let t = 0;
  function animate() {
    t += 0.005;
    blobs.forEach((m, i) => {
      m.rotation.x += 0.002 + i * 0.001;
      m.rotation.y += 0.003 + i * 0.001;
      m.position.y = Math.sin(t + i) * 0.3 + (i - 1) * 0.5;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

