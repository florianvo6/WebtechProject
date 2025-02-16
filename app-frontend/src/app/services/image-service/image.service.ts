import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'https://mingle.px.media/api/v1/files';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('addFileNameToKeywords', 'true');
    formData.append('addKeywords', JSON.stringify(['example', 'upload']));
    formData.append('description', 'New Photo');

    const headers = new HttpHeaders({
      'Authorization': 'Bearer nDnA3zVgRASeWxZiwKE7pFjchI2qiCkOREHKprcYi6Q3caMnbM4IfY61B1SaAeZF',
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }

  getJobDetails(jobId: string): Observable<any> {
    const url = `https://mingle.px.media/api/v1/jobs/${jobId}`;
    const headers = new HttpHeaders({
        'Authorization': 'Bearer nDnA3zVgRASeWxZiwKE7pFjchI2qiCkOREHKprcYi6Q3caMnbM4IfY61B1SaAeZF',
    });

    const params = new HttpParams().set('responseFields', JSON.stringify(['id', 'jobData', 'progress', 'isFinished']));

    return this.http.get(url, { headers, params });
  }

  downloadImage(fileId: string): Observable<any> {
    const url = `https://mingle.px.media/api/v1/files/${fileId}/convert`;
    const headers = new HttpHeaders({
        'Authorization': 'Bearer nDnA3zVgRASeWxZiwKE7pFjchI2qiCkOREHKprcYi6Q3caMnbM4IfY61B1SaAeZF',
    });

    const params = new HttpParams()
        .set('downloadType', 'preview') 
        .set('responseType', 'path');

    return this.http.get(url, { headers, params });
}
}
