import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meme, MemeResponse } from '../models/meme.model';
import { Observable, of, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemeService { 
  private memeDataKey = 'memeData';

  constructor(private http: HttpClient) { }

  getMemes(): Observable<MemeResponse> {
    const cachedData = localStorage.getItem(this.memeDataKey);
    if (cachedData) {
      return of(JSON.parse(cachedData));
    } else {
      return this.http.get<MemeResponse>('https://api.imgflip.com/get_memes').pipe(
        tap(data => {
          localStorage.setItem(this.memeDataKey, JSON.stringify(data));
        }),
        catchError(this.handleError<MemeResponse>('getMemes', { success: false }))
      );
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
