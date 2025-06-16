import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainNavPage } from './main-nav.page';

describe('MainNavPage', () => {
  let component: MainNavPage;
  let fixture: ComponentFixture<MainNavPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
