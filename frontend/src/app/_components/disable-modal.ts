import {Component, Input} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {ToastService} from '../_services/toast.service';


@Component({
  template: `
    <ion-grid class="grid-modal">
      <ion-row class="header-modal">
        <div class="header-modal-title">
          <ion-icon name="add-circle" color="primary"></ion-icon>
          <ion-text color="primary">Désactivation</ion-text>
        </div>
        <ion-icon name="close-outline" (click)="cancel()"></ion-icon>
      </ion-row>
      <ion-row>
        Êtes-vous certain(e) de votre action ? Tout changement non sauvegardé au préalable sera supprimé
      </ion-row>
      <ion-row class="footer-modal">
        <ion-button (click)="cancel()"
                    mode="ios"
                    shape="round"
                    size="large"
                    fill="outline"
                    color="primary">Annuler
        </ion-button>
        <ion-button type="submit"
                    mode="ios"
                    fill="solid"
                    size="large"
                    shape="round"
                    (click)="disableEntity()"
                    color="danger">Supprimer
        </ion-button>
      </ion-row>
    </ion-grid>

  `,
  styles: [],
  standalone: true,
  imports: [
    IonicModule,
  ],
})
export class DisableModal {
  constructor(
    private toastService: ToastService,
    private modalController: ModalController,
  ) {
  }

  public cancel(): void {
    this.modalController.dismiss({}, 'cancel').then();
  }

  public disableEntity() {
    this.modalController.dismiss({}, 'confirm').then();
  }
}
