import { COLOR_SETS, PARTY_MODE_DURATION, PARTY_MODE_INTERVAL, FLASH_DURATION, FLASH_COUNT, FLASH_COLORS } from './constants';
import { rgbToHex, getRandomColor } from './utils';

export class PartyMode {
    private partyInterval: number | null = null;
    private gridId: string;
    private currentColorSetIndex: number;

    constructor(gridId: string, colorSetIndex: number) {
        this.gridId = gridId;
        this.currentColorSetIndex = colorSetIndex;
    }

    updateColorSetIndex(index: number): void {
        this.currentColorSetIndex = index;
    }

    startPartyMode(): void {
        const partyText: HTMLElement | null = document.getElementById('partyText');
        const grid: HTMLElement | null = document.getElementById(this.gridId);

        if (!partyText || !grid) return;

        partyText.style.display = 'block';

        if (!this.partyInterval) {
            this.partyInterval = window.setInterval(() => {
                this.updatePartyMode(partyText, grid);
            }, PARTY_MODE_INTERVAL);

            setTimeout(() => {
                this.stopPartyMode();
            }, PARTY_MODE_DURATION);
        }
    }

    private updatePartyMode(partyText: HTMLElement, grid: HTMLElement): void {
        const currentSet = COLOR_SETS[this.currentColorSetIndex];
        const currentTextColor: string = rgbToHex(partyText.style.color);
        partyText.style.color = (currentTextColor === '#ffd700') ? currentSet.red : '#ffd700';

        for (let i: number = 0; i < FLASH_COUNT; i++) {
            this.createFlash(grid);
        }
    }

    private createFlash(grid: HTMLElement): void {
        const flash: HTMLDivElement = document.createElement('div');
        flash.className = 'flash';
        flash.style.left = Math.random() * 100 + '%';
        flash.style.top = Math.random() * 100 + '%';
        flash.style.backgroundColor = getRandomColor(FLASH_COLORS);

        grid.appendChild(flash);

        setTimeout(() => {
            if (flash.parentNode) {
                flash.remove();
            }
        }, FLASH_DURATION);
    }

    stopPartyMode(): void {
        if (this.partyInterval) {
            clearInterval(this.partyInterval);
            this.partyInterval = null;

            const partyText: HTMLElement | null = document.getElementById('partyText');
            if (partyText) {
                partyText.style.display = 'none';
            }

            const flashes: NodeListOf<HTMLDivElement> = document.querySelectorAll('.flash');
            flashes.forEach((flash: HTMLDivElement) => {
                if (flash.parentNode) {
                    flash.remove();
                }
            });
        }
    }
}
