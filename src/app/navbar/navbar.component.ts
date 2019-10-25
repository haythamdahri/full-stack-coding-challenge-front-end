import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/auth/auth.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

/**
 * Navbar component class
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private form: FormGroup;

  /**
   * Class constructor
   * inject necessary objects
   */
  constructor(private authService: AuthService, private router: Router) {
  }

  /**
   * After application initialisation function
   */
  ngOnInit() {
    this.form = new FormGroup({
      search: new FormControl('', [Validators.nullValidator, Validators.maxLength(200), Validators.required])
    });
  }

  /**
   * onLogout function
   */
  onLogout() {
    // Log out the user
    this.authService.logout();
    // Redirect user to the login page
    this.router.navigate(['/login']);
  }

  /**
   * onShopSearch function
   */
  onShopSearch() {
    // Check if search is valid
    if (this.form.invalid) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: 'error',
        title: 'Invalid search'
      });
    } else {
      this.router.navigateByUrl(`/?search=${this.form.controls.search.value}`)
    }
  }

}
