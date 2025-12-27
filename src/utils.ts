export function rgbToHex(rgb: string): string {
    if (!rgb || rgb === '') return '#ffffe0';
    if (rgb.startsWith('#')) return rgb.toLowerCase();

    const match: RegExpMatchArray | null = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return '#ffffe0';

    const r: string = parseInt(match[1]).toString(16).padStart(2, '0');
    const g: string = parseInt(match[2]).toString(16).padStart(2, '0');
    const b: string = parseInt(match[3]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`.toLowerCase();
}

export function getRandomIndex(maxLength: number): number {
    return Math.floor(Math.random() * maxLength);
}

export function getRandomColor(colors: string[]): string {
    return colors[Math.floor(Math.random() * colors.length)];
}

export function closeInstallInstructions(): void {
    const instructionsElement: HTMLElement | null = document.getElementById('installInstructions');
    if (instructionsElement) {
        instructionsElement.style.display = 'none';
    }
}
