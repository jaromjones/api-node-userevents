import { userDto } from '../core/userDto';

export class userRepo {

  private _users: userDto[];

  constructor() {
    this._users = [];
  }
 
  get(): userDto[] {
    return this._users;
  }

  save(user: userDto): boolean {
    
    if (this.exists(user.email) == false) {
        this._users.push(user);
        return true;
    }

    return false;

  }

  exists(email: string): boolean {

    // TODO: make this matcher case-insensitive?
    return Object.keys(this._users).some(key => this._users[key].email === email);

  }

}
