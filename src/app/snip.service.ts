import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

export interface LinkRecord {
  code: string;
  url: string;
  shortUrl: string;
  hits: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class SnipService {
  private http = inject(HttpClient);

  createLink(url: string): Promise<LinkRecord> {
    return lastValueFrom(
      this.http.post<LinkRecord>('http://localhost:3000/api/links', { url })
    );
  }

  listLinks(): Promise<LinkRecord[]> {
    return lastValueFrom(this.http.get<LinkRecord[]>('http://localhost:3000/api/links'));
  }

  getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as { error?: string } | undefined;
      return body?.error || error.message || 'Something went wrong.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Something went wrong.';
  }
}
