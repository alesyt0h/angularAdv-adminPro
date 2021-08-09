import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

declare function customInitFunctions(): void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  

  constructor(private _settingsService: SettingsService) { }

  ngOnInit(): void {

    customInitFunctions();

    // His method

    // const url = localStorage.getItem('theme') || './assets/css/colors/default-dark.css';
    // this._settingsService.linkTheme?.setAttribute('href', url)

    // My Method
    //
    // let theme = localStorage.getItem('theme')
    // if (!theme){
    //   theme = `./assets/css/colors/default-dark.css`
    // }

    // const linkTheme = document.querySelector('#theme');
    // linkTheme?.setAttribute('href', theme)
    // localStorage.setItem('theme', theme)
  
  }

}
