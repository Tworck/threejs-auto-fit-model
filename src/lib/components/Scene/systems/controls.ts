import type { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls(camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
	const controls = new OrbitControls(camera, canvas);

	controls.enableDamping = true;

	// forward controls.update to our custom .tick method
	controls.tick = () => controls.update();

	return controls;
}

export { createControls, type OrbitControls };
