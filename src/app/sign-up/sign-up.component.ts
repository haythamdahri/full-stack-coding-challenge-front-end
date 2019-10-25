import {Router} from '@angular/router';
import {AuthService} from '../shared/auth/auth.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from '../shared/user.service';
import Swal from 'sweetalert2';

/**
 * Sign up component class
 */
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {

  form: FormGroup;
  signUpSubscription: Subscription;
  signUpError = false;
  registered = false;
  @ViewChild('signupBtn', {static: false}) signUpBtn: ElementRef;

  /**
   * Class constructor
   * inject necessary objects
   */
  constructor(
    private titleService: Title,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  /**
   * After application initialisation function
   */
  ngOnInit() {
    this.titleService.setTitle('Sign up - Create new account');
    this.form = new FormGroup({
      email: new FormControl(
        '',
        [Validators.email, Validators.required],
        [this.checkNewEmail.bind(this)]
      ),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150),
        Validators.pattern('[a-zA-Z]*')
      ]),
      location: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150),
        Validators.pattern('[a-zA-Z]*')
      ]),
      password: new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(150),
        Validators.required
      ]),
      passwordConfirm: new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(150),
        Validators.required,
        this.passwordConfirmValidator.bind(this)
      ])
    });
  }

  /**
   * After application destroying function
   */
  ngOnDestroy() {
    if (this.signUpSubscription) {
      this.signUpSubscription.unsubscribe();
    }
    this.signUpError = false;
    this.registered = false;
  }

  /**
   * Check if an email is already used function
   */
  checkNewEmail(control: FormControl) {
    return this.authService.checkEmailValidity(control.value);
  }

  /**
   * Password confirmation validator function
   */
  passwordConfirmValidator(control: FormControl): { [s: string]: boolean } {
    const confirmedPassword = control.value;
    if (
      this.form &&
      this.form.controls.password.touched &&
      confirmedPassword !== this.form.controls.password.value
    ) {
      return {passwordConfirmIsForbidden: true};
    }
    // null for valid value
    return null;
  }

  /***
   * Sign up function
   */
  onSingUp() {
    if (this.form.invalid) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: 'error',
        title: 'Invalid sign up data'
      });
    } else {
      (this.signUpBtn.nativeElement as HTMLButtonElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sign Up';
      (this.signUpBtn.nativeElement as HTMLButtonElement).setAttribute('disabled', 'true');
      this.userService
        .register(
          this.form.value
        )
        .subscribe(
          user => {
            console.log(user);
            // User success message
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-left',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              type: 'success',
              title: 'Your account has been created successfully'
            });
            this.signUpError = false;
            this.registered = true;
            (this.signUpBtn.nativeElement as HTMLButtonElement).innerHTML =
              '<i class="far fa-save"></i> Sign Up';
            (this.signUpBtn.nativeElement as HTMLButtonElement).setAttribute('disabled', 'false');
          },
          err => {
            this.signUpError = true;
            this.registered = false;
            (this.signUpBtn.nativeElement as HTMLButtonElement).innerHTML =
              '<i class="far fa-save"></i> Sign Up';
            (this.signUpBtn.nativeElement as HTMLButtonElement).setAttribute('disabled', 'false');
          }
        );
    }
  }
}
