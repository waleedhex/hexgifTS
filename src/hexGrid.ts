import { HexagonState, ColorSet } from './types';
import { LETTERS, COLOR_SETS, DEFAULT_COLOR, HEX_GRID_LAYOUT } from './constants';
import { rgbToHex, getRandomIndex } from './utils';
import { WinChecker } from './winChecker';

export class HexGrid {
    private gridId: string;
    private currentColorSetIndex: number = 0;
    private isSwapped: boolean = false;
    private winChecker: WinChecker;
    private onWinCallback: ((color: 'red' | 'green') => void) | null = null;

    constructor(gridId: string) {
        this.gridId = gridId;
        this.winChecker = new WinChecker(gridId);
    }

    setOnWinCallback(callback: (color: 'red' | 'green') => void): void {
        this.onWinCallback = callback;
    }

    createHexGrid(): void {
        const grid: HTMLElement | null = document.getElementById(this.gridId);
        if (!grid) return;

        grid.innerHTML = '<div class="party-text" id="partyText">مبروك</div>';

        HEX_GRID_LAYOUT.forEach((row: string[], rowIndex: number) => {
            const rowDiv: HTMLDivElement = document.createElement('div');
            rowDiv.className = 'row';

            row.forEach((letter: string, colIndex: number) => {
                const hex: HTMLDivElement = document.createElement('div');
                hex.className = 'hexagon';

                this.applyHexagonClasses(hex, rowIndex, colIndex, letter);

                if (rowIndex !== 0 && rowIndex !== 6 && colIndex !== 0 && colIndex !== 6 && letter) {
                    hex.classList.add('changeable');
                    hex.textContent = letter;
                    hex.setAttribute('data-letter', letter);
                    hex.setAttribute('data-click-count', '0');
                    hex.addEventListener('click', () => this.handleHexClick(hex));
                }

                rowDiv.appendChild(hex);
            });

            grid.appendChild(rowDiv);
        });

        this.initializeHexagons();
    }

    private applyHexagonClasses(hex: HTMLDivElement, rowIndex: number, colIndex: number, letter: string): void {
        if (rowIndex === 0) {
            if (colIndex === 0 || colIndex === 6) {
                hex.classList.add('green-fixed');
                if (colIndex === 0) hex.classList.add('outer-fixed-top-left');
                else hex.classList.add('outer-fixed-top');
            } else {
                hex.classList.add('red-fixed');
                hex.classList.add('outer-fixed-top');
            }
        } else if (rowIndex === 6) {
            if (colIndex === 0 || colIndex === 6) {
                hex.classList.add('green-fixed');
                if (colIndex === 0) hex.classList.add('outer-fixed-bottom-left');
                else hex.classList.add('outer-fixed-bottom');
            } else {
                hex.classList.add('red-fixed');
                hex.classList.add('outer-fixed-bottom');
            }
        } else if (colIndex === 0 || colIndex === 6) {
            hex.classList.add('green-fixed');
            if (colIndex === 6 && (rowIndex === 1 || rowIndex === 3 || rowIndex === 5)) {
                hex.classList.add('outer-fixed-odd-right');
            } else if (colIndex === 0 && (rowIndex === 2 || rowIndex === 4)) {
                hex.classList.add('outer-fixed-even-left');
            }
        }
    }

    private initializeHexagons(): void {
        const hexagons: { [key: string]: HexagonState } = {};
        const availableLetters: string[] = [...LETTERS];
        const shuffled: string[] = [];

        for (let i: number = 0; i < LETTERS.length; i++) {
            const randomIndex: number = getRandomIndex(availableLetters.length);
            shuffled.push(availableLetters[randomIndex]);
            hexagons[shuffled[i]] = { color: DEFAULT_COLOR, clickCount: 0 };
            availableLetters.splice(randomIndex, 1);
        }

        this.updateGrid(hexagons, shuffled);
    }

    private handleHexClick(hex: HTMLDivElement): void {
        const letter: string | null = hex.getAttribute('data-letter');
        if (!letter) return;

        let clickCount: number = parseInt(hex.getAttribute('data-click-count') || '0');
        clickCount = (clickCount + 1) % 5;
        hex.setAttribute('data-click-count', clickCount.toString());

        const colorCycle: string[] = this.getColorCycle();
        const newColor: string = colorCycle[clickCount];
        hex.style.backgroundColor = newColor;

        const hexagons: { [key: string]: HexagonState } = this.collectHexagonStates();
        const lettersOrder: string[] = this.getLettersOrder();
        this.updateGrid(hexagons, lettersOrder);

        setTimeout(() => {
            this.checkForWin();
        }, 50);
    }

