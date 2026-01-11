import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../partials/header/header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EsimService } from '../../services/esim.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SpaceNumberPipe } from '../../shared/pipes/space-number.pipe';
import { DataSizePipe } from '../../shared/pipes/data-size.pipe';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderService } from '../../services/order.service';
import { EncryptionService } from '../../services/encryption.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-e-sim',
  standalone: true,
  imports: [HeaderComponent, RouterLink, CommonModule, TranslateModule, SpaceNumberPipe, DataSizePipe, FormsModule, NgSelectModule],
  templateUrl: './e-sim.component.html',
  styleUrl: './e-sim.component.css'
})
export class ESimComponent  implements OnInit{
  paysChoisi: { id: number; nom: string; drapeau: string; continent: string; code:string} | undefined;
  selectedEsim: any;
  showOumrahModal = false;
  loadingPackages = false;
  showCheckoutModal = false;
  email: any;
  phone: any;
  user: any;
  selectedIndicatif: any = '+221';
  comande: any;
  idOrder: any;
  
  indicatifs = [
    { "ind": "+33", "drapeau": "https://flagcdn.com/w320/fr.png" },
    { "ind": "+221", "drapeau": "https://flagcdn.com/w320/sn.png" },
    { "ind": "+212", "drapeau": "https://flagcdn.com/w320/ma.png" },
    { "ind": "+1", "drapeau": "https://flagcdn.com/w320/us.png" },
    { "ind": "+34", "drapeau": "https://flagcdn.com/w320/es.png" },
    { "ind": "+39", "drapeau": "https://flagcdn.com/w320/it.png" },
    { "ind": "+44", "drapeau": "https://flagcdn.com/w320/gb.png" },
    { "ind": "+225", "drapeau": "https://flagcdn.com/w320/ci.png" },
    { "ind": "+254", "drapeau": "https://flagcdn.com/w320/ke.png" },
    { "ind": "+27", "drapeau": "https://flagcdn.com/w320/za.png" },
  ];
  
