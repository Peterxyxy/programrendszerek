import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  hidePassword = true;
  loginFailed = false;

  constructor(
    private dialogRef: MatDialogRef<LoginFormComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  getErrorMessage() {
    if (this.loginForm.controls.username.hasError('required')) {
      return 'A felhasználónév nem lehet üres!';
    }
    return '';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginFailed = true;
      return;
    }
    const { username, password } = this.loginForm.value;
    this.authService.login(username!, password!).subscribe({
      next: () => {
        this.loginFailed = false;
        this.dialogRef.close();
        this.router.navigateByUrl('app/product');
      },
      error: () => {
        this.loginFailed = true;
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}