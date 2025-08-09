import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption, IonText
} from '@ionic/angular/standalone';
import {filter, switchMap} from 'rxjs';
import {User} from 'src/app/_entities/users/user.model';
import {MemberService} from '../../../../_services/api/member.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {addIcons} from 'ionicons';
import {cameraOutline, chevronBack, imageOutline, pencilOutline, trashOutline} from 'ionicons/icons';
import {AuthService} from '../../../../_services/auth/auth.service';
import {TeamService} from '../../../../_services/api/team.service';
import {Team} from '../../../../_entities/teams/team.model';
import {UserRole} from '../../../../_shared/user-role.enum';
import {MemberPosition} from '../../../../_shared/default-position.enum';
import {ToastService} from '../../../../_services/toast.service';
import {MemberStoreService} from '../../../../_stores/members.store';
import {DYNAMIC_ENVIRONMENT, DynamicEnvironment} from '../../../../../environments/dynamic-environment';
import {ModalController} from '@ionic/angular/standalone';
import {DisableModal} from '../../../../_components/disable-modal';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.page.html',
  styleUrls: ['./member-form.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonIcon, RouterLink, IonButton, IonCard, IonGrid, IonRow, IonCol, ReactiveFormsModule, IonInput, IonSelect, IonSelectOption]
})
export class MemberFormPage implements OnInit {
  public apiUrl = this.environment.apiUrl;
  public addOrUpdate: 'add' | 'update';
  public clubTeams: Team[];
  public readonly userRoles = Object.values(UserRole);
  public readonly memberPositions = Object.values(MemberPosition);
  public uploadedFile: File;
  public showDisableModal = false;

  public memberForm = this.formBuilder.group({
    surname: [null as string, [Validators.required]],
    role: [null as string, [Validators.required]],
    email: [null as string, []],
    jerseyNum: [null as string, []],
    photoPreview: [null as string, []],
    teams: this.formBuilder.array([
      this.formBuilder.control(null as string | Team),
    ], []),
    defaultPosition: [null as string, []],
  });

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    protected memberStore: MemberStoreService,
    private toastService: ToastService,
    private router: Router,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef,
    @Inject(DYNAMIC_ENVIRONMENT) protected environment: DynamicEnvironment
  ) {
    addIcons({ chevronBack, imageOutline, cameraOutline, trashOutline, pencilOutline });

    this.authService.currentUser$
      .pipe(
        filter(user => !!user),
        switchMap(user => this.teamService.getTeamsByClub(Number(user.teams[0].club.id)))
      )
      .subscribe(teams => {
        this.clubTeams = teams;
      });

    this.addOrUpdate = this.activatedRoute.snapshot.data['addOrUpdate'] ?? null;
  }

  ngOnInit() {
    if (this.addOrUpdate === 'update') {
      const memberId = this.activatedRoute.snapshot.paramMap.get('memberId');
      this.memberStore.loadMember(memberId).subscribe();

      this.memberStore.selectedMember$
        .pipe(filter(Boolean))
        .subscribe((member: User) => {
          this.memberForm.patchValue({
            ...member,
            photoPreview: member.imgProfile ? `${this.apiUrl}users/profile-image/${member.imgProfile}` : null,
          });

          console.log('photoUrl :', this.memberForm.controls.photoPreview.value);
          console.log('imgProfiel :', member.imgProfile);

          this.teams.clear();
          member.teams.forEach(team => {
            this.teams.push(this.formBuilder.control(team.id));
          });
        });
    }
  }

  public submitMember() {
    if (!this.memberForm.valid) return;

    let teamSelected = this.memberForm.value.teams
      .filter((team: string | Team) => team != null)
      .map((team: string | Team) => ({ id: typeof team === 'object' ? team.id : team }));

    const userId = this.addOrUpdate === 'update'
      ? this.activatedRoute.snapshot.paramMap.get('memberId')
      : null;

    const updateMemberData = (photoUrl?: string) => {
      const updatedMember = {
        ...this.memberForm.value,
        teams: teamSelected,
        imgProfile: photoUrl ?? this.memberForm.value.photoPreview
      } as Partial<User> & { teams: string[] };


      if (this.addOrUpdate === 'update') {
        return this.memberStore.updateMember(userId, updatedMember);
      } else {
        return this.memberStore.addMember(updatedMember);
      }
    };

    const onSuccess = () => {
      this.router.navigate(['/members']);
      this.toastService.presentToast(
        this.addOrUpdate === 'update'
          ? 'Joueur.euse modifié.e avec succès'
          : 'Joueur.euse ajouté.e avec succès'
      );
    };

    if (this.uploadedFile && userId) {
      this.memberStore.uploadPhoto(userId, this.uploadedFile).pipe(
        switchMap(res => updateMemberData(res.imgProfile))
      ).subscribe({
        next: onSuccess,
        error: (error) => this.toastService.displayError(error),
      });
    } else {
      updateMemberData().subscribe({
        next: onSuccess,
        error: (error) => this.toastService.displayError(error),
      });
    }
  }
  public get teams(): FormArray {
    return this.memberForm.get('teams') as FormArray;
  }

  public addTeam(): void {
    this.teams.push(this.formBuilder.control(''));
  }

  public removeTeam(i: number): void {
    this.teams.removeAt(i);
  }

  public getAvailableTeams(index: number): any[] {
    const selectedIds = this.teams.controls
      .map((ctrl, i) => i !== index ? ctrl.value : null)
      .filter((val) => val !== null);

    return this.clubTeams?.filter(team => !selectedIds.includes(team.id));
  }

  public hasAvailableTeams(): boolean {
    const selectedIds = this.teams.controls.map(ctrl => ctrl.value);
    return  this.clubTeams ? this.clubTeams?.some(team => !selectedIds.includes(team.id)): false;
  }

  public handleUpload(event: Event): void {
    this.uploadedFile = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.uploadedFile);
    reader.onload = () => {
      this.memberForm.get('photoPreview').setValue(reader.result as string);
    };
  }

  public deleteUploadPhoto() {
    this.memberForm.controls.photoPreview.setValue(null);
  }

  public async openDisableModal(){
    const modal = await this.modalController.create({
      component: DisableModal,
      cssClass: 'fit-content-modal',
    })

    modal.present().then();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.memberStore.updateMember(this.activatedRoute.snapshot.paramMap.get('memberId'), {enabled: false}).subscribe({
          next: () => {
            this.toastService.presentToast('Joueur.euse désactivé.e');
            this.memberStore.refreshMember(this.activatedRoute.snapshot.paramMap.get('memberId'));
            this.router.navigate(['/members'])
          } ,
          error: (error) => this.toastService.displayError(error),
        }
      );
    }
  }

  public enableMember() {
    this.memberStore.updateMember(this.activatedRoute.snapshot.paramMap.get('memberId'), {enabled: true}).subscribe({
        next: () => {
          this.toastService.presentToast('Joueur.euse désactivé.e');
          this.memberStore.refreshMember(this.activatedRoute.snapshot.paramMap.get('memberId'));
        } ,
        error: (error) => this.toastService.displayError(error),
      }
    );
  }
}
