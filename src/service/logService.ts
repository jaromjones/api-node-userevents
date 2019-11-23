export class logService {

  debug(message: any): void {

    console.log("[DEBUG] " + message);

  }

  warn(message: any): void {

    console.log("[WARN]  " + message);

  }

  error(message: any): void {

    console.log("[ERRPR] " + message);

  }

}
