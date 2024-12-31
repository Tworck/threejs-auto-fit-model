<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body) {
		@apply bg-gray-800;
	}
</style>
