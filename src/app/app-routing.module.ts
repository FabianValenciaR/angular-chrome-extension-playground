import { ShareComponent } from './components/share/share.component';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CopyCustomUrlComponent } from './components/copy-custom-url/copy-custom-url.component';
import { CopyCollectionUrlComponent } from './components/copy-collection-url/copy-collection-url.component';
import { ShareCollectionUrlComponent } from './components/share-collection-url/share-collection-url.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'share', component: ShareComponent, canActivate: [AuthGuard] },
  { path: 'share-collection', component: ShareCollectionUrlComponent, canActivate: [AuthGuard] },
  { path: 'copy-url', component: CopyCustomUrlComponent, canActivate: [AuthGuard] },
  { path: 'copy-collection-url', component: CopyCollectionUrlComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
