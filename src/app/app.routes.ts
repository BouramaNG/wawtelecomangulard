import { Routes } from '@angular/router';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AproposComponent } from './client/apropos/apropos.component';
import { ContactComponent } from './client/contact/contact.component';
import { BoutiqueComponent } from './client/boutique/boutique.component';
import { CloudComponent} from './client/cloud/cloud.component';
import { ConnectiviteComponent} from './client/connectivite/connectivite.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { ESimComponent } from './client/e-sim/e-sim.component';
import { CheckoutComponent } from './client/checkout/checkout.component';
import { authGuard } from './garde/auth.guard';
import { ErreurComponent } from './erreur/erreur.component';
import { PeerComponent } from './client/peer/peer.component';

export const routes: Routes = [
    {path:'', component:AccueilComponent},
    { path: 'admin', loadChildren: () => import('./Admin/admin/admin.module').then(m => m.AdminModule), canActivate:[authGuard] },
    {path:'a_propos', component:AproposComponent},
    {path:'contact', component:ContactComponent},
    {path:'travel', component: BoutiqueComponent},
    {path: 'cloud', component:CloudComponent},
    {path:'connectivite', component: ConnectiviteComponent},
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    {path:'eSim/:id', component: ESimComponent},
    {path:'checkout', component: CheckoutComponent},
    {path:'peer', component: PeerComponent},
    {
        path: 'client',
        loadChildren: () => import('./wawclient/client/client.module').then(m => m.ClientModule)
      },
      {path:'**', component:ErreurComponent}

];
