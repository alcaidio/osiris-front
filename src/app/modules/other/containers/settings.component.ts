import { Component, OnDestroy, OnInit } from '@angular/core'
import { TreoMediaWatcherService } from '@treo/services/media-watcher'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-settings',
  template: `
    <div class="content-layout left-sidebar-fullheight-standard-inner-scroll">
      <mat-drawer-container>
        <!-- Drawer -->
        <mat-drawer [autoFocus]="false" [mode]="drawerMode" [opened]="drawerOpened" #matDrawer>
          <!-- Demo sidebar content -->
          <sidebar-settings></sidebar-settings>
        </mat-drawer>

        <mat-drawer-content>
          <!-- Header -->
          <div class="header" *ngIf="drawerMode === 'over'">
            <div class="left">
              <div class="breadcrumb">
                <span class="path">Settings</span>
                <span class="separator">/</span>
                <span class="path">Account</span>
              </div>
              <h1>Your profile</h1>
            </div>

            <div class="absolute right-0">
              <!-- Drawer toggle -->
              <button class="mr-6" mat-stroked-button (click)="matDrawer.toggle()">
                <mat-icon class="icon-size-18" [svgIcon]="'menu_open'"></mat-icon>
                <span class="ml-2 xs:hidden">Menu</span>
              </button>
            </div>
          </div>
          <!-- Main -->
          <div class="main">
            <!-- Demo content -->
            <router-outlet></router-outlet>
          </div>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
export class SettingsComponent implements OnInit, OnDestroy {
  drawerMode: 'over' | 'side'
  drawerOpened: boolean
  subs: Subscription

  constructor(private _treoMediaWatcherService: TreoMediaWatcherService) {
    // Set the defaults
    this.drawerMode = 'side'
    this.drawerOpened = true
  }

  ngOnInit(): void {
    // Subscribe to media changes
    this.subs = this._treoMediaWatcherService.onMediaChange$.subscribe(({ matchingAliases }) => {
      // Check if the breakpoint is 'lt-md'
      if (matchingAliases.includes('lt-md')) {
        this.drawerMode = 'over'
        this.drawerOpened = false
      } else {
        this.drawerMode = 'side'
        this.drawerOpened = true
      }
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
