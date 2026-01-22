import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@rdinvesiones/core/services/auth/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  error = '';
  successmsg = false;
  spiner = false;
  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      num_document: ["", [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      us_email: ['', [Validators.required, Validators.email]],
      us_password: ['', Validators.required],
      role: ["4"]
    });
  }
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    } else {
      this.authenticationService.registerAndLogin(this.signupForm.value)
      // .pipe(first())
      .subscribe(
        data => {
          if(data.code === 200) {
            this.successmsg = true;
            this.error = ""
            this.router.navigate(['/student/application']);
          } else {
            this.error = data.message
            this.successmsg = false
          }
          this.submitted = false;
        },
        error => {
          this.error = error ? error : '';
          this.submitted = false;
        });
    }
  }
}
