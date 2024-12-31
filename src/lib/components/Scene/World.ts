import { loadSpaceship } from '$lib/components/Scene/components/spaceship';
import { createCamera } from '$lib/components/Scene/components/camera';
import type { PerspectiveCamera } from '$lib/components/Scene/components/camera';
import { createLights } from '$lib/components/Scene/components/lights';
import { createScene } from '$lib/components/Scene/components/scene';
import type { Scene } from '$lib/components/Scene/components/scene';

import { createRenderer } from '$lib/components/Scene/systems/renderer';
import type { WebGLRenderer } from '$lib/components/Scene/systems/renderer';
import { Resizer } from '$lib/components/Scene/systems/Resizer';
import { Loop } from '$lib/components/Scene/systems/Loop';
import { createCameraControls } from '$lib/components/Scene/systems/cameraControls';
import type { CameraControls } from '$lib/components/Scene/systems/cameraControls';
import { AxesHelper } from 'three';

let camera: PerspectiveCamera;
let renderer: WebGLRenderer;
let scene: Scene;
let loop: Loop;
let cameraControls: CameraControls;

class World {
	private container: HTMLDivElement;

	constructor(container: HTMLDivElement, canvas: HTMLCanvasElement) {
		this.container = container;
		camera = createCamera();
		renderer = createRenderer(canvas);
		scene = createScene();
		loop = new Loop(camera, scene, renderer);
		cameraControls = createCameraControls(camera, canvas);
		const axesHelper = new AxesHelper(50);
		scene.add(axesHelper);

		const { ambientLight, mainLight } = createLights();

		loop.updatables.push(cameraControls);
		scene.add(ambientLight, mainLight);
	}

	async init(canvas: HTMLCanvasElement) {
		const { spaceship } = await loadSpaceship();

		scene.add(spaceship);
		//this.render() is required, as otherwise the "envelope" for the
		// helperSphere does not have the correct size. The objects have
		// not yet been placed in 3d, are overlapping and thus the
		// "zoom"/camera position will not be adequate.
		this.render();

		const resizer = new Resizer(
			this.container,
			camera,
			renderer,
			canvas,
			cameraControls,
			spaceship
		);
	}

	render() {
		renderer.render(scene, camera);
	}

	start() {
		loop.start();
	}

	stop() {
		loop.stop();
	}
}

export { World };
