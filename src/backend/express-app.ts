import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as helmet from 'helmet';

/**
 * Creates and configures an ExpressJS web server.
 *
 * @class App
 */
class ExpressApp {

  // ref to Express instance
  public express: express.Application;

  /**
   * Constructor.
   * Run configuration methods on the Express instance.
   *
   * @class App
   * @constructor
   */
  constructor() {
    // create expressjs application
    this.express = express();
    // configure application
    this.middleware();
  }

  /**
   * Configure Express middleware.
   */
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json({ limit: '500mb'}));
    this.express.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
    this.express.use(cors());
    this.express.use(compression());
    this.express.use(helmet());
    this.express.set('title', 'Base Framework Client Service');
  }
}

export default new ExpressApp().express;
