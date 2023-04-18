import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TeaPage } from './tea.page';
import { Tea } from '@app/models';
import { AuthenticationService, SessionVaultService, TeaService } from '@app/core';
import { NavController } from '@ionic/angular';
import {
  createAuthenticationServiceMock,
  createSessionVaultServiceMock,
  createTeaServiceMock,
} from '@app/core/testing';
import { createNavControllerMock } from '@test/mocks';
import { of } from 'rxjs';

describe('TeaPage', () => {
  let component: TeaPage;
  let fixture: ComponentFixture<TeaPage>;
  let teas: Array<Tea>;

  const initializeTestData = () => {
    teas = [
      {
        id: 1,
        name: 'Green',
        image: 'assets/img/green.jpg',
        description:
          'Green teas have the oxidation process stopped very early on, leaving them with a very subtle flavor and ' +
          'complex undertones. These teas should be steeped at lower temperatures for shorter periods of time.',
        rating: 3,
      },
      {
        id: 2,
        name: 'Black',
        image: 'assets/img/black.jpg',
        description:
          'A fully oxidized tea, black teas have a dark color and a full robust and pronounced flavor. Black teas tend ' +
          'to have a higher caffeine content than other teas.',
        rating: 2,
      },
      {
        id: 3,
        name: 'Herbal',
        image: 'assets/img/herbal.jpg',
        description:
          'Herbal infusions are not actually "tea" but are more accurately characterized as infused beverages ' +
          'consisting of various dried herbs, spices, and fruits.',
        rating: 4,
      },
      {
        id: 4,
        name: 'Oolong',
        image: 'assets/img/oolong.jpg',
        description:
          'Oolong teas are partially oxidized, giving them a flavor that is not as robust as black teas but also ' +
          'not as subtle as green teas. Oolong teas often have a flowery fragrance.',
        rating: 2,
      },
      {
        id: 5,
        name: 'Dark',
        image: 'assets/img/dark.jpg',
        description:
          'From the Hunan and Sichuan provinces of China, dark teas are flavorful aged pro-biotic teas that steeps ' +
          'up very smooth with slightly sweet notes.',
        rating: 5,
      },
      {
        id: 6,
        name: 'Puer',
        image: 'assets/img/puer.jpg',
        description:
          'An aged black tea from china. Puer teas have a strong rich flavor that could be described as "woody" or "peaty."',
        rating: 0,
      },
    ];
  };

  beforeEach(waitForAsync(() => {
    initializeTestData();
    TestBed.configureTestingModule({
      imports: [TeaPage],
    })
      .overrideProvider(AuthenticationService, { useFactory: createAuthenticationServiceMock })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock })
      .overrideProvider(TeaService, { useFactory: createTeaServiceMock })
      .compileComponents();

    const tea = TestBed.inject(TeaService);
    (tea.getAll as jasmine.Spy).and.returnValue(of(teas));
    fixture = TestBed.createComponent(TeaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('displays the correct title', () => {
    const titles = fixture.debugElement.queryAll(By.css('ion-title'));
    expect(titles.length).toBe(2);
    expect(titles[0].nativeElement.textContent.trim()).toBe('Teas');
    expect(titles[1].nativeElement.textContent.trim()).toBe('Teas');
  });

  describe('a grid of six teas', () => {
    let grid: DebugElement;
    beforeEach(() => {
      grid = fixture.debugElement.query(By.css('ion-grid'));
    });

    it('contains two rows', () => {
      const rows = grid.queryAll(By.css('ion-row'));
      expect(rows.length).toBe(2);
    });

    it('has four columns in the first row', () => {
      const rows = grid.queryAll(By.css('ion-row'));
      const cols = rows[0].queryAll(By.css('ion-col'));
      expect(cols.length).toBe(4);
    });

    it('has two columns in the second row', () => {
      const rows = grid.queryAll(By.css('ion-row'));
      const cols = rows[1].queryAll(By.css('ion-col'));
      expect(cols.length).toBe(2);
    });

    it('binds the card title to the tea name', () => {
      const cols = grid.queryAll(By.css('ion-col'));
      expect(cols.length).toBe(6);
      cols.forEach((col, idx) => {
        const title = col.query(By.css('ion-card-title'));
        expect(title.nativeElement.textContent.trim()).toBe(teas[idx].name);
      });
    });

    it('binds the card content to the tea description', () => {
      const cols = grid.queryAll(By.css('ion-col'));
      expect(cols.length).toBe(6);
      cols.forEach((col, idx) => {
        const title = col.query(By.css('ion-card-content'));
        expect(title.nativeElement.textContent.trim()).toBe(teas[idx].description);
      });
    });
  });

  describe('logout button', () => {
    describe('on click', () => {
      beforeEach(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.logout as jasmine.Spy).and.returnValue(of(undefined));
      });

      it('calls the logout', () => {
        const auth = TestBed.inject(AuthenticationService);
        const button = fixture.debugElement.query(By.css('[data-testid="logout-button"]')).nativeElement;
        click(button);
        expect(auth.logout).toHaveBeenCalledTimes(1);
      });

      it('clears the session', () => {
        const button = fixture.debugElement.query(By.css('[data-testid="logout-button"]')).nativeElement;
        const sessionVault = TestBed.inject(SessionVaultService);
        click(button);
        expect(sessionVault.clear).toHaveBeenCalledTimes(1);
      });

      it('navigates to the login page', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="logout-button"]')).nativeElement;
        const nav = TestBed.inject(NavController);
        click(button);
        tick();
        expect(nav.navigateRoot).toHaveBeenCalledTimes(1);
        expect(nav.navigateRoot).toHaveBeenCalledWith(['/', 'login']);
      }));
    });
  });

  describe('show details page', () => {
    let card: HTMLElement;
    beforeEach(() => {
      const grid = fixture.debugElement.query(By.css('ion-grid'));
      const rows = grid.queryAll(By.css('ion-row'));
      const cols = rows[0].queryAll(By.css('ion-col'));
      card = cols[2].query(By.css('ion-card')).nativeElement;
    });

    it('navigates forward', () => {
      const navController = TestBed.inject(NavController);
      click(card);
      expect(navController.navigateForward).toHaveBeenCalledTimes(1);
    });

    it('passes the details page and the ID', () => {
      const navController = TestBed.inject(NavController);
      click(card);
      expect(navController.navigateForward).toHaveBeenCalledWith(['tea-details', teas[2].id]);
    });
  });

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };
});
