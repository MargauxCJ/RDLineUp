import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import { tap } from 'rxjs/operators';
import {Event} from '../_entities/events/event.model';
import {PaginatedResult} from '../_services/api/api.service';
import {EventService} from '../_services/api/event.service';

@Injectable({
  providedIn: 'root'
})
export class EventsStoreService {
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  private paginationSubject = new BehaviorSubject<{ total: number; page: number; limit: number }>({ total: 0, page: 1, limit: 10 });
  public pagination$ = this.paginationSubject.asObservable();

  constructor(private eventService: EventService) {}

  loadEvents(page: number = 1, limit: number = 10, filters?: { [key: string]: any }): void {
    this.eventService.getAllPaginated(page, limit, 'events', filters).subscribe((result: PaginatedResult<Event>) => {
      this.eventsSubject.next(result.data);
      this.paginationSubject.next({ total: result.total, page: result.page, limit: result.limit });
      console.log(this.eventsSubject);
    });
  }

  updateEvent(id: string, updatedEvent: Partial<Event>): Observable<Event> {
    return this.eventService.updateOne(id, updatedEvent, 'events').pipe(
      switchMap(() => this.eventService.getOne(id, 'events')),
      tap((event: Event) => {
        const events = this.eventsSubject.value;
        const index = events.findIndex(m => m.id === event.id);
        if (index !== -1) {
          events[index] = event;
          this.eventsSubject.next([...events]);
        }
      })
    );
  }

  addEvent(newEvent: Partial<Event>): Observable<Event> {
    return this.eventService.postOne(newEvent, 'events').pipe(
      tap((event: Event) => {
        const events = this.eventsSubject.value;
        console.log(event)
        this.eventsSubject.next([...events, event]);
      })
    );
  }
}
