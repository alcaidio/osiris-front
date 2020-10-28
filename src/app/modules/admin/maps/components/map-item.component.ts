import { Component, Input, ViewEncapsulation } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component'
import { TreoAnimations } from './../../../../../@treo/animations/public-api'
import { MapCard } from './../models/maps.model'

@Component({
  selector: 'app-map-item',
  encapsulation: ViewEncapsulation.None,
  animations: TreoAnimations,
  template: `
    <treo-card class="flex flex-col w-full" @fadeIn>
        <div class="overflow-hidden">
            <a [routerLink]="card.link">
                <img *ngIf="card.image && !imageError" class="object-cover zoom h-48" [src]="card.image" (error)="onImageLoadError()">
                <img *ngIf="!card.image || imageError" class="object-cover h-48" src="assets/images/pages/maps/no-image.png">
            </a>
        </div>
        <div class="m-6 z-0">
            <div class="flex justify-between">
                <div class="flex flex-col">
                    <!-- <div class="text-secondary text-md">FURNISHED MANSION</div> add -mt-2 en bas -->
                    <div class="text-xl font-semibold leading-tight mt-1">
                        <a [routerLink]="card.link" class="link">
                            {{ card.title }}
                        </a>
                    </div>
                    <div class="text-secondary text-md mt-1">{{ card.subtitle }}</div>
                </div>
                <button class="-mr-2" mat-icon-button [matMenuTriggerFor]="mapCardAction">
                    <mat-icon class="text-secondary icon-size-20 z-40" [svgIcon]="'mat_outline:more_vert'"></mat-icon>
                </button>
            </div>
            <mat-menu #mapCardAction yPosition="above" xPosition="before">
                <!-- TODO: add actions -->
                <button mat-menu-item (click)="true">
                    <mat-icon matPrefix [svgIcon]="'edit'" class="icon-size-18"></mat-icon> 
                    Edit
                </button>
                <button mat-menu-item (click)="deleteMapItem(card.title)">
                    <mat-icon matPrefix [svgIcon]="'delete'" class="icon-size-18"></mat-icon> 
                    Delete
                </button>
            </mat-menu>
        </div>
    </treo-card>
  `, 
  styles: [`
    .zoom {
        transition: transform 300ms;
    }
    .zoom:hover {
        transform: scale(1.25)
    }
  `]
})
export class MapItemComponent {
    @Input() card: MapCard
    imageError = false 

    constructor(private dialog: MatDialog) {}

    onImageLoadError() {
        this.imageError = true
    }

    deleteMapItem(name: string) {
        const dialogConfig = new MatDialogConfig()
        dialogConfig.disableClose = false
        dialogConfig.autoFocus = false
        dialogConfig.width = '400px'
        dialogConfig.data = { name }
        const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig)
        dialogRef.afterClosed().subscribe(
            val => console.log('Dialog output:', val)
        )
    }
}
