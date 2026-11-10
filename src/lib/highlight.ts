/** Lights a process's satellite in the server scene. -1 clears it. */
export function highlight(index: number) {
  window.dispatchEvent(new CustomEvent("world:highlight", { detail: index }));
}
