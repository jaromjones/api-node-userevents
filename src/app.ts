import * as express from 'express';
import * as bodyParser from 'body-parser';
import config from './config';
import { userDto } from './core/userDto';
import { userValidationService } from './service/userValidationService';
import { userRepo } from './infrastructure/userRepo';
import { userEventRepo } from './infrastructure/userEventRepo';
import { eventDto } from './core/eventDto';
import { eventValidationService } from './service/eventValidationService';
import { logService } from './service/logService';
import { eventRepo } from './infrastructure/eventRepo';
import { userEventDto } from './core/userEventDto';
import { userEventValidationService } from './service/userEventValidationService';

// Creates and configures an ExpressJS web server.
class app {

  private log : logService;

  private eventRepo: eventRepo;
  private userRepo : userRepo;
  private userEventRepo: userEventRepo;

  private eventValidator: eventValidationService;
  private userValidator: userValidationService;
  private userEventValidator: userEventValidationService;

  // ref to Express instance
  public express: express.Application;
 
  //Run configuration methods on the Express instance.
  constructor() {

    // TODO: fiddle with DI pattern or ?

    this.log = new logService();

    this.eventRepo = new eventRepo();
    this.userRepo = new userRepo();
    this.userEventRepo = new userEventRepo();

    this.userValidator = new userValidationService();
    this.eventValidator = new eventValidationService();
    this.userEventValidator = new userEventValidationService(this.eventRepo, this.userRepo);

    // /TODO

    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {

    let router = express.Router();

    // simple uptime check
    router.get('/v1/ping', (req, res, next) => {

      this.log.debug('POST /v1/ping');

      res.json({
        message: 'PONG'
      });

      this.log.debug('POST /v1/ping => OK');

      next()

    });

    router.post('/v1/user', (req, res, next) => {

      let user = new userDto(req.body.email, req.body.password, req.body.phone);

      this.log.debug('POST /v1/user');
      this.log.debug('  email    : ' + user.email);
      this.log.debug('  phone    : ' + user.phone);
      this.log.debug('  password?: ' + user.hasPassword);

      let validationMessage = this.userValidator.validate(user);
      if (validationMessage != null) {
        res.statusCode = 400; // bad request

        res.json({
          message: validationMessage
        });

        this.log.debug('POST /v1/user => BAD REQUEST');

        return; 
      }

      let success = this.userRepo.save(user);
      if (success == false) {
        res.statusCode = 204; // no content
        this.log.warn('  user already exists: ' + user.email);
        this.log.debug('POST /v1/event/user => NOPE');
      } else {
        this.log.debug('POST /v1/user => OK');
      }

      res.end();
      next();

    });

    router.get('/v1/user', (req, res, next) => {

      // TODO: lock down every endpoint? if so, as middleware?
      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 401; // unauthorized
        res.end();
        return;
      }

      this.log.debug('GET /v1/user');

      let users = this.userRepo.get();

      res.json(users);

      this.log.debug('GET /v1/user => OK');

      next();

    });    

    router.post('/v1/event', (req, res, next) => {

      let event = new eventDto(req.body.type);

      this.log.debug('POST /v1/event');
      this.log.debug('  code: ' + event.type);

      let validationMessage = this.eventValidator.validate(event);

      if (validationMessage != null) {
        res.statusCode = 400; // bad request

        res.json({
          message: validationMessage
        });

        this.log.debug('POST /v1/event => BAD REQUEST');

        return;
  
      }

      let success = this.eventRepo.save(event);
      if (success == false) {
        res.statusCode = 204; // no content
        this.log.warn('  event already exists: ' + event.type);
      } else {
        this.log.debug('POST /v1/event => OK');
      }

      res.end();
      next();

    });

    router.get('/v1/event', (req, res, next) => {

      let events = this.eventRepo.get();

      this.log.debug('GET /v1/event');

      res.json(events);

      this.log.debug('GET /v1/event => OK');

      next();

    });    

    router.post('/v1/event/user', (req, res, next) => {

      let userEvent = new userEventDto(req.body.type, new Date(), req.body.email);
     
      this.log.debug('POST /v1/event/user');
      this.log.debug('  type   : ' + userEvent.type);
      this.log.debug('  created: ' + userEvent.created);
      this.log.debug('  email  : ' + userEvent.email);

     let validationMessage = this.userEventValidator.validate(userEvent);
     if (validationMessage != null) {
       res.statusCode = 400; // bad request

       res.json({
         message: validationMessage
       });

       this.log.debug('POST /v1/event/user => BAD REQUEST');

       return; 
     }

      let success = this.userEventRepo.save(userEvent);
      if (success == false) {
        res.statusCode = 204; // no content
        this.log.error('  unable to save event.');
        this.log.debug('POST /v1/event/user => NOPE');
      } else {
        this.log.debug('POST /v1/event/user => OK');
      }

      res.end();
      next();

    });    

    router.get('/v1/event/user', (req, res, next) => {
     
      this.log.debug('GET /v1/event/user');
      this.log.debug('  email  : ' + req.query.email);
      this.log.debug('  created: ' + req.query.created);

      let date = req.query.created ? new Date(req.query.created) : null;
      let userEvents = this.userEventRepo.get(req.query.email, date);

      res.json(userEvents);

      this.log.debug('GET /v1/event/user => OK');

      next();

    });    

    this.express.use('/', router);

  }

}

export default new app().express;
