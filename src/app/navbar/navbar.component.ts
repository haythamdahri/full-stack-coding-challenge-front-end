import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  /**
   * Class constructor
   * inject necessary objects
   */
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
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
}
