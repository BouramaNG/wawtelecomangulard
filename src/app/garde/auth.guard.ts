import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const router = new Router();
  if (localStorage.getItem('token')==null || localStorage.getItem('token')==undefined) {
    Swal.fire({
      icon:'error',
      text:'Connectez-vous si vous voulez acceder à cet espace',
      title:'Oops',
      confirmButtonColor: "#ffdd33",
    }
      
    )
    router.navigate(['/login']);
    return false;

  }else{

    return true;
  }
};
