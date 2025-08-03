import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberFormPage } from './member-form.page';

describe('MemberFormPage', () => {
  let component: MemberFormPage;
  let fixture: ComponentFixture<MemberFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
