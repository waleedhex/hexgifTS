import './styles.css';
import { HexGrid } from './hexGrid';
import { InstallHandler } from './installHandler';
import { PartyMode } from './partyMode';
import { closeInstallInstructions } from './utils';

declare global {
    function closeInstallInstructions(): void;
}

window.closeInstallInstructions = closeInstallInstructions;

const hexGrid: HexGrid = new HexGrid('hexGridHost');
const installHandler: InstallHandler = new InstallHandler();
const partyMode: PartyMode = new PartyMode('hexGridHost', 0);

function initializeApplication(): void {
    hexGrid.createHexGrid();
    installHandler.setupInstallPrompt();
    installHandler.setupServiceWorker();
    setupEventListeners();
}

function setupEventListeners(): void {
    const shuffleButton: HTMLElement | null = document.getElementById('shuffleButton');
    const swapColorsButton: HTMLElement | null = document.getElementById('swapColorsButton');
    const changeColorsButton: HTMLElement | null = document.getElementById('changeColorsButton');
    const partyButton: HTMLElement | null = document.getElementById('partyButton');
    const installButton: HTMLElement | null = document.getElementById('installButton');

    if (shuffleButton) {
        shuffleButton.addEventListener('click', () => {
            hexGrid.shuffle();
        });
    }

    if (swapColorsButton) {
        swapColorsButton.addEventListener('click', () => {
            hexGrid.swapColors();
        });
    }

    if (changeColorsButton) {
        changeColorsButton.addEventListener('click', () => {
            hexGrid.changeColors();
            partyMode.updateColorSetIndex(hexGrid.getCurrentColorSetIndex());
            partyMode.stopPartyMode();
        });
    }

    if (partyButton) {
        partyButton.addEventListener('click', () => {
            partyMode.updateColorSetIndex(hexGrid.getCurrentColorSetIndex());
            partyMode.startPartyMode();
        });
    }

    if (installButton) {
        installButton.addEventListener('click', () => {
            installHandler.handleInstallClick();
        });
    }
}

window.addEventListener('load', () => {
    initializeApplication();
});
