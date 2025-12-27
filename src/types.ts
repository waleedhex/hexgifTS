export interface HexagonState {
    color: string;
    clickCount: number;
}

export interface ColorSet {
    red: string;
    green: string;
}

export interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