  constructor(
    private route:ActivatedRoute, 
    private esimService:EsimService, 
    private router:Router,
    private orderService: OrderService,
    private encryptionService: EncryptionService
  ){}
  pays=[
    {
      "id": 0,
      "nom": "PeleriConnect",
      "drapeau": "https://flagcdn.com/w320/va.png",
      "continent": "Europe",
      "code": "PC"
    },
    {
      "id": 1,
      "nom": "France",
      "drapeau": "https://flagcdn.com/w320/fr.png",
      "continent": "Europe",
      "code":"FR"
    },
    {
      "id": 2,
      "nom": "Maroc",
      "drapeau": "https://flagcdn.com/w320/ma.png",
      "continent": "Afrique",
      "code":"MA"
    },
    {
      "id": 3,
      "nom": "États-Unis",
      "drapeau": "https://flagcdn.com/w320/us.png",
      "continent": "Amerique du Nord",
      "code":"US"
    },
    {
      "id": 14,
      "nom": "Japon",
      "drapeau": "https://flagcdn.com/w320/jp.png",
      "continent": "Asie",
      "code": "JP"
    },
    {
      "id": 4,
      "nom": "Espagne",
      "drapeau": "https://flagcdn.com/w320/es.png",
      "continent": "Europe",
      "code":"ES"
    },
    {
      "id": 5,
      "nom": "Italie",
      "drapeau": "https://flagcdn.com/w320/it.png",
      "continent": "Europe",
      "code":"IT"
    },
    {
      "id": 6,
      "nom": "Saoudite Arabia",
      "drapeau": "https://flagcdn.com/w320/sa.png",
      "continent": "Asie",
      "code":"SA"
    },
    {
      "id": 7,
      "nom": "Turquie",
      "drapeau": "https://flagcdn.com/w320/tr.png",
      "continent": "Europe",
      "code":"TR"
    },
    {
      "id": 8,
      "nom": "Chine",
      "drapeau": "https://flagcdn.com/w320/cn.png",
      "continent": "Asie",
      "code":"CN"
    },
    {
      "id": 9,
      "nom": "Afrique du Sud",
      "drapeau": "https://flagcdn.com/w320/za.png",
      "continent": "Afrique",
      "code":"ZA"
    },
    {
      "id": 10,
      "nom": "Royaume-Uni",
      "drapeau": "https://flagcdn.com/w320/gb.png",
      "continent": "Europe",
      "code":"GB"
    },
    {
      "id": 11,
      "nom": "Côte d'Ivoire",
      "drapeau": "https://flagcdn.com/w320/ci.png",
      "continent": "Afrique",
      "code":"CI"
    },
    {
      "id": 12,
      "nom": "Canada",
      "drapeau": "https://flagcdn.com/w320/ca.png",
      "continent": "Amerique du Nord",
      "code":"CA"
    },
    {
      "id": 13,
      "nom": "Kenya",
      "drapeau": "https://flagcdn.com/w320/ke.png",
      "continent": "Afrique",
      "code":"KE"
    },
    {
      "id": 14,
      "nom": "Allemagne",
      "drapeau": "https://flagcdn.com/w320/de.png",
      "continent": "Europe",
      "code": "DE"
    },
    {
      "id": 15,
      "nom": "Brésil",
      "drapeau": "https://flagcdn.com/w320/br.png",
      "continent": "Amérique du Sud",
      "code": "BR"
    },
    {
      "id": 16,
      "nom": "Argentine",
      "drapeau": "https://flagcdn.com/w320/ar.png",
      "continent": "Amérique du Sud",
      "code": "AR"
    },
    {
      "id": 17,
      "nom": "Australie",
      "drapeau": "https://flagcdn.com/w320/au.png",
      "continent": "Océanie",
      "code": "AU"
    },
    {
      "id": 18,
      "nom": "Japon",
      "drapeau": "https://flagcdn.com/w320/jp.png",
      "continent": "Asie",
      "code": "JP"
    },
    {
      "id": 19,
      "nom": "Mexique",
      "drapeau": "https://flagcdn.com/w320/mx.png",
      "continent": "Amérique du Nord",
      "code": "MX"
    },
    {
      "id": 20,
      "nom": "Inde",
      "drapeau": "https://flagcdn.com/w320/in.png",
      "continent": "Asie",
      "code": "IN"
    },
    {
      "id": 21,
      "nom": "Russie",
      "drapeau": "https://flagcdn.com/w320/ru.png",
      "continent": "Europe/Asie",
      "code": "RU"
    },
    {
      "id": 22,
      "nom": "Portugal",
      "drapeau": "https://flagcdn.com/w320/pt.png",
      "continent": "Europe",
      "code": "PT"
    },
    {
      "id": 23,
      "nom": "Corée du Sud",
      "drapeau": "https://flagcdn.com/w320/kr.png",
      "continent": "Asie",
      "code": "KR"
    },
    {
      "id": 24,
      "nom": "Égypte",
      "drapeau": "https://flagcdn.com/w320/eg.png",
      "continent": "Afrique",
      "code": "EG"
    },
    {
      "id": 25,
      "nom": "Nigeria",
      "drapeau": "https://flagcdn.com/w320/ng.png",
      "continent": "Afrique",
      "code": "NG"
    },
    {
      "id": 26,
      "nom": "Thaïlande",
      "drapeau": "https://flagcdn.com/w320/th.png",
      "continent": "Asie",
      "code": "TH"
    },
    {
      "id": 27,
      "nom": "Suède",
      "drapeau": "https://flagcdn.com/w320/se.png",
      "continent": "Europe",
      "code": "SE"
    },
    {
      "id": 28,
      "nom": "Norvège",
      "drapeau": "https://flagcdn.com/w320/no.png",
      "continent": "Europe",
      "code": "NO"
    },
    {
      "id": 29,
      "nom": "Suisse",
      "drapeau": "https://flagcdn.com/w320/ch.png",
      "continent": "Europe",
      "code": "CH"
    },
    {
      "id": 30,
      "nom": "Pologne",
      "drapeau": "https://flagcdn.com/w320/pl.png",
      "continent": "Europe",
      "code": "PL"
    },
    {
      "id": 31,
      "nom": "Indonésie",
      "drapeau": "https://flagcdn.com/w320/id.png",
      "continent": "Asie",
      "code": "ID"
    },
    {
      "id": 32,
      "nom": "Pakistan",
      "drapeau": "https://flagcdn.com/w320/pk.png",
      "continent": "Asie",
      "code": "PK"
    },
    {
      "id": 33,
      "nom": "Grèce",
      "drapeau": "https://flagcdn.com/w320/gr.png",
      "continent": "Europe",
      "code": "GR"
    },
    {
      "id": 34,
      "nom": "Finlande",
      "drapeau": "https://flagcdn.com/w320/fi.png",
      "continent": "Europe",
      "code": "FI"
    },
    {
      "id": 35,
      "nom": "Danemark",
      "drapeau": "https://flagcdn.com/w320/dk.png",
      "continent": "Europe",
      "code": "DK"
    },
    {
      "id": 36,
      "nom": "Belgique",
      "drapeau": "https://flagcdn.com/w320/be.png",
      "continent": "Europe",
      "code": "BE"
    },
    {
      "id": 37,
      "nom": "Autriche",
      "drapeau": "https://flagcdn.com/w320/at.png",
      "continent": "Europe",
      "code": "AT"
    },
    {
      "id": 38,
      "nom": "Pays-Bas",
      "drapeau": "https://flagcdn.com/w320/nl.png",
      "continent": "Europe",
      "code": "NL"
    },
    {
      "id": 39,
      "nom": "Hongrie",
      "drapeau": "https://flagcdn.com/w320/hu.png",
      "continent": "Europe",
      "code": "HU"
    },
    {
      "id": 40,
      "nom": "Irlande",
      "drapeau": "https://flagcdn.com/w320/ie.png",
      "continent": "Europe",
      "code": "IE"
    },
    {
      "id": 41,
      "nom": "Tchéquie",
      "drapeau": "https://flagcdn.com/w320/cz.png",
      "continent": "Europe",
      "code": "CZ"
    },
    {
      "id": 42,
      "nom": "Roumanie",
      "drapeau": "https://flagcdn.com/w320/ro.png",
      "continent": "Europe",
      "code": "RO"
    },
    {
      "id": 43,
      "nom": "Bulgarie",
      "drapeau": "https://flagcdn.com/w320/bg.png",
      "continent": "Europe",
      "code": "BG"
    },
    {
      "id": 44,
      "nom": "Philippines",
      "drapeau": "https://flagcdn.com/w320/ph.png",
      "continent": "Asie",
      "code": "PH"
    },
    {
      "id": 45,
      "nom": "Viêt Nam",
      "drapeau": "https://flagcdn.com/w320/vn.png",
      "continent": "Asie",
      "code": "VN"
    },
    {
      "id": 46,
      "nom": "Malaisie",
      "drapeau": "https://flagcdn.com/w320/my.png",
      "continent": "Asie",
      "code": "MY"
    },
    {
      "id": 47,
      "nom": "Singapour",
      "drapeau": "https://flagcdn.com/w320/sg.png",
      "continent": "Asie",
      "code": "SG"
    },
    {
      "id": 48,
      "nom": "Bangladesh",
      "drapeau": "https://flagcdn.com/w320/bd.png",
      "continent": "Asie",
      "code": "BD"
    },
    {
      "id": 49,
      "nom": "Colombie",
      "drapeau": "https://flagcdn.com/w320/co.png",
      "continent": "Amérique du Sud",
      "code": "CO"
    },
    {
      "id": 50,
      "nom": "Chili",
      "drapeau": "https://flagcdn.com/w320/cl.png",
      "continent": "Amérique du Sud",
      "code": "CL"
    },
    {
      "id": 51,
      "nom": "Pérou",
      "drapeau": "https://flagcdn.com/w320/pe.png",
      "continent": "Amérique du Sud",
      "code": "PE"
    },
    {
      "id": 52,
      "nom": "Venezuela",
      "drapeau": "https://flagcdn.com/w320/ve.png",
      "continent": "Amérique du Sud",
      "code": "VE"
    },
    {
      "id": 53,
      "nom": "Nouvelle-Zélande",
      "drapeau": "https://flagcdn.com/w320/nz.png",
      "continent": "Océanie",
      "code": "NZ"
    },
    {
      "id": 54,
      "nom": "Argentine",
      "drapeau": "https://flagcdn.com/w320/ar.png",
      "continent": "Amérique du Sud",
      "code": "AR"
    },
    {
      "id": 55,
      "nom": "Brésil",
      "drapeau": "https://flagcdn.com/w320/br.png",
      "continent": "Amérique du Sud",
      "code": "BR"
    },
    {
      "id": 56,
      "nom": "Paraguay",
      "drapeau": "https://flagcdn.com/w320/py.png",
      "continent": "Amérique du Sud",
      "code": "PY"
    },
    {
      "id": 57,
      "nom": "Uruguay",
      "drapeau": "https://flagcdn.com/w320/uy.png",
      "continent": "Amérique du Sud",
      "code": "UY"
    },
    {
      "id": 58,
      "nom": "Bolivie",
      "drapeau": "https://flagcdn.com/w320/bo.png",
      "continent": "Amérique du Sud",
      "code": "BO"
    },
    {
      "id": 59,
      "nom": "Équateur",
      "drapeau": "https://flagcdn.com/w320/ec.png",
      "continent": "Amérique du Sud",
      "code": "EC"
    },
    {
      "id": 60,
      "nom": "Guyana",
      "drapeau": "https://flagcdn.com/w320/gy.png",
      "continent": "Amérique du Sud",
      "code": "GY"
    },
    {
      "id": 61,
      "nom": "Suriname",
      "drapeau": "https://flagcdn.com/w320/sr.png",
      "continent": "Amérique du Sud",
      "code": "SR"
    },
    {
      "id": 62,
      "nom": "Panama",
      "drapeau": "https://flagcdn.com/w320/pa.png",
      "continent": "Amérique centrale",
      "code": "PA"
    },
    {
      "id": 63,
      "nom": "Costa Rica",
      "drapeau": "https://flagcdn.com/w320/cr.png",
      "continent": "Amérique centrale",
      "code": "CR"
    },
    {
      "id": 64,
      "nom": "Guatemala",
      "drapeau": "https://flagcdn.com/w320/gt.png",
      "continent": "Amérique centrale",
      "code": "GT"
    },
    {
      "id": 65,
      "nom": "Honduras",
      "drapeau": "https://flagcdn.com/w320/hn.png",
      "continent": "Amérique centrale",
      "code": "HN"
    },
    {
      "id": 66,
      "nom": "El Salvador",
      "drapeau": "https://flagcdn.com/w320/sv.png",
      "continent": "Amérique centrale",
      "code": "SV"
    },
    {
      "id": 67,
      "nom": "Nicaragua",
      "drapeau": "https://flagcdn.com/w320/ni.png",
      "continent": "Amérique centrale",
      "code": "NI"
    },
    {
      "id": 68,
      "nom": "Cuba",
      "drapeau": "https://flagcdn.com/w320/cu.png",
      "continent": "Caraïbes",
      "code": "CU"
    },
    {
      "id": 69,
      "nom": "Jamaïque",
      "drapeau": "https://flagcdn.com/w320/jm.png",
      "continent": "Caraïbes",
      "code": "JM"
    },
    {
      "id": 70,
      "nom": "Haïti",
      "drapeau": "https://flagcdn.com/w320/ht.png",
      "continent": "Caraïbes",
      "code": "HT"
    },
    {
      "id": 71,
      "nom": "Dominique",
      "drapeau": "https://flagcdn.com/w320/dm.png",
      "continent": "Caraïbes",
      "code": "DM"
    },
    {
      "id": 72,
      "nom": "Trinité-et-Tobago",
      "drapeau": "https://flagcdn.com/w320/tt.png",
      "continent": "Caraïbes",
      "code": "TT"
    },
    {
      "id": 73,
      "nom": "Bahamas",
      "drapeau": "https://flagcdn.com/w320/bs.png",
      "continent": "Caraïbes",
      "code": "BS"
    },
    {
      "id": 74,
      "nom": "Barbade",
      "drapeau": "https://flagcdn.com/w320/bb.png",
      "continent": "Caraïbes",
      "code": "BB"
    },
    {
      "id": 75,
      "nom": "Grenade",
      "drapeau": "https://flagcdn.com/w320/gd.png",
      "continent": "Caraïbes",
      "code": "GD"
    },
    {
      "id": 76,
      "nom": "Saint-Christophe-et-Niévès",
      "drapeau": "https://flagcdn.com/w320/kn.png",
      "continent": "Caraïbes",
      "code": "KN"
    },
    {
      "id": 77,
      "nom": "Saint-Vincent-et-les-Grenadines",
      "drapeau": "https://flagcdn.com/w320/vc.png",
      "continent": "Caraïbes",
      "code": "VC"
    },
    {
      "id": 78,
      "nom": "Sainte-Lucie",
      "drapeau": "https://flagcdn.com/w320/lc.png",
      "continent": "Caraïbes",
      "code": "LC"
    },
    {
      "id": 79,
      "nom": "Belize",
      "drapeau": "https://flagcdn.com/w320/bz.png",
      "continent": "Amérique centrale",
      "code": "BZ"
    },
    {
      "id": 80,
      "nom": "Mexique",
      "drapeau": "https://flagcdn.com/w320/mx.png",
      "continent": "Amérique du Nord",
      "code": "MX"
    },
    {
      "id": 81,
      "nom": "Venezuela",
      "drapeau": "https://flagcdn.com/w320/ve.png",
      "continent": "Amérique du Sud",
      "code": "VE"
    },
    {
      "id": 82,
      "nom": "Colombie",
      "drapeau": "https://flagcdn.com/w320/co.png",
      "continent": "Amérique du Sud",
      "code": "CO"
    },
    {
      "id": 83,
      "nom": "Pérou",
      "drapeau": "https://flagcdn.com/w320/pe.png",
      "continent": "Amérique du Sud",
      "code": "PE"
    },
    {
      "id": 84,
      "nom": "Chili",
      "drapeau": "https://flagcdn.com/w320/cl.png",
      "continent": "Amérique du Sud",
      "code": "CL"
    },
    {
      "id": 85,
      "nom": "Tunisie",
      "drapeau": "https://flagcdn.com/w320/tn.png",
      "continent": "Afrique",
      "code": "TN"
    },
    {
      "id": 86,
      "nom": "Algérie",
      "drapeau": "https://flagcdn.com/w320/dz.png",
      "continent": "Afrique",
      "code": "DZ"
    },
    {
      "id": 87,
      "nom": "Sénégal",
      "drapeau": "https://flagcdn.com/w320/sn.png",
      "continent": "Afrique",
      "code": "SN"
    },
    {
      "id": 88,
      "nom": "Mali",
      "drapeau": "https://flagcdn.com/w320/ml.png",
      "continent": "Afrique",
      "code": "ML"
    },
    {
      "id": 89,
      "nom": "Burkina Faso",
      "drapeau": "https://flagcdn.com/w320/bf.png",
      "continent": "Afrique",
      "code": "BF"
    },
    {
      "id": 90,
      "nom": "Ghana",
      "drapeau": "https://flagcdn.com/w320/gh.png",
      "continent": "Afrique",
      "code": "GH"
    },
    {
      "id": 91,
      "nom": "Togo",
      "drapeau": "https://flagcdn.com/w320/tg.png",
      "continent": "Afrique",
      "code": "TG"
    },
    {
      "id": 92,
      "nom": "Bénin",
      "drapeau": "https://flagcdn.com/w320/bj.png",
      "continent": "Afrique",
      "code": "BJ"
    },
    {
      "id": 93,
      "nom": "Nigéria",
      "drapeau": "https://flagcdn.com/w320/ng.png",
      "continent": "Afrique",
      "code": "NG"
    },
    {
      "id": 94,
      "nom": "Guinée",
      "drapeau": "https://flagcdn.com/w320/gn.png",
      "continent": "Afrique",
      "code": "GN"
    },
    {
      "id": 95,
      "nom": "Guinée-Bissau",
      "drapeau": "https://flagcdn.com/w320/gw.png",
      "continent": "Afrique",
      "code": "GW"
    },
    {
      "id": 96,
      "nom": "Sierra Leone",
      "drapeau": "https://flagcdn.com/w320/sl.png",
      "continent": "Afrique",
      "code": "SL"
    },
    {
      "id": 97,
      "nom": "Liberia",
      "drapeau": "https://flagcdn.com/w320/lr.png",
      "continent": "Afrique",
      "code": "LR"
    },
    {
      "id": 98,
      "nom": "Gambie",
      "drapeau": "https://flagcdn.com/w320/gm.png",
      "continent": "Afrique",
      "code": "GM"
    },
    {
      "id": 99,
      "nom": "Cap-Vert",
      "drapeau": "https://flagcdn.com/w320/cv.png",
      "continent": "Afrique",
      "code": "CV"
    },
    {
      "id": 100,
      "nom": "Congo-Brazzaville",
      "drapeau": "https://flagcdn.com/w320/cg.png",
      "continent": "Afrique",
      "code": "CG"
    },
    {
      "id": 101,
      "nom": "Congo-Kinshasa",
      "drapeau": "https://flagcdn.com/w320/cd.png",
      "continent": "Afrique",
      "code": "CD"
    },
    {
      "id": 102,
      "nom": "Ouganda",
      "drapeau": "https://flagcdn.com/w320/ug.png",
      "continent": "Afrique",
      "code": "UG"
    },
    {
      "id": 103,
      "nom": "Tanzanie",
      "drapeau": "https://flagcdn.com/w320/tz.png",
      "continent": "Afrique",
      "code": "TZ"
    },
    {
      "id": 104,
      "nom": "Angola",
      "drapeau": "https://flagcdn.com/w320/ao.png",
      "continent": "Afrique",
      "code": "AO"
    },
    {
      "id": 105,
      "nom": "Zambie",
      "drapeau": "https://flagcdn.com/w320/zm.png",
      "continent": "Afrique",
      "code": "ZM"
    },
    {
      "id": 106,
      "nom": "Zimbabwe",
      "drapeau": "https://flagcdn.com/w320/zw.png",
      "continent": "Afrique",
      "code": "ZW"
    },
    {
      "id": 107,
      "nom": "Namibie",
      "drapeau": "https://flagcdn.com/w320/na.png",
      "continent": "Afrique",
      "code": "NA"
    },
    {
      "id": 108,
      "nom": "Botswana",
      "drapeau": "https://flagcdn.com/w320/bw.png",
      "continent": "Afrique",
      "code": "BW"
    },
    {
      "id": 109,
      "nom": "Lesotho",
      "drapeau": "https://flagcdn.com/w320/ls.png",
      "continent": "Afrique",
      "code": "LS"
    },
    {
      "id": 110,
      "nom": "Eswatini",
      "drapeau": "https://flagcdn.com/w320/sz.png",
      "continent": "Afrique",
      "code": "SZ"
    },
    {
      "id": 111,
      "nom": "Madagascar",
      "drapeau": "https://flagcdn.com/w320/mg.png",
      "continent": "Afrique",
      "code": "MG"
    },
    {
      "id": 112,
      "nom": "Maurice",
      "drapeau": "https://flagcdn.com/w320/mu.png",
      "continent": "Afrique",
      "code": "MU"
    },
    {
      "id": 113,
      "nom": "Seychelles",
      "drapeau": "https://flagcdn.com/w320/sc.png",
      "continent": "Afrique",
      "code": "SC"
    },
    {
      "id": 114,
      "nom": "Comores",
      "drapeau": "https://flagcdn.com/w320/km.png",
      "continent": "Afrique",
      "code": "KM"
    },
    {
      "id": 115,
      "nom": "Sao Tomé-et-Principe",
      "drapeau": "https://flagcdn.com/w320/st.png",
      "continent": "Afrique",
      "code": "ST"
    },
    {
      "id": 116,
      "nom": "Malawi",
      "drapeau": "https://flagcdn.com/w320/mw.png",
      "continent": "Afrique",
      "code": "MW"
    },
    {
      "id": 117,
      "nom": "Mali",
      "drapeau": "https://flagcdn.com/w320/ml.png",
      "continent": "Afrique",
      "code": "ML"
    },
    {
      "id": 118,
      "nom": "Burkina Faso",
      "drapeau": "https://flagcdn.com/w320/bf.png",
      "continent": "Afrique",
      "code": "BF"
    },
    {
      "id": 119,
      "nom": "Niger",
      "drapeau": "https://flagcdn.com/w320/ne.png",
      "continent": "Afrique",
      "code": "NE"
    },
    {
      "id": 120,
      "nom": "Tchad",
      "drapeau": "https://flagcdn.com/w320/td.png",
      "continent": "Afrique",
      "code": "TD"
    },
    {
      "id": 121,
      "nom": "Soudan",
      "drapeau": "https://flagcdn.com/w320/sd.png",
      "continent": "Afrique",
      "code": "SD"
    },
    {
      "id": 122,
      "nom": "Érythrée",
      "drapeau": "https://flagcdn.com/w320/er.png",
      "continent": "Afrique",
      "code": "ER"
    },
    {
      "id": 123,
      "nom": "Djibouti",
      "drapeau": "https://flagcdn.com/w320/dj.png",
      "continent": "Afrique",
      "code": "DJ"
    },
    {
      "id": 124,
      "nom": "Somalie",
      "drapeau": "https://flagcdn.com/w320/so.png",
      "continent": "Afrique",
      "code": "SO"
    },
    {
      "id": 125,
      "nom": "Sud-Soudan",
      "drapeau": "https://flagcdn.com/w320/ss.png",
      "continent": "Afrique",
      "code": "SS"
    },
    {
      "id": 126,
      "nom": "Brunei",
      "drapeau": "https://flagcdn.com/w320/bn.png",
      "continent": "Asie",
      "code": "BN"
    },
    {
      "id": 127,
      "nom": "Bhoutan",
      "drapeau": "https://flagcdn.com/w320/bt.png",
      "continent": "Asie",
      "code": "BT"
    },
    {
      "id": 128,
      "nom": "Mongolie",
      "drapeau": "https://flagcdn.com/w320/mn.png",
      "continent": "Asie",
      "code": "MN"
    },
    {
      "id": 129,
      "nom": "Kazakhstan",
      "drapeau": "https://flagcdn.com/w320/kz.png",
      "continent": "Asie",
      "code": "KZ"
    },
    {
      "id": 130,
      "nom": "Ouzbékistan",
      "drapeau": "https://flagcdn.com/w320/uz.png",
      "continent": "Asie",
      "code": "UZ"
    },
    {
      "id": 131,
      "nom": "Turkménistan",
      "drapeau": "https://flagcdn.com/w320/tm.png",
      "continent": "Asie",
      "code": "TM"
    },
    {
      "id": 132,
      "nom": "Kirghizistan",
      "drapeau": "https://flagcdn.com/w320/kg.png",
      "continent": "Asie",
      "code": "KG"
    },
    {
      "id": 133,
      "nom": "Tadjikistan",
      "drapeau": "https://flagcdn.com/w320/tj.png",
      "continent": "Asie",
      "code": "TJ"
    },
    {
      "id": 134,
      "nom": "Timor oriental",
      "drapeau": "https://flagcdn.com/w320/tl.png",
      "continent": "Asie",
      "code": "TL"
    },
    {
      "id": 135,
      "nom": "Papouasie-Nouvelle-Guinée",
      "drapeau": "https://flagcdn.com/w320/pg.png",
      "continent": "Océanie",
      "code": "PG"
    },
    {
      "id": 136,
      "nom": "Îles Salomon",
      "drapeau": "https://flagcdn.com/w320/sb.png",
      "continent": "Océanie",
      "code": "SB"
    },
    {
      "id": 137,
      "nom": "Vanuatu",
      "drapeau": "https://flagcdn.com/w320/vu.png",
      "continent": "Océanie",
      "code": "VU"
    },
    {
      "id": 138,
      "nom": "Fidji",
      "drapeau": "https://flagcdn.com/w320/fj.png",
      "continent": "Océanie",
      "code": "FJ"
    },
    {
      "id": 139,
      "nom": "Samoa",
      "drapeau": "https://flagcdn.com/w320/ws.png",
      "continent": "Océanie",
      "code": "WS"
    },
    {
      "id": 140,
      "nom": "Tonga",
      "drapeau": "https://flagcdn.com/w320/to.png",
      "continent": "Océanie",
      "code": "TO"
    },
    {
      "id": 141,
      "nom": "Kiribati",
      "drapeau": "https://flagcdn.com/w320/ki.png",
      "continent": "Océanie",
      "code": "KI"
    },
    {
      "id": 142,
      "nom": "Tuvalu",
      "drapeau": "https://flagcdn.com/w320/tv.png",
      "continent": "Océanie",
      "code": "TV"
    },
    {
      "id": 143,
      "nom": "Nauru",
      "drapeau": "https://flagcdn.com/w320/nr.png",
      "continent": "Océanie",
      "code": "NR"
    },
    {
      "id": 144,
      "nom": "Îles Marshall",
      "drapeau": "https://flagcdn.com/w320/mh.png",
      "continent": "Océanie",
      "code": "MH"
    },
    {
      "id": 145,
      "nom": "Micronésie",
      "drapeau": "https://flagcdn.com/w320/fm.png",
      "continent": "Océanie",
      "code": "FM"
    },
    {
      "id": 146,
      "nom": "Palaos",
      "drapeau": "https://flagcdn.com/w320/pw.png",
      "continent": "Océanie",
      "code": "PW"
    },
    {
      "id": 147,
      "nom": "Bahamas",
      "drapeau": "https://flagcdn.com/w320/bs.png",
      "continent": "Amérique du Nord",
      "code": "BS"
    },
    {
      "id": 148,
      "nom": "Barbade",
      "drapeau": "https://flagcdn.com/w320/bb.png",
      "continent": "Amérique du Nord",
      "code": "BB"
    },
    {
      "id": 149,
      "nom": "Saint-Vincent-et-les-Grenadines",
      "drapeau": "https://flagcdn.com/w320/vc.png",
      "continent": "Amérique du Nord",
      "code": "VC"
    },
    {
      "id": 150,
      "nom": "Sainte-Lucie",
      "drapeau": "https://flagcdn.com/w320/lc.png",
      "continent": "Amérique du Nord",
      "code": "LC"
    },
    {
      "id": 151,
      "nom": "Grenade",
      "drapeau": "https://flagcdn.com/w320/gd.png",
      "continent": "Amérique du Nord",
      "code": "GD"
    },
    {
      "id": 152,
      "nom": "Trinité-et-Tobago",
      "drapeau": "https://flagcdn.com/w320/tt.png",
      "continent": "Amérique du Nord",
      "code": "TT"
    },
    {
      "id": 153,
      "nom": "Belize",
      "drapeau": "https://flagcdn.com/w320/bz.png",
      "continent": "Amérique du Nord",
      "code": "BZ"
    },
    {
      "id": 154,
      "nom": "Suriname",
      "drapeau": "https://flagcdn.com/w320/sr.png",
      "continent": "Amérique du Sud",
      "code": "SR"
    },
    {
      "id": 155,
      "nom": "Guyana",
      "drapeau": "https://flagcdn.com/w320/gy.png",
      "continent": "Amérique du Sud",
      "code": "GY"
    },
    {
      "id": 156,
      "nom": "Paraguay",
      "drapeau": "https://flagcdn.com/w320/py.png",
      "continent": "Amérique du Sud",
      "code": "PY"
    },
    {
      "id": 157,
      "nom": "Uruguay",
      "drapeau": "https://flagcdn.com/w320/uy.png",
      "continent": "Amérique du Sud",
      "code": "UY"
    },
    {
      "id": 158,
      "nom": "Bolivie",
      "drapeau": "https://flagcdn.com/w320/bo.png",
      "continent": "Amérique du Sud",
      "code": "BO"
    },
    {
      "id": 159,
      "nom": "Équateur",
      "drapeau": "https://flagcdn.com/w320/ec.png",
      "continent": "Amérique du Sud",
      "code": "EC"
    },
    {
      "id": 160,
      "nom": "Venezuela",
      "drapeau": "https://flagcdn.com/w320/ve.png",
      "continent": "Amérique du Sud",
      "code": "VE"
    },
    {
      "id": 161,
      "nom": "Costa Rica",
      "drapeau": "https://flagcdn.com/w320/cr.png",
      "continent": "Amérique du Nord",
      "code": "CR"
    },
    {
      "id": 162,
      "nom": "Panama",
      "drapeau": "https://flagcdn.com/w320/pa.png",
      "continent": "Amérique du Nord",
      "code": "PA"
    },
    {
      "id": 163,
      "nom": "Salvador",
      "drapeau": "https://flagcdn.com/w320/sv.png",
      "continent": "Amérique du Nord",
      "code": "SV"
    },
    {
      "id": 164,
      "nom": "Honduras",
      "drapeau": "https://flagcdn.com/w320/hn.png",
      "continent": "Amérique du Nord",
      "code": "HN"
    },
    {
      "id": 165,
      "nom": "Nicaragua",
      "drapeau": "https://flagcdn.com/w320/ni.png",
      "continent": "Amérique du Nord",
      "code": "NI"
    },
    {
      "id": 166,
      "nom": "Guatemala",
      "drapeau": "https://flagcdn.com/w320/gt.png",
      "continent": "Amérique du Nord",
      "code": "GT"
    },
    {
      "id": 167,
      "nom": "Bahreïn",
      "drapeau": "https://flagcdn.com/w320/bh.png",
      "continent": "Asie",
      "code": "BH"
    },
    {
      "id": 168,
      "nom": "Koweït",
      "drapeau": "https://flagcdn.com/w320/kw.png",
      "continent": "Asie",
      "code": "KW"
    },
    {
      "id": 169,
      "nom": "Oman",
      "drapeau": "https://flagcdn.com/w320/om.png",
      "continent": "Asie",
      "code": "OM"
    },
    {
      "id": 170,
      "nom": "Qatar",
      "drapeau": "https://flagcdn.com/w320/qa.png",
      "continent": "Asie",
      "code": "QA"
    },
    {
      "id": 171,
      "nom": "Yémen",
      "drapeau": "https://flagcdn.com/w320/ye.png",
      "continent": "Asie",
      "code": "YE"
    },
    {
      "id": 172,
      "nom": "Mongolie",
      "drapeau": "https://flagcdn.com/w320/mn.png",
      "continent": "Asie",
      "code": "MN"
    },
    {
      "id": 173,
      "nom": "Kazakhstan",
      "drapeau": "https://flagcdn.com/w320/kz.png",
      "continent": "Asie",
      "code": "KZ"
    },
    {
      "id": 174,
      "nom": "Kirghizistan",
      "drapeau": "https://flagcdn.com/w320/kg.png",
      "continent": "Asie",
      "code": "KG"
    },
    {
      "id": 175,
      "nom": "Tadjikistan",
      "drapeau": "https://flagcdn.com/w320/tj.png",
      "continent": "Asie",
      "code": "TJ"
    },
    {
      "id": 176,
      "nom": "Turkménistan",
      "drapeau": "https://flagcdn.com/w320/tm.png",
      "continent": "Asie",
      "code": "TM"
    },
    {
      "id": 177,
      "nom": "Ouzbékistan",
      "drapeau": "https://flagcdn.com/w320/uz.png",
      "continent": "Asie",
      "code": "UZ"
    },
    {
      "id": 178,
      "nom": "Bhoutan",
      "drapeau": "https://flagcdn.com/w320/bt.png",
      "continent": "Asie",
      "code": "BT"
    },
    {
      "id": 179,
      "nom": "Brunei",
      "drapeau": "https://flagcdn.com/w320/bn.png",
      "continent": "Asie",
      "code": "BN"
    },
    {
      "id": 180,
      "nom": "Timor oriental",
      "drapeau": "https://flagcdn.com/w320/tl.png",
      "continent": "Asie",
      "code": "TL"
    },
    {
      "id": 181,
      "nom": "Îles Fidji",
      "drapeau": "https://flagcdn.com/w320/fj.png",
      "continent": "Océanie",
      "code": "FJ"
    },
    {
      "id": 182,
      "nom": "Îles Salomon",
      "drapeau": "https://flagcdn.com/w320/sb.png",
      "continent": "Océanie",
      "code": "SB"
    },
    {
      "id": 183,
      "nom": "Papouasie-Nouvelle-Guinée",
      "drapeau": "https://flagcdn.com/w320/pg.png",
      "continent": "Océanie",
      "code": "PG"
    },
    {
      "id": 184,
      "nom": "Samoa",
      "drapeau": "https://flagcdn.com/w320/ws.png",
      "continent": "Océanie",
      "code": "WS"
    },
    {
      "id": 185,
      "nom": "Tonga",
      "drapeau": "https://flagcdn.com/w320/to.png",
      "continent": "Océanie",
      "code": "TO"
    },
    {
      "id": 186,
      "nom": "Vanuatu",
      "drapeau": "https://flagcdn.com/w320/vu.png",
      "continent": "Océanie",
      "code": "VU"
    },
    {
      "id": 187,
      "nom": "Micronésie",
      "drapeau": "https://flagcdn.com/w320/fm.png",
      "continent": "Océanie",
      "code": "FM"
    },
    {
      "id": 188,
      "nom": "Kiribati",
      "drapeau": "https://flagcdn.com/w320/ki.png",
      "continent": "Océanie",
      "code": "KI"
    },
    {
      "id": 189,
      "nom": "Nauru",
      "drapeau": "https://flagcdn.com/w320/nr.png",
      "continent": "Océanie",
      "code": "NR"
    },
    {
      "id": 190,
      "nom": "Tuvalu",
      "drapeau": "https://flagcdn.com/w320/tv.png",
      "continent": "Océanie",
      "code": "TV"
    },
    {
      "id": 191,
      "nom": "Îles Marshall",
      "drapeau": "https://flagcdn.com/w320/mh.png",
      "continent": "Océanie",
      "code": "MH"
    },
    {
      "id": 192,
      "nom": "Palaos",
      "drapeau": "https://flagcdn.com/w320/pw.png",
      "continent": "Océanie",
      "code": "PW"
    },
    {
      "id": 193,
      "nom": "Saint-Christophe-et-Niévès",
      "drapeau": "https://flagcdn.com/w320/kn.png",
      "continent": "Amérique du Nord",
      "code": "KN"
    }
  ]
  idPays:any;
  eSimPack:any;
  packPays: any[] = [];
  active:Boolean=false;
  ngOnInit(): void {
    this.idPays = this.route.snapshot.params['id'];
    this.getPays();
    
    // Récupérer les infos utilisateur si connecté
    const donneesChiffrees = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (donneesChiffrees && Object.keys(donneesChiffrees).length > 0) {
      this.user = this.encryptionService.decryptData(donneesChiffrees);
    }
    
    // Afficher la modale Oumrah après 5 secondes
    setTimeout(() => {
      this.showOumrahModal = true;
    }, 5000);
  }

