import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { PagesRoutingModule } from './pages/pages-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module'; 

import { NopagefoundComponent } from './nopagefound/nopagefound.component';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./pages/pages.module').then( m => m.PagesModule)},

  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  declarations: [],
  imports: [ 
    RouterModule.forRoot(routes),
    // PagesRoutingModule,
    AuthRoutingModule,
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
