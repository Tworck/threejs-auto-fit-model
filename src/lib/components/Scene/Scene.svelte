<script lang="ts">
	import { World } from '$lib/components/Scene/World';
	import { onMount } from 'svelte';

	let { ...rest } = $props();

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;

	onMount(() => {
		async function main() {
			// create a new world
			const world = new World(container, canvas);

			// complete async tasks
			await world.init(canvas);

			// start the animation loop
			world.start();
		}
		main().catch((err) => {
			console.error(err);
		});
	});
</script>

<div {...rest} bind:this={container}>
	<canvas class="h-full w-full" bind:this={canvas}></canvas>
</div>

<style>
</style>
