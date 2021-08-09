import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-accounts-settings',
  templateUrl: './accounts-settings.component.html',
  styles: [
  ]
})
export class AccountsSettingsComponent implements OnInit {

  constructor(private _settingsService: SettingsService) { }

  ngOnInit(): void {
    this._settingsService.checkCurrentTheme();
  }

  changeTheme( theme: string){
    this._settingsService.changeTheme(theme)
  }

}
