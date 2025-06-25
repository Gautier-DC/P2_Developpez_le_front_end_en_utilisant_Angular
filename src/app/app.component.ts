import { Component, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OlympicService } from './core/services/olympic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private olympicService = inject(OlympicService);

  appState = signal<'loading' | 'ready' | 'error'>('loading');
  initError = signal<string | null>(null);

  isLoading = computed(() => this.appState() === 'loading');
  isReady = computed(() => this.appState() === 'ready');
  hasError = computed(() => this.appState() === 'error');

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    this.olympicService
      .loadInitialData()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.appState.set('ready');
          this.initError.set(null);
        },
        error: (error) => {
          console.error('App initialization failed:', error);
          this.appState.set('error');
          this.initError.set('Impossible de charger les données olympiques');
        }
      });
  }

  retryInitialization(): void {
    this.appState.set('loading');
    this.initError.set(null);
    this.initializeApp();
  }

  dismissError(): void {
    this.appState.set('ready'); 
  }
}