import { WebGLRenderer } from 'three';

function createRenderer(canvas: HTMLCanvasElement) {
	// canvas - A canvas where the renderer draws its output.
	// This corresponds to the domElement property below.
	// If not passed in here, a new canvas element will be created.
	const renderer = new WebGLRenderer({
		canvas: canvas,
		antialias: true,
		alpha: true
	});

	renderer.physicallyCorrectLights = true;

	return renderer;
}

export { createRenderer, type WebGLRenderer };
