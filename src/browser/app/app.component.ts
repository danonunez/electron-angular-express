import { Component } from '@angular/core';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './services/electron.service';
import { Constants } from 'src/common/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = Constants.APP_NAME;

  constructor(private electronService: ElectronService) {
    console.log('AppConfig', AppConfig);

    if (this.electronService.isElectron) {
      const os = this.electronService.remote.require('os');
      console.log(`Running as an Electron app on ${os.platform()} ${os.arch()}.`);
    } else {
      console.warn('App NOT running inside Electron!');
    }
  }
}
