import {
	PerspectiveCamera,
	Mesh,
	SphereGeometry,
	Object3D,
	MeshBasicMaterial,
	Box2,
	BoxGeometry
} from 'three';
import CameraControls from 'camera-controls';
import {
	Box3,
	Matrix4,
	Quaternion,
	Raycaster,
	Sphere,
	Spherical,
	Vector2,
	Vector3,
	Vector4
} from 'three';
const subsetOfTHREE = {
	Vector2,
	Vector3,
	Vector4,
	Quaternion,
	Matrix4,
	Spherical,
	Box3,
	Sphere,
	Raycaster
};
let installed = false;

// Exclusive control for user dragging
let userDragging = false;
let autoRotate = false;
let disableAutoRotate = false;
let total = 0;
let autoRotateSpeed = 0.05;
let sumDelta = 0;

function createCameraControls(camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
	if (!installed) {
		CameraControls.install({ THREE: subsetOfTHREE });
		installed = true;
	}
	const cameraControls = new CameraControls(camera, canvas);

	const onRest = () => {
		cameraControls.removeEventListener('rest', onRest);
		userDragging = false;
		disableAutoRotate = false;
	};

	cameraControls.addEventListener('controlstart', () => {
		cameraControls.removeEventListener('rest', onRest);
		userDragging = true;
		disableAutoRotate = true;
	});
	cameraControls.addEventListener('controlend', () => {
		if (cameraControls.active) {
			cameraControls.addEventListener('rest', onRest);
		} else {
			onRest();
		}
	});

	cameraControls.addEventListener('transitionstart', () => {
		if (userDragging) return;

		disableAutoRotate = true;
		cameraControls.addEventListener('rest', onRest);
	});

	// forward controls.update to our custom .tick method
	cameraControls.tick = (delta) => {
		if (autoRotate && !disableAutoRotate) {
			sumDelta += delta;
			let change = Math.sin(sumDelta * autoRotateSpeed) - total;
			total += change;
			cameraControls.azimuthAngle += change;
		}

		cameraControls.update(delta);
	};

	return cameraControls;
}

// for reference
// https://stackoverflow.com/questions/56210156/three-js-how-to-calculate-the-minimum-bounding-rectangle-of-an-object-in-a-came
const computeScreenSpaceBoundingBox = (function () {
	const vertex = new Vector3();
	const min = new Vector3(1, 1, 1);
	const max = new Vector3(-1, -1, -1);
	return function computeScreenSpaceBoundingBox(box: Box2, mesh: Mesh, camera: PerspectiveCamera) {
		// Resets the bounding box to its default "empty" state before recalculating it.
		box.set(min, max);
		var vertices = mesh.geometry.attributes.position.array;
		const length = mesh.geometry.attributes.position.count;
		for (let i = 0; i < length; i++) {
			const vertexWorldCoord = vertex
				.fromArray([vertices[3 * i + 0], vertices[3 * i + 1], vertices[3 * i + 2]])
				// Transformed to world coordinates using the mesh.matrixWorld matrix
				.applyMatrix4(mesh.matrixWorld);
			// Projected into screen space using the camera’s .project() method
			const vertexScreenSpace = vertexWorldCoord.project(camera);
			// Compute the "outer" most x and y values to obtain 2d
			// bounding box from the 3d bounding box
			box.min.min(vertexScreenSpace);
			box.max.max(vertexScreenSpace);
		}
	};
})();

const fitToObject = (function () {
	const _boundingBox3d = new Box3();
	const center = new Vector3();

	const boundingBox2d = new Box2();
	// Unfortunately, Box3 cannot be passed to computeScreenSpaceBoundingBox
	// it needs a mesh.
	const _boundingBox3dDimensions = new Vector3();

	const _material = new MeshBasicMaterial({ color: 0x00ff00 });

	return function fitToObject(
		object: Object3D,
		cameraControls: CameraControls,
		canvas: HTMLCanvasElement,
		enableTransition = true
	) {
		_boundingBox3d.setFromObject(object);
		_boundingBox3d.getCenter(center);
		_boundingBox3d.getSize(_boundingBox3dDimensions);
		const _geometry = new BoxGeometry(
			_boundingBox3dDimensions.x,
			_boundingBox3dDimensions.y,
			_boundingBox3dDimensions.z
		).translate(center.x, center.y, center.z);

		const boundingBox3d = new Mesh(_geometry, _material);

		cameraControls.setTarget(center.x, center.y, center.z, enableTransition);
		computeScreenSpaceBoundingBox(boundingBox2d, boundingBox3d, cameraControls.camera);

		// The distance the camera needs to be located from the object,
		// is derived by the intercept theorem. Luckily the dimensions
		// of the boundingBox2d are relative to screen size. This means
		// that the height of one of the triangles is 1. It thus
		// follows that the new distance = old_distance * max(width, height)
		// be aware that this assumes that the object is located at the
		// center of the screen.
		// Update: As the object or rather the bounding box values are not
		// symmetrical/centered. We additionally need to check which side
		// (left/right and top/bottom) the minimum, or the maximum size of
		//  the bounding box is larger. This way for sure the entire bounding
		// box and with it the keyboards will be visible.

		const distance =
			Math.max(
				Math.abs(boundingBox2d.max.x),
				Math.abs(boundingBox2d.min.x),
				Math.abs(boundingBox2d.max.y),
				Math.abs(boundingBox2d.min.y)
			) * cameraControls.camera.position.distanceTo(boundingBox3d.position);

		cameraControls.dollyTo(distance, enableTransition);
		computeScreenSpaceBoundingBox(boundingBox2d, boundingBox3d, cameraControls.camera);
	};
})();

export { createCameraControls, type CameraControls, fitToObject };
