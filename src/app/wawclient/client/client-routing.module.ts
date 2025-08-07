// src/app/client/client-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ForfaitComponent } from '../forfait/forfait.component';


const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {path:'forfait', component:ForfaitComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }