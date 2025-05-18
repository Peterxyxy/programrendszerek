import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register-form',
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
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegistrationFormComponent {
  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordAgain: new FormControl('', [Validators.required])
  });

  hidePassword = true;
  hidePasswordAgain = true;
  registrationFailed = false;
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<RegistrationFormComponent>,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  getUsernameError() {
    if (this.registrationForm.controls.username.hasError('required')) {
      return 'A felhasználónév nem lehet üres!';
    }
    return '';
  }

  getPasswordError() {
    if (this.registrationForm.controls.password.hasError('required')) {
      return 'A jelszó megadása kötelező';
    }
    if (this.registrationForm.controls.password.hasError('minlength')) {
      return 'A jelszónak legalább 6 karakter hosszúnak kell lennie';
    }
    return '';
  }

  getPasswordAgainError() {
    if (this.registrationForm.controls.passwordAgain.hasError('required')) {
      return 'A jelszó megerősítése kötelező';
    }
    if (
      this.registrationForm.controls.password.value !==
      this.registrationForm.controls.passwordAgain.value
    ) {
      return 'A két jelszó nem egyezik';
    }
    return '';
  }

  onSubmit() {
    if (
      this.registrationForm.invalid ||
      this.registrationForm.controls.password.value !== this.registrationForm.controls.passwordAgain.value
    ) {
      this.registrationFailed = true;
      this.errorMessage = this.getPasswordAgainError();
      return;
    }
    const { username, password } = this.registrationForm.value;
    this.authService.register(username!, password!).subscribe({
      next: () => {
        this.registrationFailed = false;
        this.dialogRef.close();
        this.snackBar.open('Sikeres regisztráció! Most már bejelentkezhet.', 'Értem', { duration: 3000 });
      },
      error: (err) => {
        this.registrationFailed = true;
        this.errorMessage = err?.error || 'Sikertelen regisztráció!';
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}