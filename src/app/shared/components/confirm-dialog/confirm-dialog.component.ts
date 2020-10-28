import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

export interface ConfirmDialogData {
  name: string
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>Etes-vous vraiment sûr ?</h1>
    <div mat-dialog-content>
      <p>Cette action ne pourra pas être annulée.</p>
      <mat-form-field>
        <input matInput [(ngModel)]="userInput">
        <mat-hint>Tapez <span class="text-red">{{ nameUpdated(data.name) }}</span> pour valider</mat-hint>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="close()">Annuler</button>
      <button mat-button color="primary">Supprimer définitivement</button>
    </div>
  `,
  styles: [
  ]
})
export class ConfirmDialogComponent {

  data: ConfirmDialogData
  userInput: string

  constructor(
      private dialogRef: MatDialogRef<ConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) data: ConfirmDialogData )
  {
    this.data = data
  }

  nameUpdated(name: string) {
    if (name.length < 3) {
      return 'delete'
    } else {
      return name.replace(/\s+/g, '-').toLowerCase()
    }
  }

  save() {
      this.dialogRef.close(this.data)
  }

  close() {
      this.dialogRef.close()
  }

}
