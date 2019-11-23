import { eventDto } from "./eventDto";
import { userDto } from "./userDto";

export class userEventDto {

  type: string;
  created: Date;
  email: string;

  constructor(eventCode: string, created: Date, email: string) {
    this.type = eventCode;
    this.created = created;
    this.email = email;
  }
  
}
