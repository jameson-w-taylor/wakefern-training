import { Component, OnInit } from '@angular/core';
import { AuthenticationService, SessionVaultService, TeaService } from '@app/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tea } from '@app/models';
import { NavController } from '@ionic/angular';
import { Observable, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-tea',
  templateUrl: './tea.page.html',
  styleUrls: ['./tea.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TeaPage implements OnInit {
  teaMatrix$: Observable<Array<Array<Tea>>> = of([]);

  constructor(
    private auth: AuthenticationService,
    private nav: NavController,
    private sessionVault: SessionVaultService,
    private tea: TeaService
  ) {}

  ngOnInit() {
    this.teaMatrix$ = this.tea.getAll().pipe(map((teas) => this.toMatrix(teas)));
  }

  showDetailsPage(id: number) {
    this.nav.navigateForward(['tea-details', id]);
  }

  logout() {
    this.auth
      .logout()
      .pipe(
        tap(async () => {
          await this.sessionVault.clear();
          this.nav.navigateRoot(['/', 'login']);
        })
      )
      .subscribe();
  }

  private toMatrix(tea: Array<Tea>): Array<Array<Tea>> {
    const matrix: Array<Array<Tea>> = [];
    let row: Tea[] = [];
    tea.forEach((t) => {
      row.push(t);
      if (row.length === 4) {
        matrix.push(row);
        row = [];
      }
    });

    if (row.length) {
      matrix.push(row);
    }

    return matrix;
  }
}
