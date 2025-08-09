import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import { tap } from 'rxjs/operators';
import {User} from '../_entities/users/user.model';
import {MemberService} from '../_services/api/member.service';
import {PaginatedResult} from '../_services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class MemberStoreService {
  private membersSubject = new BehaviorSubject<User[]>([]);
  public members$ = this.membersSubject.asObservable();

  private selectedMemberSubject = new BehaviorSubject<User | null>(null);
  public selectedMember$ = this.selectedMemberSubject.asObservable();

  private paginationSubject = new BehaviorSubject<{ total: number; page: number; limit: number }>({ total: 0, page: 1, limit: 10 });
  public pagination$ = this.paginationSubject.asObservable();

  constructor(private memberService: MemberService) {}

  loadMembers(page: number = 1, limit: number = 10, filters?: { [key: string]: any }): void {
    this.memberService.getAllPaginated(page, limit, 'users', filters).subscribe((result: PaginatedResult<User>) => {
      this.membersSubject.next(result.data);
      this.paginationSubject.next({ total: result.total, page: result.page, limit: result.limit });
    });
  }

  updateMember(id: string, updatedMember: Partial<User>): Observable<User> {
    return this.memberService.updateOne(id, updatedMember, 'users').pipe(
      switchMap(() => this.memberService.getOne(id, 'users')),
      tap((member: User) => {
        const members = this.membersSubject.value;
        const index = members.findIndex(m => m.id === member.id);
        if (index !== -1) {
          members[index] = member;
          this.membersSubject.next([...members]);
        }
      })
    );
  }

  loadMember(memberId: string): Observable<User> {
    return this.memberService.getOne(memberId, 'users').pipe(
      tap((member: User) => {
        this.selectedMemberSubject.next(member);
      })
    );
  }

  addMember(newMember: Partial<User>): Observable<User> {
    return this.memberService.postOne(newMember, 'users').pipe(
      tap((member: User) => {
        const members = this.membersSubject.value;
        console.log(member)
        this.membersSubject.next([...members, member]);
      })
    );
  }

  uploadPhoto(userId: string, file: File): Observable<{ imgProfile: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.memberService.uploadProfileImage(userId, formData).pipe(
      tap((res) => {
        // Optionnel : mettre à jour la photo dans le store
        const members = this.membersSubject.value;
        const index = members.findIndex(m => m.id === userId);
        if (index !== -1) {
          members[index].imgProfile = res.imgProfile; // ou le champ correspondant
          this.membersSubject.next([...members]);
        }
      })
    );
  }

  refreshMember(memberId: string): void {
    this.memberService.getOne(memberId, 'users').subscribe((member: User) => {
      const updated = { ...member } as User;
      this.selectedMemberSubject.next(updated);
    });
  }
}
