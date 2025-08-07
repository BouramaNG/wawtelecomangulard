import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin_routing.module';
import { ConsoleSyncComponent } from '../admin-esim/console-sync.component';
import { ConsoleConnectComponent } from '../console-connect/console-connect.component';

@NgModule({
  declarations: [ConsoleSyncComponent, ConsoleConnectComponent],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
