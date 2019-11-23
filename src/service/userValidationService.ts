import { userDto } from '../core/userDto';

export class userValidationService {

  validate(user: userDto): string {

    if (user == null || (user.phone == null && user.email == null && user.hasPassword == false)) {
      return 'invalid user';
    }

    if (user.email == null || user.email.length == 0 || userValidationService.validateEmail(user.email) == false) {
      return 'invalid user email';
    }

    if (user.hasPassword == false) {
      return 'invalid password';
    }

    if (user.phone != null && user.phone.length > 0 && !user.phone.match(/\d{3}\-\d{3}\-\d{4}/g)) {
      return 'invalid user phone';
    }
    
    return null;
  }

  private static validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}


