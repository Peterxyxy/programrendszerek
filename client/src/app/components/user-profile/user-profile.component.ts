import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { AddressService } from '../../services/address.service';
import { User } from '../../models/user';
import { Address } from '../../models/address';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  addresslist: Address[] = [];
  profileForm!: FormGroup;
  passwordFailed = false;
  errorMessage = '';
  addressForms: FormGroup[] = [];
  newAddressForm!: FormGroup;

  constructor(
    private userService: UserService,
    private addressService: AddressService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.profileForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordAgain: ['', [Validators.required]]
      }, { validators: this.passwordsMatchValidator });

      // Load addresses for the user
      this.addressService.getAddresses(user.username).subscribe(addresses => {
        this.addresslist = addresses;
        this.addressForms = this.addresslist.map(address =>
          this.fb.group({
            street: [address.street],
            city: [address.city],
            county: [address.county],
            postalCode: [address.postalCode],
            country: [address.country]
          })
        );
      });
    });

    this.newAddressForm = this.fb.group({
      street: [''],
      city: [''],
      county: [''],
      postalCode: [''],
      country: ['']
    });
  }


  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const passwordAgain = group.get('passwordAgain')?.value;
    return password === passwordAgain ? null : { passwordsMismatch: true };
  }

  getPasswordError() {
    if (this.profileForm.controls['password'].hasError('required')) {
      return 'A jelszó megadása kötelező';
    }
    if (this.profileForm.controls['password'].hasError('minlength')) {
      return 'A jelszónak legalább 6 karakter hosszúnak kell lennie';
    }
    return '';
  }

  getPasswordAgainError() {
    if (this.profileForm.controls['passwordAgain'].hasError('required')) {
      return 'A jelszó megerősítése kötelező';
    }
    if (this.profileForm.hasError('passwordsMismatch')) {
      return 'A két jelszó nem egyezik';
    }
    return '';
  }

  saveProfile() {
    if (
      this.profileForm.invalid ||
      this.profileForm.controls['password'].value !== this.profileForm.controls['passwordAgain'].value
    ) {
      this.passwordFailed = true;
      this.errorMessage = this.getPasswordAgainError();
      return;
    }
    // Only send password if filled
    const password = this.profileForm.controls['password'].value;
    if (!password) return;
    this.userService.updateCurrentUser({ password }).subscribe({
      next: user => {
        this.passwordFailed = false;
        this.errorMessage = '';
        this.snackBar.open('Profil sikeresen mentve!', 'Értem', { duration: 2000 });
        this.user = user;
        this.profileForm.reset();
      },
      error: () => {
        this.snackBar.open('A mentés nem sikerült!', 'Értem', { duration: 2000 });
      }
    });
  }

saveAddress(index: number) {
  if (this.addressForms[index].invalid || !this.user) return;
  const addressId = this.addresslist[index]._id;
  this.addressService.updateAddress(this.user.username, addressId, this.addressForms[index].value).subscribe({
    next: () => {
      this.snackBar.open('Cím sikeresen mentve!', 'Értem', { duration: 2000 });
      this.addressForms[index].markAsPristine(); // Hide the button after save
    },
    error: () => {
      this.snackBar.open('A cím mentése nem sikerült!', 'Értem', { duration: 2000 });
    }
  });
}

  addAddress() {
    if (this.newAddressForm.invalid || !this.user) return;
    this.addressService.addAddress(this.user.username, this.newAddressForm.value).subscribe({
      next: (address) => {
        this.snackBar.open('Cím hozzáadva!', 'Értem', { duration: 2000 });
        this.addresslist = address;
        this.addressForms = this.addresslist.map(address =>
          this.fb.group({
            street: [address.street],
            city: [address.city],
            county: [address.county],
            postalCode: [address.postalCode],
            country: [address.country]
          })
        );
        this.newAddressForm.reset();
      },
      error: () => {
        this.snackBar.open('A cím hozzáadása nem sikerült!', 'Értem', { duration: 2000 });
      }
    });
  }
}