  closeOumrahModal(): void {
    this.showOumrahModal = false;
  }


  getPays(){
    this.paysChoisi = this.pays.find((elt) => elt.id === Number(this.idPays));
    if (this.paysChoisi) {
      // Une fois le pays trouvé, charger les packages
      this.getPack();
    } else {
      console.error('[DEBUG] Aucun pays trouvé avec l\'ID:', this.idPays);
      // Recherche directe du Japon par code
      this.paysChoisi = this.pays.find((elt) => elt.code === 'JP');
      if (this.paysChoisi) {
        this.getPack();
      }
    }
  }
  getPack(){
    if (!this.paysChoisi) {
      this.packPays = [];
      return;
    }
    
    this.loadingPackages = true;
    this.esimService.getEsimPackagesWithPrice(this.paysChoisi.code).subscribe({
      next: (response: any) => {
        this.loadingPackages = false;
        if (response && response.success && response.packages && Array.isArray(response.packages)) {
          // Filtrer les packages de test et ceux sans nom valide
          let filtered = response.packages.filter((pack: any) => {
            const name = (pack.name || '').toUpperCase();
            // Exclure les packages avec "TEST" dans le nom
            // Exclure "TURKY" dans le nom
            // Exclure les packages sans nom ou avec des noms suspects
            return name && 
                   !name.includes('TEST') && 
                   !name.includes('TURKY') &&
                   name.trim().length > 0 &&
                   pack.price && 
                   pack.price > 0;
          });
          
          // Dédupliquer les packages : garder seulement le premier pour chaque combinaison nom + data_mb
          const seen = new Map<string, boolean>();
          this.packPays = filtered.filter((pack: any) => {
            const key = `${(pack.name || '').toUpperCase().trim()}_${pack.data_mb || 0}`;
            if (seen.has(key)) {
              return false; // Déjà vu, on l'exclut
            }
            seen.set(key, true);
            return true;
          });
        } else {
          this.packPays = [];
        }
      },
      error: (error) => {
        this.loadingPackages = false;
        console.error('[DEBUG] Erreur lors de la récupération des forfaits:', error);
        this.packPays = [];
      }
    });
  }

