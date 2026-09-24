import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LinkRecord, SnipService } from './snip.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private snip = inject(SnipService);

  urlInput = '';
  readonly links = signal<LinkRecord[]>([]);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly successUrl = signal<string | null>(null);
  readonly loading = signal(false);

  constructor() {
    void this.loadLinks();
  }

  async loadLinks(): Promise<void> {
    try {
      const data = await this.snip.listLinks();
      this.links.set(data);
    } catch (error) {
      this.error.set(this.snip.getErrorMessage(error));
    }
  }

  async onSubmit(): Promise<void> {
    const value = this.urlInput.trim();

    if (!/^https?:\/\//i.test(value)) {
      this.error.set('Please enter a valid http:// or https:// URL.');
      this.successMessage.set(null);
      this.successUrl.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.successMessage.set(null);
    this.successUrl.set(null);

    try {
      const link = await this.snip.createLink(value);
      this.links.update((current) => [link, ...current]);
      this.successMessage.set('Created');
      this.successUrl.set(link.shortUrl);
      this.urlInput = '';
    } catch (error) {
      this.error.set(this.snip.getErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }
}
