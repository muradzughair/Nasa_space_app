// Stands in for the old project's app/vendor/three-bundle.js: Three.js r160 with OrbitControls, GLTFLoader and MeshoptDecoder on one
// namespace, so the ported modules keep `import * as THREE from ...` and every THREE.X they use. Same revision (r160) as the vendored bundle.
export * from 'three';
export { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
export { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
