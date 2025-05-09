export function serializeForClipboard(view: any, slice: any) {
    // Minimal implementation: wrap the slice content in a container
    const container = document.createElement("div");
    // Optionally use the view's serializer if available:
    if (view.domSerializer && typeof view.domSerializer.serializeFragment === "function") {
        container.appendChild(view.domSerializer.serializeFragment(slice.content));
    } else {
        container.textContent = "Clipboard content";
    }
    return {
        dom: container,
        text: container.innerText,
        slice,
    };
}