  selectedEsimId: number | null = null;

  selectEsim(pack: any, packId: number) {
    this.selectedEsimId = packId;
    this.selectedEsim = pack;
  }
  
  acheterEsim(){
    if (!this.selectedEsim) {
      Swal.fire({
        icon: "warning",
        title: "Sélection requise",
        text: "Veuillez sélectionner un forfait avant de continuer.",
        confirmButtonColor: '#FFDD33'
      });
      return;
    }
    localStorage.setItem('eSim', JSON.stringify(this.selectedEsim));
    this.showCheckoutModal = true;
  }
  
  closeCheckoutModal() {
    this.showCheckoutModal = false;
  }
  
  order() {
    if (!this.email || !this.phone || !this.selectedEsim?.id || !this.selectedEsim?.price) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir tous les champs obligatoires !",
        confirmButtonColor: '#FFDD33'
      });
      return;
    }
    
    const com = {
      email: this.email,
      phone_number: this.selectedIndicatif + this.phone,
      user_id: this.user?.id,
      esim_package_template_id: this.selectedEsim.id,
      amount: this.selectedEsim.price,
    };
    
    this.orderService.commande(com).subscribe({
      next: (response: any) => {
        this.comande = response;
        this.idOrder = this.comande.order.id;
        
        // Fermer le modal
        this.closeCheckoutModal();
        
        // Afficher un message de chargement
        Swal.fire({
          title: "Redirection en cours...",
          text: "Préparation de votre paiement sécurisé",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Initier directement le paiement
        this.orderService.payer(this.idOrder).subscribe({
          next: (reponse: any) => {
            if (reponse && reponse.redirect_url) {
              // Rediriger directement vers PayTech
              window.location.href = reponse.redirect_url;
            } else {
              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "URL de redirection non disponible",
                confirmButtonColor: '#FFDD33'
              });
            }
          },
          error: (error) => {
            console.error('[FRONT][Checkout] Erreur paiement', error);
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: error.error?.message || "Une erreur est survenue lors du paiement.",
              confirmButtonColor: '#FFDD33'
            });
          }
        });
      },
      error: (error) => {
        console.error('[FRONT][Checkout] Erreur commande', error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.error?.message || "Une erreur est survenue lors de la création de la commande.",
          confirmButtonColor: '#FFDD33'
        });
      }
    });
  }

}
