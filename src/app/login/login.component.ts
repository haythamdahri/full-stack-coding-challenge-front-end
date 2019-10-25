import {AuthService} from './../shared/auth/auth.service';
import Swal from 'sweetalert2';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

/**
 * Login component class
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loginSubscription: Subscription;
  loginError = false;
  @ViewChild('loginBtn', {static: false}) loginBtn: ElementRef;

  /**
   * class constructor
   */
  constructor(private authService: AuthService, private router: Router) {
  }

  /**
   * After component initialisation function
   */
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(150),
        Validators.required
      ])
    });
  }

  /**
   * After component closing  function
   */
  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    this.loginError = false;
  }

  /**
   * on click on login button
   */
  onLogin() {
    if (this.form.invalid) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: 'error',
        title: 'Invalid login data'
      });
    } else {
      (this.loginBtn.nativeElement as HTMLButtonElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Login';
      (this.loginBtn.nativeElement as HTMLButtonElement).setAttribute('disabled', 'true');
      this.authService
        .login(
          this.form.controls.email.value,
          this.form.controls.password.value
        )
        .subscribe(
          userToken => {
            // User success message
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-left',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              type: 'success',
              title: 'You are logged in successfully'
            });
            this.router.navigate(['/']);
          },
          err => {
            console.log(err);
            this.loginError = true;
            (this.loginBtn.nativeElement as HTMLButtonElement).innerHTML =
              '<i class="fas fa-sign-in-alt"></i> Login';
            (this.loginBtn.nativeElement as HTMLButtonElement).setAttribute('disabled', 'true');
          }
        );
    }
  }
}
