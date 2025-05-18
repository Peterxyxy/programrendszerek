import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RegistrationAndLoginComponent } from './components/registration-and-login/registration-and-login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProductComponent } from './components/product/product.component';
import { BasketComponent } from './components/basket/basket.component';

export const routes: Routes = [
  { path: '', redirectTo: 'app/product', pathMatch: 'full' },
  { path: 'app/product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'app/basket', component: BasketComponent, canActivate: [AuthGuard] },
  { path: 'app/login', component: RegistrationAndLoginComponent },
  { path: 'user/profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'app/not-found', component: NotFoundComponent},
  { path: '**', redirectTo: 'app/not-found' }
  // TODO: Add more routes
];