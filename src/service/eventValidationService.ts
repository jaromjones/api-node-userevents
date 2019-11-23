import { eventDto } from "../core/eventDto";

export class eventValidationService {

  validate(event: eventDto): string {

    if (event == null || event.type == null) {
      return 'invalid event';
    }

    if (event.type.trim().length == 0) {
      return 'invalid event code';
    }

    return null;

  }

}
