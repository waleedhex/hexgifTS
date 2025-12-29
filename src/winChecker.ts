import { HEX_GRID_LAYOUT } from './constants';

interface HexPosition {
    row: number;
    col: number;
}

export class WinChecker {
    private gridId: string;

    constructor(gridId: string) {
        this.gridId = gridId;
    }

    checkWin(): { hasWon: boolean; winColor: 'red' | 'green' | null } {
        const redWin = this.checkColorPath('#ff4081');
        if (redWin) return { hasWon: true, winColor: 'red' };

        const greenWin = this.checkColorPath('#81c784');
        if (greenWin) return { hasWon: true, winColor: 'green' };

        return { hasWon: false, winColor: null };
    }

    private checkColorPath(targetColor: string): boolean {
        const colorMap = this.buildColorMap();
        const topPositions = this.getTopEdgePositions(targetColor, colorMap);

        for (const startPos of topPositions) {
            if (this.hasPathToBottom(startPos, targetColor, colorMap)) {
                return true;
            }
        }

        return false;
    }

    private buildColorMap(): Map<string, string> {
        const colorMap = new Map<string, string>();
        const grid = document.getElementById(this.gridId);

        if (!grid) return colorMap;

        const rows = grid.querySelectorAll('.row');
        rows.forEach((row: Element, rowIndex: number) => {
            const hexagons = row.querySelectorAll('.hexagon');
            hexagons.forEach((hex: Element, colIndex: number) => {
                const hexElement = hex as HTMLElement;
                const style = hexElement.style.backgroundColor;
                const computedStyle = window.getComputedStyle(hexElement);
                const bgColor = style || computedStyle.backgroundColor;
                const normalizedColor = this.normalizeColor(bgColor);
                const key = `${rowIndex},${colIndex}`;
                colorMap.set(key, normalizedColor);
            });
        });

        return colorMap;
    }

    private normalizeColor(color: string): string {
        if (!color) return '';
        if (color.startsWith('#')) return color.toLowerCase();

        if (color.includes('rgb')) {
            const match = color.match(/\d+/g);
            if (match && match.length >= 3) {
                const r = parseInt(match[0]).toString(16).padStart(2, '0');
                const g = parseInt(match[1]).toString(16).padStart(2, '0');
                const b = parseInt(match[2]).toString(16).padStart(2, '0');
                return `#${r}${g}${b}`.toLowerCase();
            }
        }
        return '';
    }

    private getTopEdgePositions(targetColor: string, colorMap: Map<string, string>): HexPosition[] {
        const positions: HexPosition[] = [];
        const layout = HEX_GRID_LAYOUT;

        layout[0].forEach((_, colIndex) => {
            const key = `0,${colIndex}`;
            const color = colorMap.get(key);
            if (this.isTargetColor(color, targetColor)) {
                positions.push({ row: 0, col: colIndex });
            }
        });

        return positions;
    }

    private isTargetColor(color: string | undefined, targetColor: string): boolean {
        if (!color) return false;
        const normalizedTarget = targetColor.toLowerCase();
        return color === normalizedTarget;
    }

    private hasPathToBottom(start: HexPosition, targetColor: string, colorMap: Map<string, string>): boolean {
        const visited = new Set<string>();
        const queue: HexPosition[] = [start];
        const bottomRow = HEX_GRID_LAYOUT.length - 1;

        while (queue.length > 0) {
            const current = queue.shift();
            if (!current) break;

            const key = `${current.row},${current.col}`;

            if (visited.has(key)) continue;
            visited.add(key);

            const currentColor = colorMap.get(key);
            if (!this.isTargetColor(currentColor, targetColor)) {
                continue;
            }

            if (current.row === bottomRow) {
                return true;
            }

            const neighbors = this.getNeighbors(current, colorMap, targetColor);
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.row},${neighbor.col}`;
                if (!visited.has(neighborKey)) {
                    queue.push(neighbor);
                }
            }
        }

        return false;
    }

    private getNeighbors(pos: HexPosition, colorMap: Map<string, string>, targetColor: string): HexPosition[] {
        const neighbors: HexPosition[] = [];
        const layout = HEX_GRID_LAYOUT;
        const row = pos.row;
        const col = pos.col;

        const isEvenRow = row % 2 === 0;

        const adjacentOffsets = isEvenRow
            ? [
                  [-1, -1], [-1, 0],
                  [0, -1], [0, 1],
                  [1, -1], [1, 0]
              ]
            : [
                  [-1, 0], [-1, 1],
                  [0, -1], [0, 1],
                  [1, 0], [1, 1]
              ];

        for (const [dRow, dCol] of adjacentOffsets) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (newRow >= 0 && newRow < layout.length && newCol >= 0 && newCol < layout[newRow].length) {
                const key = `${newRow},${newCol}`;
                const color = colorMap.get(key);
                if (this.isTargetColor(color, targetColor)) {
                    neighbors.push({ row: newRow, col: newCol });
                }
            }
        }

        return neighbors;
    }
}
