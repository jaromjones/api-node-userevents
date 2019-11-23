import { eventRepo } from '../infrastructure/eventRepo';
import { userRepo } from '../infrastructure/userRepo';
import { userEventDto } from '../core/userEventDto';

export class userEventValidationService {

  private eventRepo: eventRepo;
  private userRepo: userRepo;

  constructor(eventRepo: eventRepo, userRepo: userRepo) {

    this.eventRepo = eventRepo;
    this.userRepo = userRepo;

  }

  validate(userEvent: userEventDto): string {

    if (userEvent == null || (userEvent.email == null && userEvent.type)) {
      return 'invalid user event';
    }

    if (this.userRepo.exists(userEvent.email) == false) {
      return 'invalid user';
    }

    if (this.eventRepo.exists(userEvent.type) == false) {
      return 'invalid event';
    }
    
    return null;
  }

}


