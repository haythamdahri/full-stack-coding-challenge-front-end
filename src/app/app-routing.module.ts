import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {PreferredShopsComponent} from './preferred-shops/preferred-shops.component';
import {AuthGuard} from './shared/auth/auth-guard.service';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LoginComponent} from './login/login.component';
import {AuthenticatedGuard} from './shared/auth/authenticated-guard.service';


/**
 * Application routes
 */
const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'login', component: LoginComponent, canActivate: [AuthenticatedGuard]
  },
  {
    path: 'signup', component: SignUpComponent, canActivate: [AuthenticatedGuard]
  },
  {
    path: 'preferred-shops', component: PreferredShopsComponent, canActivate: [AuthGuard]
  },
  {
    path: '**', component: NotFoundComponent
  }
];

/**
 * Routing Module class
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
