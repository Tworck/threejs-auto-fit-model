## Context

This is a sample repository which uses threejs and the popular camera controls framework to autofit the camera to a 3d model on horizontal and vertical viewport changes using a bounding box and and preserving the camera position which is set by the user. We found that there was no code that did this directly and wanted a more dynamic way for camera/model resizing in our threejs scene.

## Minimal Example: `camera-tools .fitToObject` on Page Load Not Working

I want to dynamically adjust the camera settings so that my object - in this example, the spaceships — fit into the viewport of my canvas. This should work both on **window resize** and **page load**. The pan/dollyTo of the camera works as intended when resizing the window. However, it does not work on the initial page load: The camera performs some type of fitting on inital load. However, it does not zoom in close enough to the model. I suspect that this is due to the canvas not perfectly fitting the whole viewport on the initial pageload, but I am unsure. This can best be seen when choosing a very small screen size (like a phone screen) and then reloading the window. The model will be zoomed out too much. When dragging the window a tiny bit, the resize works as intended.

Interestingly, the problem "gets better" by calling `renderer.render` on the scene **prior to calling `.fitToSphere`/`fitObject`**. See World.ts line 49.

**Does anyone have an idea how to resolve this issue?**

Most of the relevant code is in:

- `src/lib/components/Scene/systems/cameraControls.ts`,
- `src/lib/components/Scene/World.ts`,
- `src/lib/components/Scene/systems/Resizer.ts`

## Instructions to Reproduce Behaviour

1. Clone this [repository](https://github.com/Tworck/threejs-auto-fit-model). Navigate to folder.
2. Install dependencies: `npm i`
3. Start the server: `npm run dev`  
   Open the page in your browser.
4. **Observe:** The camera is not perfectly fitted to the spaceships on initial page load. (To best see the issue, make sure to use a narrow window, like a phone size)
5. Now **resize the browser window by a very small margin**: The camera fits itself perfectly.
6. To try it out again, reload the window and repeat steps 4 and 5.
7. Comment in an out line 49 from `src/lib/components/Scene/World.ts` to see strange behaviour/ worsening of the fitting.

## Note

I observe the same issues when using the camera-tools build in fitToSphere method. Therefore, the custom fit function should not be whats causing the issue (at least from what I can see).
