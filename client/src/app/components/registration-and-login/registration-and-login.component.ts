import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RegistrationFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'app-registration-and-login',
  imports: [],
  templateUrl: './registration-and-login.component.html',
  styleUrl: './registration-and-login.component.scss'
})
export class RegistrationAndLoginComponent {
  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openLoginDialog() {
    this.dialog.open(LoginFormComponent, {
      autoFocus: true,
      hasBackdrop: true,
      minWidth: '320px',
      panelClass: 'dialog-design'
    });
  }


openRegisterDialog() {
  this.dialog.open(RegistrationFormComponent, {
    autoFocus: true,
    hasBackdrop: true,
    minWidth: '320px',
    panelClass: 'dialog-design'
  });
}
}
