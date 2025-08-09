import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventViewPage } from './event-view.page';

describe('EventViewPage', () => {
  let component: EventViewPage;
  let fixture: ComponentFixture<EventViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
