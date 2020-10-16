import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Select } from '@ngxs/store'
import { AuthStatusState } from 'app/modules/auth/store'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { NotificationService } from './../../../shared/services/notification.service'

@AutoUnsubscribe()
@Component({
  selector: 'coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  @Select(AuthStatusState.getEmail) email$: Observable<string>
  isLoading: boolean  // TODO: getIsLoading 
  alreadySubscribed: boolean // TODO : getIsSubscribed
  featureName: string
  
  constructor(private route: ActivatedRoute, private snack: NotificationService) {}
  
  ngOnInit(): void {
    this.isLoading = false
    this.alreadySubscribed = false
    this.route.data.subscribe(e => this.featureName = e.title)
  }

  onclick() {
    // TODO: dispatch action GetNotifyWhanFeatureIsLunch, post featureName in bdd where email 
    this.isLoading = !this.isLoading
    this.alreadySubscribed = !this.alreadySubscribed
    this.snack.openSnackBar('Inscription effectuée avec succès !', '🚀', 4000 )
    this.email$.subscribe(email => {
      console.log(`Simulation ajout en base : l'email ${email} est inscrit aux notifications de lancement du module "${this.featureName}".`)
    })
  }

  ngOnDestroy(): void {
    // because of @AutoUnsubscribe()
  }

}
