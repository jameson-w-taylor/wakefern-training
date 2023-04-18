import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TastingNotesService, TeaService } from '@app/core';
import { createTastingNotesServiceMock, createTeaServiceMock } from '@app/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { createOverlayControllerMock } from '@test/mocks';
import { of } from 'rxjs';

import { TastingNoteEditorComponent } from './tasting-note-editor.component';

describe('TastingNoteEditorComponent', () => {
  let component: TastingNoteEditorComponent;
  let fixture: ComponentFixture<TastingNoteEditorComponent>;
  let modalController: ModalController;

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    modalController = createOverlayControllerMock('ModalController');
    TestBed.configureTestingModule({
      imports: [TastingNoteEditorComponent],
    })
      .overrideProvider(TastingNotesService, { useFactory: createTastingNotesServiceMock })
      .overrideProvider(TeaService, { useFactory: createTeaServiceMock })
      .overrideProvider(ModalController, { useValue: modalController })
      .compileComponents();

    fixture = TestBed.createComponent(TastingNoteEditorComponent);
    component = fixture.componentInstance;
    const tea = TestBed.inject(TeaService);
    (tea.getAll as jasmine.Spy).and.returnValue(
      of([
        {
          id: 7,
          name: 'White',
          image: 'assets/img/white.jpg',
          description: 'White tea description.',
          rating: 5,
        },
        {
          id: 8,
          name: 'Yellow',
          image: 'assets/img/yellow.jpg',
          description: 'Yellow tea description.',
          rating: 3,
        },
      ])
    );
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('binds the tea select', () => {
      fixture.detectChanges();
      const sel = fixture.debugElement.query(By.css('ion-select'));
      const opts = sel.queryAll(By.css('ion-select-option'));
      expect(opts.length).toEqual(2);
      expect(opts[0].nativeElement.value).toEqual(7);
      expect(opts[0].nativeElement.textContent).toEqual('White');
      expect(opts[1].nativeElement.value).toEqual(8);
      expect(opts[1].nativeElement.textContent).toEqual('Yellow');
    });

    describe('without a note', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('has the add title', () => {
        const el = fixture.debugElement.query(By.css('ion-title'));
        expect(el.nativeElement.textContent).toEqual('Add Note');
      });

      it('has the add button label', () => {
        const btn = fixture.debugElement.query(By.css('[data-testid="save-button"]'));
        expect(btn.nativeElement.textContent.trim()).toEqual('Add');
      });
    });

    describe('with a note', () => {
      beforeEach(() => {
        component.note = {
          id: 7,
          brand: 'Lipton',
          name: 'Yellow Label',
          notes: 'Overly acidic, highly tannic flavor',
          rating: 1,
          teaCategoryId: 3,
        };
        fixture.detectChanges();
      });

      it('sets the brand', () => {
        const brand = fixture.debugElement.query(By.css('[data-testid="brand-input"]'));
        expect(brand.nativeElement.value).toEqual('Lipton');
      });

      it('sets the name', () => {
        const name = fixture.debugElement.query(By.css('[data-testid="name-input"]'));
        expect(name.nativeElement.value).toEqual('Yellow Label');
      });

      it('sets the notes', () => {
        const notes = fixture.debugElement.query(By.css('[data-testid="notes-input"]'));
        expect(notes.nativeElement.value).toEqual('Overly acidic, highly tannic flavor');
      });

      it('sets the tea category id', () => {
        const sel = fixture.debugElement.query(By.css('[data-testid="tea-type-select"]'));
        expect(sel.nativeElement.value).toEqual(3);
      });

      it('has the update title', () => {
        const el = fixture.debugElement.query(By.css('ion-title'));
        expect(el.nativeElement.textContent).toEqual('Update Note');
      });

      it('has the update button label', () => {
        const btn = fixture.debugElement.query(By.css('[data-testid="save-button"]'));
        expect(btn.nativeElement.textContent.trim()).toEqual('Update');
      });
    });
  });

  describe('save', () => {
    beforeEach(() => {
      const tastingNotes = TestBed.inject(TastingNotesService);
      (tastingNotes.save as jasmine.Spy).and.returnValue(of(null));
    });

    describe('a new note', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('saves the entered data', () => {
        const tastingNotes = TestBed.inject(TastingNotesService);
        const btn = fixture.debugElement.query(By.css('[data-testid="save-button"]'));
        component.editorForm.controls.brand.setValue('Lipton');
        component.editorForm.controls.name.setValue('Yellow Label');
        component.editorForm.controls.teaCategoryId.setValue(3);
        component.editorForm.controls.rating.setValue(1);
        component.editorForm.controls.notes.setValue('ick');
        click(btn.nativeElement);
        expect(tastingNotes.save).toHaveBeenCalledTimes(1);
        expect(tastingNotes.save).toHaveBeenCalledWith({
          brand: 'Lipton',
          name: 'Yellow Label',
          teaCategoryId: 3,
          rating: 1,
          notes: 'ick',
        });
      });

      it('dismisses the modal', () => {
        const btn = fixture.debugElement.query(By.css('[data-testid="save-button"]'));
        click(btn.nativeElement);
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('an existing note', () => {
      beforeEach(() => {
        component.note = {
          id: 73,
          brand: 'Generic',
          name: 'White Label',
          teaCategoryId: 2,
          rating: 3,
          notes: 'it is ok',
        };
        fixture.detectChanges();
      });

      it('dispatches the save with the data', () => {
        const tastingNotes = TestBed.inject(TastingNotesService);
        const btn = fixture.debugElement.query(By.css('[data-testid="save-button"]'));
        component.editorForm.controls.brand.setValue('Lipton');
        component.editorForm.controls.name.setValue('Yellow Label');
        component.editorForm.controls.teaCategoryId.setValue(3);
        component.editorForm.controls.rating.setValue(1);
        component.editorForm.controls.notes.setValue('ick');
        click(btn.nativeElement);
        expect(tastingNotes.save).toHaveBeenCalledTimes(1);
        expect(tastingNotes.save).toHaveBeenCalledWith({
          id: 73,
          brand: 'Lipton',
          name: 'Yellow Label',
          teaCategoryId: 3,
          rating: 1,
          notes: 'ick',
        });
      });

      it('dismisses the modal', () => {
        const btn = fixture.debugElement.query(By.css('[data-testid="save-button"]'));
        click(btn.nativeElement);
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('close', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('dismisses the modal', () => {
      const btn = fixture.debugElement.query(By.css('[data-testid="cancel-button"]'));
      click(btn.nativeElement);
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
