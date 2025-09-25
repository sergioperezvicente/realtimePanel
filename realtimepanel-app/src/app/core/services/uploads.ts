import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FileCategory } from '@app/data/types/file-category';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly apiUrl: string = `${environment.apiUrl}/files/upload`;
  private readonly http = inject(HttpClient);

  uploadImage(file: File, category: FileCategory): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/${category}`, formData);
  }

  async convertBlobToFilePNG(blobUrl: string): Promise<File> {
    const blob = await fetch(blobUrl).then((r) => r.blob());
    const fileName = Math.random().toString(36).substring(2, 12) + '.png';
    return new File([blob], fileName, { type: blob.type });
  }
}
