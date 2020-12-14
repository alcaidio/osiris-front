import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { delay, map } from 'rxjs/operators'
import { UserSettings } from '../models/settings.model'

@Injectable()
export class SettingsService {
  constructor(private http: HttpClient) {}

  // Get email with the current state in the store.
  //
  getUserSettings(email: string): Observable<UserSettings> {
    return this.http.get<UserSettings>(`assets/mock/user/settings.json`).pipe(
      map((res) => {
        if (res[email]) {
          return res[email]
        } else {
          console.log('Email not found')
        }
      }),
      delay(400)
    )
  }

  patchUserSettings(change: Partial<UserSettings>) {
    // patch request to change USERSETTINGS
  }

  uploadAvatar(id: string, avatar: File): void {
    // see treo/treo-demo-v1.0.2/src/app/modules/admin/apps/contacts/details/details.component.ts
    console.log('Upload, avatar and change active image')
  }
}
