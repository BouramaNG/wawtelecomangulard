import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { DashboardOverviewComponent } from "../dashboard-overview/dashboard-overview.component";
import { CompteComponent } from "../compte/compte.component";
import { AdminEsimComponent } from "../admin-esim/admin-esim.component";
import { OffreComponent } from "../offre/offre.component";
import { CommandeComponent } from "../commande/commande.component";
import { ConsoleSyncComponent } from "../admin-esim/console-sync.component";
import { DestinationsComponent } from "../destinations/destinations.component";
import { EsimAdminComponent } from "../admin-esim/esim-admin.component";
import { ConsoleConnectComponent } from "../console-connect/console-connect.component";
import { AdminTemplateCreateComponent } from "../template/admin-template-create/admin-template-create.component";
import { DestinationCreateComponent } from "../destination-create/destination-create.component";

const routes : Routes=[
    {path:'' ,component:DashboardComponent , children:[
        {path:'' , component:DashboardOverviewComponent},
        {path:'compte' , component:CompteComponent},
        {path:'admin_eSim/:id' , component:AdminEsimComponent},
        {path:'offre' , component:OffreComponent},
        {path:'commande' , component:CommandeComponent},
        {path:'console-sync' , component:ConsoleSyncComponent},
        {path:'destinations' , component:DestinationsComponent},
        {path:'destinations/create' , component:DestinationCreateComponent},
        {path:'esims' , component:EsimAdminComponent},
        {path:'console-connect' , component:ConsoleConnectComponent},
        {path:'template-create' , component:AdminTemplateCreateComponent},
]}  
];

@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]

})
export class AdminRoutingModule{}