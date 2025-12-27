import { ColorSet } from './types';

export const LETTERS: string[] = [
    'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س',
    'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م',
    'ن', 'ه', 'و', 'ي'
];

export const COLOR_SETS: ColorSet[] = [
    { red: '#ff4081', green: '#81c784' },
    { red: '#f8bbd0', green: '#4dd0e1' },
    { red: '#d32f2f', green: '#0288d1' },
    { red: '#ff5722', green: '#388e3c' }
];

export const DEFAULT_COLOR: string = '#ffffe0';

export const HEX_GRID_LAYOUT: string[][] = [
    ['', '', '', '', '', '', ''],
    ['', 'أ', 'ب', 'ت', 'ث', 'ج', ''],
    ['', 'ح', 'خ', 'د', 'ذ', 'ر', ''],
    ['', 'ز', 'س', 'ش', 'ص', 'ض', ''],
    ['', 'ط', 'ظ', 'ع', 'غ', 'ف', ''],
    ['', 'ق', 'ك', 'ل', 'م', 'ن', ''],
    ['', '', '', '', '', 'ه', '']
];

export const PARTY_MODE_DURATION: number = 5000;
export const PARTY_MODE_INTERVAL: number = 300;
export const FLASH_DURATION: number = 1000;
export const FLASH_COUNT: number = 5;

export const FLASH_COLORS: string[] = ['#ffd700', '#ff4500', '#00ff00'];
