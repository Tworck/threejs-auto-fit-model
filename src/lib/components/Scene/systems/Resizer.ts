import type { Object3D, PerspectiveCamera, WebGLRenderer } from 'three';
import { fitToObject } from './cameraControls';
import type { CameraControls } from '$lib/components/Scene/systems/cameraControls';

const setSize = (
	container: HTMLDivElement,
	camera: PerspectiveCamera,
	renderer: WebGLRenderer,
	canvas: HTMLCanvasElement,
	cameraControls: CameraControls,
	object: Object3D
) => {
	camera.aspect = container.clientWidth / container.clientHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	fitToObject(object, cameraControls, canvas, true);
};

class Resizer {
	constructor(
		container: HTMLDivElement,
		camera: PerspectiveCamera,
		renderer: WebGLRenderer,
		canvas: HTMLCanvasElement,
		cameraControls: CameraControls,
		object: Object3D
	) {
		// set initial size
		setSize(container, camera, renderer, canvas, cameraControls, object);

		window.addEventListener('resize', () => {
			// set the size again if a resize occurs
			setSize(container, camera, renderer, canvas, cameraControls, object);
			// perform any custom actions
			this.onResize();
		});
	}

	onResize() {}
}

export { Resizer };
