import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@rdinvesiones/core/services/auth/auth.service';
import { ResponseMessage } from 'src/app/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  successmsg = false;
  returnUrl: string;
  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    }
    );
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.authenticationService.login(this.f.email.value, this.f.password.value)
      .subscribe((res: ResponseMessage) => {
        this.router.navigate(['/dashboard']);
        }, error => {
          this.error = error.message;
          this.submitted = false
        })
    }
  }
}