    private checkForWin(): void {
        const result = this.winChecker.checkWin();
        if (result.hasWon && result.winColor && this.onWinCallback) {
            this.onWinCallback(result.winColor);
        }
    }

    private collectHexagonStates(): { [key: string]: HexagonState } {
        const hexagons: { [key: string]: HexagonState } = {};
        const changeableHexagons: NodeListOf<HTMLDivElement> = document.querySelectorAll(`#${this.gridId} .changeable`);

        changeableHexagons.forEach((hex: HTMLDivElement) => {
            const letter: string | null = hex.getAttribute('data-letter');
            if (letter) {
                hexagons[letter] = {
                    color: rgbToHex(hex.style.backgroundColor),
                    clickCount: parseInt(hex.getAttribute('data-click-count') || '0')
                };
            }
        });

        return hexagons;
    }

    private getLettersOrder(): string[] {
        const changeableHexagons: NodeListOf<HTMLDivElement> = document.querySelectorAll(`#${this.gridId} .changeable`);
        return Array.from(changeableHexagons).map((hex: HTMLDivElement) => hex.getAttribute('data-letter') || '');
    }

    private getColorCycle(): string[] {
        return [
            DEFAULT_COLOR,
            '#ffa500',
            COLOR_SETS[this.currentColorSetIndex].red,
            COLOR_SETS[this.currentColorSetIndex].green,
            DEFAULT_COLOR
        ];
    }

    private updateGrid(hexagons: { [key: string]: HexagonState }, lettersOrder: string[]): void {
        const gridHexagons: NodeListOf<HTMLDivElement> = document.querySelectorAll(`#${this.gridId} .changeable`);

        gridHexagons.forEach((hex: HTMLDivElement, index: number) => {
            const letter: string = lettersOrder[index];
            hex.textContent = letter;
            hex.setAttribute('data-letter', letter);
            hex.style.backgroundColor = hexagons[letter].color;
            hex.setAttribute('data-click-count', hexagons[letter].clickCount.toString());
        });

        this.updateFixedHexagons();
    }

    private updateFixedHexagons(): void {
        const redHexagons: NodeListOf<HTMLDivElement> = document.querySelectorAll(`#${this.gridId} .red-fixed`);
        const greenHexagons: NodeListOf<HTMLDivElement> = document.querySelectorAll(`#${this.gridId} .green-fixed`);
        const currentSet: ColorSet = COLOR_SETS[this.currentColorSetIndex];

        redHexagons.forEach((hex: HTMLDivElement) => {
            hex.style.backgroundColor = this.isSwapped ? currentSet.green : currentSet.red;
        });

        greenHexagons.forEach((hex: HTMLDivElement) => {
            hex.style.backgroundColor = this.isSwapped ? currentSet.red : currentSet.green;
        });
    }

    shuffle(): void {
        const hexagons: { [key: string]: HexagonState } = {};
        const availableLetters: string[] = [...LETTERS];
        const shuffled: string[] = [];

        for (let i: number = 0; i < LETTERS.length; i++) {
            const randomIndex: number = getRandomIndex(availableLetters.length);
            shuffled.push(availableLetters[randomIndex]);
            hexagons[shuffled[i]] = { color: DEFAULT_COLOR, clickCount: 0 };
            availableLetters.splice(randomIndex, 1);
        }

        this.updateGrid(hexagons, shuffled);
    }

    swapColors(): void {
        this.isSwapped = !this.isSwapped;
        const hexagons: { [key: string]: HexagonState } = this.collectHexagonStates();
        const lettersOrder: string[] = this.getLettersOrder();
        this.updateGrid(hexagons, lettersOrder);
    }

    changeColors(): void {
        this.currentColorSetIndex = (this.currentColorSetIndex + 1) % COLOR_SETS.length;
        const hexagons: { [key: string]: HexagonState } = this.collectHexagonStates();
        const lettersOrder: string[] = this.getLettersOrder();
        this.updateGrid(hexagons, lettersOrder);
    }

    getCurrentColorSetIndex(): number {
        return this.currentColorSetIndex;
    }
}
