import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TastingNotesService } from '@app/core';
import { TastingNote } from '@app/models';
import { IonRouterOutlet, IonicModule, ModalController, ModalOptions } from '@ionic/angular';
import { BehaviorSubject, EMPTY, Observable, mergeMap, tap } from 'rxjs';
import { TastingNoteEditorComponent } from './tasting-note-editor/tasting-note-editor.component';

@Component({
  selector: 'app-tasting-notes',
  templateUrl: './tasting-notes.page.html',
  styleUrls: ['./tasting-notes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TastingNoteEditorComponent],
})
export class TastingNotesPage implements OnInit {
  private refresh = new BehaviorSubject<void>(undefined);
  notes$: Observable<Array<TastingNote>> = EMPTY;

  constructor(
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private tastingNotes: TastingNotesService
  ) {}

  ngOnInit() {
    this.notes$ = this.refresh.pipe(mergeMap(() => this.tastingNotes.getAll()));
  }

  newNote(): Promise<void> {
    return this.displayEditor();
  }

  updateNote(note: TastingNote): Promise<void> {
    return this.displayEditor(note);
  }

  async deleteNote(note: TastingNote) {
    this.tastingNotes
      .delete(note.id as number)
      .pipe(tap(() => this.refresh.next()))
      .subscribe();
  }

  private async displayEditor(note?: TastingNote): Promise<void> {
    const opt: ModalOptions = {
      component: TastingNoteEditorComponent,
      backdropDismiss: false,
      presentingElement: this.routerOutlet.nativeEl,
    };
    if (note) {
      opt.componentProps = { note };
    }
    const modal = await this.modalController.create(opt);
    modal.present();
    await modal.onDidDismiss();
    this.refresh.next();
  }
}
