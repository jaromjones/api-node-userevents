import { eventDto } from '../core/eventDto';

export class eventRepo {

  private _events: eventDto[];

  constructor() {
    this._events = [];
  }

  get(): eventDto[]
  {
    return this._events;
  }

  save(event: eventDto): boolean {
    
    if (this.exists(event.type) == false) {
        this._events.push(event);
        return true;
    }

    return false;

  }

  exists(type: string): boolean {

    // TODO: make this matcher case-insensitive?
    return Object.keys(this._events).some(key => this._events[key].type === type);

  }
 
}
