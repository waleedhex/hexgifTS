import { BeforeInstallPromptEvent } from './types';

export class InstallHandler {
    private deferredPrompt: BeforeInstallPromptEvent | null = null;

    setupInstallPrompt(): void {
        window.addEventListener('beforeinstallprompt', (e: Event) => {
            console.log('beforeinstallprompt triggered');
            e.preventDefault();
            this.deferredPrompt = e as BeforeInstallPromptEvent;
            this.enableInstallButton();
        });
    }

    private enableInstallButton(): void {
        const installButton: HTMLElement | null = document.getElementById('installButton');
        if (installButton) {
            installButton.classList.remove('disabled');
            installButton.title = 'حفظ كتطبيق';
        }
    }

    handleInstallClick(): void {
        const installInstructions: HTMLElement | null = document.getElementById('installInstructions');

        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('تم قبول التثبيت');
                }
                this.deferredPrompt = null;
                this.disableInstallButton();
            });
        } else if (installInstructions) {
            installInstructions.style.display = 'flex';
        }
    }

    private disableInstallButton(): void {
        const installButton: HTMLElement | null = document.getElementById('installButton');
        if (installButton) {
            installButton.classList.add('disabled');
            installButton.title = 'تم التثبيت أو غير متاح';
        }
    }

    setupServiceWorker(): void {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then((registration: ServiceWorkerRegistration) => {
                        console.log('Service Worker مسجل:', registration);
                    })
                    .catch((error: Error) => {
                        console.error('فشل تسجيل Service Worker:', error);
                    });
            });
        }
    }
}
