import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-accounts-settings',
  templateUrl: './accounts-settings.component.html',
  styles: [
  ]
})
export class AccountsSettingsComponent implements OnInit {
  
  public linkTheme = document.querySelector('#theme');
  public links!: NodeListOf<Element>; // Esta puesto asi sin declarle valor por que si no no funcionaria, debido a que cuando se llama la propiedad el elemento aun no se ha construido, es por eso que estoy llenando la propiedad links dentro del ngOnInit pues ahi ya si que se creo el elemento.

  constructor() { }

  ngOnInit(): void {
    this.links = document.querySelectorAll('.selector');
    this.checkCurrentTheme();
  }

  changeTheme( theme: string){
    const url = `./assets/css/colors/${theme}.css`

    this.linkTheme?.setAttribute('href',url)
    localStorage.setItem('theme',url)

    this.checkCurrentTheme();
  }

  checkCurrentTheme(){
    this.links.forEach(element => {
      element.classList.remove('working');

      const btnTheme = element.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`
      const currentTheme = this.linkTheme?.getAttribute('href');

      if (btnThemeUrl === currentTheme){
        element.classList.add('working');
      }
    });
  }

}
