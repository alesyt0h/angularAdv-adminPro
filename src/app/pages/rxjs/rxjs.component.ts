import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter, takeLast } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html'
})
export class RxjsComponent implements OnInit, OnDestroy {

  public intervalSubs!: Subscription;

  constructor() {

    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe(
    //   valor => console.log('Subs:', valor),
    //   error => console.warn('Error:', error),
    //   () => console.info('Obs terminado')
    // );

    this.intervalSubs = this.retornaIntervalo()
        // .subscribe((valor) => console.log(valor))    // Se puede abreviar de la otra manera
        .subscribe(console.log)                         // Funciona igual!!!

  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  ngOnInit(): void {
  }

  retornaIntervalo(): Observable<number>{
    return interval(100)
      .pipe(
        // take(10), // Si se pusiera arriba del todo, al llegar a 10 se pararia, puesto que llegaria el filter y seria false en caso de ser impar, pero aun que no lo vea en la consola, ese valor ya ha sido emitido, si estuviera abajo del filter, al llegar a un impar y ser false, nunca pasaria al take, asi que no se emite nada y tampoco lo cuenta. 
        map( valor => valor + 1), // 0 => 1
        // map( valor => valor + 1), // 1 => 2
        filter(valor => (valor % 2 === 0) ? true : false), // => true deja pasarlo todo, false no deja pasar nada
        
        // Se puede abreviar tal y como esta arriba
        //
        // map( valor => {
        //   return 'Hola mundo ' + (valor + 1);
        // })
      );

    // return intervalo$;  // Se puede abreviar haciendo return interval() sin hacer una constante
  }


  retornaObservable(): Observable<number>{
    let i = -1;

    //return new Observable...
    const obs$ = new Observable<number>(observer => {

      const intervalo = setInterval(()=> {
        i++;

        observer.next(i);

        if ( i === 4) {
          clearInterval(intervalo);
          observer.complete();
        };

        if (i === 2) {
          console.log('i == 2 ... error');
          observer.error('i llego al valor de 2')
        }
      },1000)
    });
    
    return obs$; // Se podria abreviar directamente con un return new Observable en la definicion del observable
  }

  unsub(){
    this.intervalSubs.unsubscribe();
    console.log('Unsubscribed succesfully');
  }

}
