import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {PreferredShopsComponent} from './preferred-shops/preferred-shops.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'preferred-shops', component: PreferredShopsComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
