import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setupModel } from '$lib/components/Scene/components/setupModel';
import { Group } from 'three';

async function loadSpaceship() {
	const loader = new GLTFLoader();

	const [spaceshipRightData, spaceshipLeftData] = await Promise.all([
		loader.loadAsync('/models/spaceship.glb'),
		loader.loadAsync('/models/spaceship.glb')
	]);

	const spaceshipRight = setupModel(spaceshipRightData);
	spaceshipRight.position.set(0, 0, 0);
	spaceshipRight.rotation.set(0, 0, 0);

	spaceshipRight.position.set(10, 0, 0);
	spaceshipRight.rotation.z = -Math.PI / 10;

	const spaceshipLeft = setupModel(spaceshipLeftData);
	spaceshipLeft.position.set(0, 0, 0);
	spaceshipLeft.rotation.set(0, 0, 0);

	spaceshipLeft.position.set(-10, 0, 0);
	spaceshipLeft.rotation.z = Math.PI / 10;

	const spaceship = new Group();
	spaceship.add(spaceshipLeft);
	spaceship.add(spaceshipRight);
	spaceship.rotation.x = -Math.PI / 2;

	return {
		spaceship
	};
}

export { loadSpaceship };
