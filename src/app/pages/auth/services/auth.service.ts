import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@core/tokens';
import { Observable } from 'rxjs';
import { Credentials, LoginResponse, Register } from '@auth/models';

@Injectable({ providedIn: 'any' })
export class AuthService {

  constructor(@Inject(API_URL) private api: string, private http: HttpClient) { }

  register(credentials: Register): Observable<unknown> {
    const path = `${this.api}/auth/register`;
    return this.http.post<unknown>(path, credentials);
  }

  login(credentials: Credentials): Observable<LoginResponse> {
    const path = `${this.api}/auth/login`;
    return this.http.post<LoginResponse>(path, credentials);
  }
}
