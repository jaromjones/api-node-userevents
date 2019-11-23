import { eventDto } from '../core/eventDto';
import { userDto } from '../core/userDto';
import { userEventDto } from '../core/userEventDto';

export class userEventRepo {

  private userEvents: userEventDto[];

  constructor() {
    this.userEvents = [];
  }

  get(email: string, created: Date): userEventDto[]
  {     
    let results = this.userEvents;

    let filterByEmail: boolean = email != null;
    let filterByDate: boolean = created != null;
    
    if (filterByEmail || filterByDate) {

        if (filterByEmail) {
            results = userEventRepo.filterByEmail(results, email); 
        }

        if (filterByDate) {
            results = userEventRepo.filterByDate(results, created); 
        }
    }

    return results;
  }

  save(userEvent: userEventDto): boolean {
    
    this.userEvents.push(userEvent);
    return true;

  }
 
  private static filterByEmail(userEvents: userEventDto[], email: string): userEventDto[] {

    return userEvents.filter(userEvent => userEvent.email === email);

  }

  private static filterByDate(userEvents: userEventDto[], created: Date): userEventDto[] {

    return userEvents.filter(userEvent => userEvent.created >= created);

  }

}