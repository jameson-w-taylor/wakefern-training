import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Tea } from '@app/models';
import { Preferences } from '@capacitor/preferences';

type TeaResponse = Omit<Tea, 'image' | 'rating'>;

@Injectable({
  providedIn: 'root',
})
export class TeaService {
  private images: Array<string> = ['green', 'black', 'herbal', 'oolong', 'dark', 'puer', 'white', 'yellow'];

  constructor(private http: HttpClient) {}

  get(id: number): Observable<Tea> {
    return this.http
      .get<TeaResponse>(`${environment.dataService}/tea-categories/${id}`)
      .pipe(mergeMap((tea) => this.convert(tea)));
  }

  getAll(): Observable<Array<Tea>> {
    return this.http
      .get<Array<TeaResponse>>(`${environment.dataService}/tea-categories`)
      .pipe(mergeMap((teas: Array<TeaResponse>) => Promise.all(teas.map((t) => this.convert(t)))));
  }

  save(tea: Tea): Promise<void> {
    return Preferences.set({
      key: `rating${tea.id}`,
      value: tea.rating.toString(),
    });
  }

  private async convert(tea: TeaResponse): Promise<Tea> {
    const { value } = await Preferences.get({ key: `rating${tea.id}` });
    return { ...tea, image: `assets/img/${this.images[tea.id - 1]}.jpg`, rating: parseInt(value || '0', 10) };
  }
}
