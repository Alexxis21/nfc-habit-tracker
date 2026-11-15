type Listener = (visible: boolean) => void;

let listener: Listener | null = null;

export function registerNfcPromptListener(next: Listener | null): void {
  listener = next;
}

export function setNfcPromptVisible(visible: boolean): void {
  listener?.(visible);
}