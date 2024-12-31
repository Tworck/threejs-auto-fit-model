import { PerspectiveCamera } from 'three';

function createCamera() {
	const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	camera.position.set(-7.7937201719716365, 14.201994926365902, 21.849473684833413);
	camera.rotation.order = 'XYZ';

	return camera;
}

export { createCamera, type PerspectiveCamera };
