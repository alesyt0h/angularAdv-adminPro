import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { filter,map  } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo: string = '';
  public tituloSubs$!: Subscription;

  constructor(private _router: Router, private _route: ActivatedRoute) {  //ActivatedRoute Not Being Used

    // console.log(_route.snapshot.children[0].data); //No cambiaria de valor al navegar a otra pagina pues la ruta padre no cambia en ningun momento.
    

    this.tituloSubs$ = this.getDataRoute()
        .subscribe(({titulo}) => {
          this.titulo = titulo
          document.title = `AdminPro - ${titulo}`
        });
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
    // console.log('unsubscribed')
  }

  getDataRoute(){
    return this._router.events
      .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event:ActivationEnd) => event.snapshot.firstChild === null ),
        map((event:ActivationEnd) => event.snapshot.data),
      );
      
  }

}
