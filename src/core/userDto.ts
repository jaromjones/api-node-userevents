export class userDto {

  email: string;
  password: string;
  phone: string;

  constructor(email: string, password: string, phone: string) {
    this.email = email;
    this.password = password;
    this.phone = phone;
  }

  get hasPassword(): boolean {
    return this.password != null && this.password.trim().length > 0;
  }
  
}
