import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../partials/header/header.component';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FormsModule, NgSelectModule, TranslateModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  email: any;
  phone: any;
  user:any;
  paiement: any;
  comande:any;
  idOrder: any;
  selectedIndicatif: any = ''; 
  indicatifs = [
    { "ind": "+33", "drapeau": "https://flagcdn.com/w320/fr.png" }, // France
    { "ind": "+212", "drapeau": "https://flagcdn.com/w320/ma.png" }, // Maroc
    { "ind": "+1", "drapeau": "https://flagcdn.com/w320/us.png" }, // États-Unis
    { "ind": "+34", "drapeau": "https://flagcdn.com/w320/es.png" }, // Espagne
    { "ind": "+39", "drapeau": "https://flagcdn.com/w320/it.png" }, // Italie
    { "ind": "+971", "drapeau": "https://flagcdn.com/w320/ae.png" }, // Émirats Arabes Unis
    { "ind": "+90", "drapeau": "https://flagcdn.com/w320/tr.png" }, // Turquie
    { "ind": "+86", "drapeau": "https://flagcdn.com/w320/cn.png" }, // Chine
    { "ind": "+27", "drapeau": "https://flagcdn.com/w320/za.png" }, // Afrique du Sud
    { "ind": "+44", "drapeau": "https://flagcdn.com/w320/gb.png" }, // Royaume-Uni
    { "ind": "+225", "drapeau": "https://flagcdn.com/w320/ci.png" }, // Côte d'Ivoire
    { "ind": "+1", "drapeau": "https://flagcdn.com/w320/ca.png" }, // Canada
    { "ind": "+254", "drapeau": "https://flagcdn.com/w320/ke.png" }, // Kenya
    { "ind": "+221", "drapeau": "https://flagcdn.com/w320/sn.png" }, // Senegal
    { "ind": "+7", "drapeau": "https://flagcdn.com/w320/ru.png" }, // Russie
    { "ind": "+20", "drapeau": "https://flagcdn.com/w320/eg.png" }, // Égypte
    { "ind": "+30", "drapeau": "https://flagcdn.com/w320/gr.png" }, // Grèce
    { "ind": "+31", "drapeau": "https://flagcdn.com/w320/nl.png" }, // Pays-Bas
    { "ind": "+32", "drapeau": "https://flagcdn.com/w320/be.png" }, // Belgique
    { "ind": "+36", "drapeau": "https://flagcdn.com/w320/hu.png" }, // Hongrie
    { "ind": "+40", "drapeau": "https://flagcdn.com/w320/ro.png" }, // Roumanie
    { "ind": "+41", "drapeau": "https://flagcdn.com/w320/ch.png" }, // Suisse
    { "ind": "+43", "drapeau": "https://flagcdn.com/w320/at.png" }, // Autriche
    { "ind": "+45", "drapeau": "https://flagcdn.com/w320/dk.png" }, // Danemark
    { "ind": "+46", "drapeau": "https://flagcdn.com/w320/se.png" }, // Suède
    { "ind": "+47", "drapeau": "https://flagcdn.com/w320/no.png" }, // Norvège
    { "ind": "+48", "drapeau": "https://flagcdn.com/w320/pl.png" }, // Pologne
    { "ind": "+49", "drapeau": "https://flagcdn.com/w320/de.png" }, // Allemagne
    { "ind": "+51", "drapeau": "https://flagcdn.com/w320/pe.png" }, // Pérou
    { "ind": "+52", "drapeau": "https://flagcdn.com/w320/mx.png" }, // Mexique
    { "ind": "+53", "drapeau": "https://flagcdn.com/w320/cu.png" }, // Cuba
    { "ind": "+54", "drapeau": "https://flagcdn.com/w320/ar.png" }, // Argentine
    { "ind": "+55", "drapeau": "https://flagcdn.com/w320/br.png" }, // Brésil
    { "ind": "+56", "drapeau": "https://flagcdn.com/w320/cl.png" }, // Chili
    { "ind": "+57", "drapeau": "https://flagcdn.com/w320/co.png" }, // Colombie
    { "ind": "+58", "drapeau": "https://flagcdn.com/w320/ve.png" }, // Venezuela
    { "ind": "+60", "drapeau": "https://flagcdn.com/w320/my.png" }, // Malaisie
    { "ind": "+61", "drapeau": "https://flagcdn.com/w320/au.png" }, // Australie
    { "ind": "+62", "drapeau": "https://flagcdn.com/w320/id.png" }, // Indonésie
    { "ind": "+63", "drapeau": "https://flagcdn.com/w320/ph.png" }, // Philippines
    { "ind": "+64", "drapeau": "https://flagcdn.com/w320/nz.png" }, // Nouvelle-Zélande
    { "ind": "+65", "drapeau": "https://flagcdn.com/w320/sg.png" }, // Singapour
    { "ind": "+66", "drapeau": "https://flagcdn.com/w320/th.png" }, // Thaïlande
    { "ind": "+81", "drapeau": "https://flagcdn.com/w320/jp.png" } , // Japon
    { "ind": "+82", "drapeau": "https://flagcdn.com/w320/kr.png" }, // Corée du Sud
    { "ind": "+84", "drapeau": "https://flagcdn.com/w320/vn.png" }, // Vietnam
    { "ind": "+92", "drapeau": "https://flagcdn.com/w320/pk.png" }, // Pakistan
    { "ind": "+93", "drapeau": "https://flagcdn.com/w320/af.png" }, // Afghanistan
    { "ind": "+94", "drapeau": "https://flagcdn.com/w320/lk.png" }, // Sri Lanka
    { "ind": "+95", "drapeau": "https://flagcdn.com/w320/mm.png" }, // Birmanie (Myanmar)
    { "ind": "+98", "drapeau": "https://flagcdn.com/w320/ir.png" }, // Iran
    { "ind": "+211", "drapeau": "https://flagcdn.com/w320/ss.png" }, // Soudan du Sud
    { "ind": "+213", "drapeau": "https://flagcdn.com/w320/dz.png" }, // Algérie
    { "ind": "+216", "drapeau": "https://flagcdn.com/w320/tn.png" }, // Tunisie
    { "ind": "+218", "drapeau": "https://flagcdn.com/w320/ly.png" }, // Libye
    { "ind": "+220", "drapeau": "https://flagcdn.com/w320/gm.png" }, // Gambie
    { "ind": "+221", "drapeau": "https://flagcdn.com/w320/sn.png" }, // Sénégal
    { "ind": "+222", "drapeau": "https://flagcdn.com/w320/mr.png" }, // Mauritanie
    { "ind": "+223", "drapeau": "https://flagcdn.com/w320/ml.png" }, // Mali
    { "ind": "+224", "drapeau": "https://flagcdn.com/w320/gn.png" }, // Guinée
    { "ind": "+225", "drapeau": "https://flagcdn.com/w320/ci.png" }, // Côte d'Ivoire
    { "ind": "+226", "drapeau": "https://flagcdn.com/w320/bf.png" }, // Burkina Faso
    { "ind": "+227", "drapeau": "https://flagcdn.com/w320/ne.png" }, // Niger
    { "ind": "+228", "drapeau": "https://flagcdn.com/w320/tg.png" }, // Togo
    { "ind": "+229", "drapeau": "https://flagcdn.com/w320/bj.png" }, // Bénin
    { "ind": "+230", "drapeau": "https://flagcdn.com/w320/mu.png" }, // Maurice
    { "ind": "+231", "drapeau": "https://flagcdn.com/w320/lr.png" }, // Libéria
    { "ind": "+232", "drapeau": "https://flagcdn.com/w320/sl.png" }, // Sierra Leone
    { "ind": "+233", "drapeau": "https://flagcdn.com/w320/gh.png" }, // Ghana
    { "ind": "+234", "drapeau": "https://flagcdn.com/w320/ng.png" }, // Nigeria
    { "ind": "+235", "drapeau": "https://flagcdn.com/w320/td.png" }, // Tchad
    { "ind": "+236", "drapeau": "https://flagcdn.com/w320/cf.png" }, // Centrafrique
    { "ind": "+237", "drapeau": "https://flagcdn.com/w320/cm.png" }, // Cameroun
    { "ind": "+238", "drapeau": "https://flagcdn.com/w320/cv.png" }, // Cap-Vert
    { "ind": "+239", "drapeau": "https://flagcdn.com/w320/st.png" }, // Sao Tomé-et-Principe
    { "ind": "+240", "drapeau": "https://flagcdn.com/w320/gq.png" }, // Guinée équatoriale
    { "ind": "+241", "drapeau": "https://flagcdn.com/w320/ga.png" }, // Gabon
    { "ind": "+242", "drapeau": "https://flagcdn.com/w320/cg.png" }, // Congo-Brazzaville
    { "ind": "+243", "drapeau": "https://flagcdn.com/w320/cd.png" }, // Congo-Kinshasa (RDC)
    { "ind": "+244", "drapeau": "https://flagcdn.com/w320/ao.png" }, // Angola
    { "ind": "+245", "drapeau": "https://flagcdn.com/w320/gw.png" }, // Guinée-Bissau
    { "ind": "+246", "drapeau": "https://flagcdn.com/w320/io.png" }, // Territoire britannique de l'océan Indien
    { "ind": "+248", "drapeau": "https://flagcdn.com/w320/sc.png" }, // Seychelles
    { "ind": "+249", "drapeau": "https://flagcdn.com/w320/sd.png" }, // Soudan
    { "ind": "+250", "drapeau": "https://flagcdn.com/w320/rw.png" }, // Rwanda
    { "ind": "+251", "drapeau": "https://flagcdn.com/w320/et.png" }, // Éthiopie
    { "ind": "+252", "drapeau": "https://flagcdn.com/w320/so.png" }, // Somalie
    { "ind": "+253", "drapeau": "https://flagcdn.com/w320/dj.png" }, // Djibouti
    { "ind": "+255", "drapeau": "https://flagcdn.com/w320/tz.png" }, // Tanzanie
    { "ind": "+256", "drapeau": "https://flagcdn.com/w320/ug.png" }, // Ouganda
    { "ind": "+257", "drapeau": "https://flagcdn.com/w320/bi.png" }, // Burundi
    { "ind": "+258", "drapeau": "https://flagcdn.com/w320/mz.png" }, // Mozambique
    { "ind": "+260", "drapeau": "https://flagcdn.com/w320/zm.png" }, // Zambie
    { "ind": "+261", "drapeau": "https://flagcdn.com/w320/mg.png" }, // Madagascar
    { "ind": "+262", "drapeau": "https://flagcdn.com/w320/re.png" }, // Réunion (France)
    { "ind": "+263", "drapeau": "https://flagcdn.com/w320/zw.png" }, // Zimbabwe
    { "ind": "+264", "drapeau": "https://flagcdn.com/w320/na.png" }, // Namibie
    { "ind": "+265", "drapeau": "https://flagcdn.com/w320/mw.png" }, // Malawi
    { "ind": "+266", "drapeau": "https://flagcdn.com/w320/ls.png" }, // Lesotho
    { "ind": "+267", "drapeau": "https://flagcdn.com/w320/bw.png" }, // Botswana
    { "ind": "+268", "drapeau": "https://flagcdn.com/w320/sz.png" }, // Eswatini (Swaziland)
    { "ind": "+269", "drapeau": "https://flagcdn.com/w320/km.png" }, // Comores
    { "ind": "+290", "drapeau": "https://flagcdn.com/w320/sh.png" },  // Sainte-Hélène, Ascension et Tristan da Cunha
    { "ind": "+291", "drapeau": "https://flagcdn.com/w320/er.png" }, // Érythrée
    { "ind": "+297", "drapeau": "https://flagcdn.com/w320/aw.png" }, // Aruba
    { "ind": "+298", "drapeau": "https://flagcdn.com/w320/fo.png" }, // Îles Féroé
    { "ind": "+299", "drapeau": "https://flagcdn.com/w320/gl.png" }, // Groenland
    { "ind": "+350", "drapeau": "https://flagcdn.com/w320/gi.png" }, // Gibraltar
    { "ind": "+351", "drapeau": "https://flagcdn.com/w320/pt.png" }, // Portugal
    { "ind": "+352", "drapeau": "https://flagcdn.com/w320/lu.png" }, // Luxembourg
    { "ind": "+353", "drapeau": "https://flagcdn.com/w320/ie.png" }, // Irlande
    { "ind": "+354", "drapeau": "https://flagcdn.com/w320/is.png" }, // Islande
    { "ind": "+355", "drapeau": "https://flagcdn.com/w320/al.png" }, // Albanie
    { "ind": "+356", "drapeau": "https://flagcdn.com/w320/mt.png" }, // Malte
    { "ind": "+357", "drapeau": "https://flagcdn.com/w320/cy.png" }, // Chypre
    { "ind": "+358", "drapeau": "https://flagcdn.com/w320/fi.png" }, // Finlande
    { "ind": "+359", "drapeau": "https://flagcdn.com/w320/bg.png" }, // Bulgarie
    { "ind": "+370", "drapeau": "https://flagcdn.com/w320/lt.png" }, // Lituanie
    { "ind": "+371", "drapeau": "https://flagcdn.com/w320/lv.png" }, // Lettonie
    { "ind": "+372", "drapeau": "https://flagcdn.com/w320/ee.png" }, // Estonie
    { "ind": "+373", "drapeau": "https://flagcdn.com/w320/md.png" }, // Moldavie
    { "ind": "+374", "drapeau": "https://flagcdn.com/w320/am.png" }, // Arménie
    { "ind": "+375", "drapeau": "https://flagcdn.com/w320/by.png" }, // Biélorussie
    { "ind": "+376", "drapeau": "https://flagcdn.com/w320/ad.png" }, // Andorre
    { "ind": "+377", "drapeau": "https://flagcdn.com/w320/mc.png" }, // Monaco
    { "ind": "+378", "drapeau": "https://flagcdn.com/w320/sm.png" }, // Saint-Marin
    { "ind": "+380", "drapeau": "https://flagcdn.com/w320/ua.png" }, // Ukraine
    { "ind": "+381", "drapeau": "https://flagcdn.com/w320/rs.png" }, // Serbie
    { "ind": "+382", "drapeau": "https://flagcdn.com/w320/me.png" }, // Monténégro
    { "ind": "+385", "drapeau": "https://flagcdn.com/w320/hr.png" }, // Croatie
    { "ind": "+386", "drapeau": "https://flagcdn.com/w320/si.png" }, // Slovénie
    { "ind": "+387", "drapeau": "https://flagcdn.com/w320/ba.png" }, // Bosnie-Herzégovine
    { "ind": "+389", "drapeau": "https://flagcdn.com/w320/mk.png" },  // Macédoine du Nord
    { "ind": "+420", "drapeau": "https://flagcdn.com/w320/cz.png" }, // République tchèque
    { "ind": "+421", "drapeau": "https://flagcdn.com/w320/sk.png" }, // Slovaquie
    { "ind": "+423", "drapeau": "https://flagcdn.com/w320/li.png" }, // Liechtenstein
    { "ind": "+501", "drapeau": "https://flagcdn.com/w320/bz.png" }, // Belize
    { "ind": "+502", "drapeau": "https://flagcdn.com/w320/gt.png" }, // Guatemala
    { "ind": "+503", "drapeau": "https://flagcdn.com/w320/sv.png" }, // Salvador
    { "ind": "+504", "drapeau": "https://flagcdn.com/w320/hn.png" }, // Honduras
    { "ind": "+505", "drapeau": "https://flagcdn.com/w320/ni.png" }, // Nicaragua
    { "ind": "+506", "drapeau": "https://flagcdn.com/w320/cr.png" }, // Costa Rica
    { "ind": "+507", "drapeau": "https://flagcdn.com/w320/pa.png" }, // Panama
    { "ind": "+509", "drapeau": "https://flagcdn.com/w320/ht.png" }, // Haïti
    { "ind": "+590", "drapeau": "https://flagcdn.com/w320/gp.png" }, // Guadeloupe
    { "ind": "+591", "drapeau": "https://flagcdn.com/w320/bo.png" }, // Bolivie
    { "ind": "+592", "drapeau": "https://flagcdn.com/w320/gy.png" }, // Guyana
    { "ind": "+593", "drapeau": "https://flagcdn.com/w320/ec.png" }, // Équateur
    { "ind": "+594", "drapeau": "https://flagcdn.com/w320/gf.png" }, // Guyane française
    { "ind": "+595", "drapeau": "https://flagcdn.com/w320/py.png" }, // Paraguay
    { "ind": "+596", "drapeau": "https://flagcdn.com/w320/mq.png" }, // Martinique
    { "ind": "+597", "drapeau": "https://flagcdn.com/w320/sr.png" }, // Suriname
    { "ind": "+598", "drapeau": "https://flagcdn.com/w320/uy.png" }, // Uruguay
    { "ind": "+670", "drapeau": "https://flagcdn.com/w320/tl.png" }, // Timor oriental
    { "ind": "+672", "drapeau": "https://flagcdn.com/w320/nf.png" }, // Île Norfolk
    { "ind": "+673", "drapeau": "https://flagcdn.com/w320/bn.png" }, // Brunei
    { "ind": "+674", "drapeau": "https://flagcdn.com/w320/nr.png" }, // Nauru
    { "ind": "+675", "drapeau": "https://flagcdn.com/w320/pg.png" }, // Papouasie-Nouvelle-Guinée
    { "ind": "+676", "drapeau": "https://flagcdn.com/w320/to.png" }, // Tonga
    { "ind": "+677", "drapeau": "https://flagcdn.com/w320/sb.png" }, // Îles Salomon
    { "ind": "+678", "drapeau": "https://flagcdn.com/w320/vu.png" }, // Vanuatu
    { "ind": "+679", "drapeau": "https://flagcdn.com/w320/fj.png" }, // Fidji
    { "ind": "+680", "drapeau": "https://flagcdn.com/w320/pw.png" },  // Palaos
    { "ind": "+681", "drapeau": "https://flagcdn.com/w320/wf.png" }, // Wallis-et-Futuna
    { "ind": "+682", "drapeau": "https://flagcdn.com/w320/ck.png" }, // Îles Cook
    { "ind": "+683", "drapeau": "https://flagcdn.com/w320/nu.png" }, // Niue
    { "ind": "+685", "drapeau": "https://flagcdn.com/w320/ws.png" }, // Samoa
    { "ind": "+686", "drapeau": "https://flagcdn.com/w320/ki.png" }, // Kiribati
    { "ind": "+687", "drapeau": "https://flagcdn.com/w320/nc.png" }, // Nouvelle-Calédonie
    { "ind": "+688", "drapeau": "https://flagcdn.com/w320/tv.png" }, // Tuvalu
    { "ind": "+689", "drapeau": "https://flagcdn.com/w320/pf.png" }, // Polynésie française
    { "ind": "+690", "drapeau": "https://flagcdn.com/w320/tk.png" }, // Tokelau
    { "ind": "+691", "drapeau": "https://flagcdn.com/w320/fm.png" }, // États fédérés de Micronésie
    { "ind": "+692", "drapeau": "https://flagcdn.com/w320/mh.png" }, // Îles Marshall
    { "ind": "+850", "drapeau": "https://flagcdn.com/w320/kp.png" }, // Corée du Nord
    { "ind": "+852", "drapeau": "https://flagcdn.com/w320/hk.png" }, // Hong Kong
    { "ind": "+853", "drapeau": "https://flagcdn.com/w320/mo.png" }, // Macao
    { "ind": "+855", "drapeau": "https://flagcdn.com/w320/kh.png" }, // Cambodge
    { "ind": "+856", "drapeau": "https://flagcdn.com/w320/la.png" }, // Laos
    { "ind": "+880", "drapeau": "https://flagcdn.com/w320/bd.png" }, // Bangladesh
    { "ind": "+886", "drapeau": "https://flagcdn.com/w320/tw.png" }, // Taïwan
    { "ind": "+960", "drapeau": "https://flagcdn.com/w320/mv.png" }, // Maldives
    { "ind": "+961", "drapeau": "https://flagcdn.com/w320/lb.png" }, // Liban
    { "ind": "+962", "drapeau": "https://flagcdn.com/w320/jo.png" }, // Jordanie
    { "ind": "+963", "drapeau": "https://flagcdn.com/w320/sy.png" }, // Syrie
    { "ind": "+964", "drapeau": "https://flagcdn.com/w320/iq.png" }, // Irak
    { "ind": "+965", "drapeau": "https://flagcdn.com/w320/kw.png" }, // Koweït
    { "ind": "+966", "drapeau": "https://flagcdn.com/w320/sa.png" }, // Arabie Saoudite
    { "ind": "+967", "drapeau": "https://flagcdn.com/w320/ye.png" }, // Yémen
    { "ind": "+968", "drapeau": "https://flagcdn.com/w320/om.png" }, // Oman
    { "ind": "+970", "drapeau": "https://flagcdn.com/w320/ps.png" }, // Palestine
    { "ind": "+972", "drapeau": "https://flagcdn.com/w320/il.png" }, // Israël
    { "ind": "+973", "drapeau": "https://flagcdn.com/w320/bh.png" },  // Bahreïn
    { "ind": "+974", "drapeau": "https://flagcdn.com/w320/qa.png" }, // Qatar
    { "ind": "+975", "drapeau": "https://flagcdn.com/w320/bt.png" }, // Bhoutan
    { "ind": "+976", "drapeau": "https://flagcdn.com/w320/mn.png" }, // Mongolie
    { "ind": "+977", "drapeau": "https://flagcdn.com/w320/np.png" }, // Népal
    { "ind": "+992", "drapeau": "https://flagcdn.com/w320/tj.png" }, // Tadjikistan
    { "ind": "+993", "drapeau": "https://flagcdn.com/w320/tm.png" }, // Turkménistan
    { "ind": "+994", "drapeau": "https://flagcdn.com/w320/az.png" }, // Azerbaïdjan
    { "ind": "+995", "drapeau": "https://flagcdn.com/w320/ge.png" }, // Géorgie
    { "ind": "+996", "drapeau": "https://flagcdn.com/w320/kg.png" }, // Kirghizistan
    
  ];
  
  constructor(private orderService:OrderService, private encryptionService : EncryptionService){}
  esimChoisi:any;
  ngOnInit(): void {
    this.esimChoisi=JSON.parse(localStorage.getItem('eSim') ||'{}');
    // console.log(this.esimChoisi)
    const donneesChiffrees =JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (donneesChiffrees) {
    this.user = this.encryptionService.decryptData(donneesChiffrees);
    // console.log('Forfait déchiffré:', this.user);
  }
  

 
    this.selectedIndicatif = this.indicatifs.length ? this.indicatifs[13].ind : null;
    
    // Afficher la modale d'information sur l'email obligatoire
    this.showEmailInfoModal();
  }
  order() {
    console.log('[FRONT][Checkout] Début order()');
    if (!this.email || !this.phone || !this.esimChoisi?.id || !this.esimChoisi?.price) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir tous les champs obligatoires !",
      });
      return;
    }
    const com = {
      email: this.email,
      phone_number: this.selectedIndicatif + this.phone,
      user_id: this.user?.id,
      esim_package_template_id: this.esimChoisi.id,
      amount: this.esimChoisi.price,
    };
    console.log('[FRONT][Checkout] Commande à envoyer', com);
    this.orderService.commande(com).subscribe({
      next: (response: any) => {
        console.log('[FRONT][Checkout] Commande créée', response);
        this.comande = response;
        this.idOrder = this.comande.order.id;
        Swal.fire({
          title: "Commande envoyée",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Confirmer Achat",
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('[FRONT][Checkout] Paiement à initier pour order', this.idOrder);
            this.orderService.payer(this.idOrder).subscribe({
              next: (reponse: any) => {
                console.log('[FRONT][Checkout] Paiement initié', reponse);
                this.showMessage("success", "Félicitations", `${reponse.message}`);
                window.open(reponse.redirect_url, "_self");
              },
              error: (error) => {
                console.error('[FRONT][Checkout] Erreur paiement', error);
                Swal.fire({
                  icon: "error",
                  title: "Erreur de paiement",
                  text: error.error?.error || "Une erreur est survenue lors du paiement",
                });
              },
            });
          } else if (result.isDenied) {
            Swal.fire("Commande non confirmée", "", "info");
          }
        });
      },
      error: (error) => {
        console.error('[FRONT][Checkout] Erreur commande', error);
        let errorMessage = "Une erreur est survenue lors de la commande.";
        if (error.status === 400) {
          errorMessage = error.error?.error || "Aucune eSIM disponible pour ce forfait.";
        } else if (error.status === 422) {
          errorMessage = "Données invalides. Vérifiez votre saisie.";
        }
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: errorMessage,
        });
      },
    });
  }
  getFlag(indicatif: string): string {
    const country = this.indicatifs.find(item => item.ind === indicatif);
    return country ? country.drapeau : '';
  }

  selectIndicatif(indicatif: any) {
    this.selectedIndicatif = indicatif.ind;
  }

  showMessage(icon:any, titre:any, texte:any){
    Swal.fire({
      icon: icon,
      title: titre,
      text: texte,
      confirmButtonColor: `var(--couleur)`,
      showConfirmButton: false,
      timer:2000,
    })
  }  

  showEmailInfoModal() {
    Swal.fire({
      title: '<div style="color: #ffdd33; font-size: 24px; font-weight: bold;">📧 Email Obligatoire</div>',
      html: `
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 48px; margin-bottom: 20px;">📱✨</div>
          <h3 style="color: #333; margin-bottom: 15px;">Pourquoi votre email est-il obligatoire ?</h3>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Après votre achat, nous vous enverrons <strong>automatiquement</strong> votre QR code eSIM par email pour que vous puissiez activer votre forfait mobile partout dans le monde !
          </p>
          <div style="background: linear-gradient(135deg, #ffdd33, #ffb347); padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p style="color: #333; font-weight: bold; margin: 0;">
              🎯 <strong>Avantages :</strong>
            </p>
            <ul style="text-align: left; color: #333; margin: 10px 0 0 0; padding-left: 20px;">
              <li>QR code instantané après paiement</li>
              <li>Activation immédiate sur votre téléphone</li>
              <li>Support client prioritaire</li>
              <li>Facture électronique sécurisée</li>
            </ul>
          </div>
          <p style="color: #28a745; font-weight: bold; font-size: 16px;">
            ✅ Votre email reste confidentiel et ne sera utilisé que pour votre commande
          </p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Compris !',
      confirmButtonColor: '#ffdd33',
      showCloseButton: true,
      customClass: {
        popup: 'swal2-custom-popup',
        confirmButton: 'swal2-custom-confirm'
      },
      background: '#ffffff',
      backdrop: 'rgba(0,0,0,0.4)',
      allowOutsideClick: true,
      allowEscapeKey: true,
      timerProgressBar: false
    });
  }
}
