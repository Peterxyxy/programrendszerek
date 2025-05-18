import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  productForm: FormGroup;
  isEdit: boolean;

  constructor(
    private dialogRef: MatDialogRef<ProductFormComponent>,
    private authService: AuthService,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product }
  ) {
    this.productForm = new FormGroup({
      name: new FormControl(this.data?.product?.name || '', [Validators.required]),
      price: new FormControl(this.data?.product?.price || 1, [Validators.required, Validators.min(0)]),
      stock: new FormControl(this.data?.product?.stock || 1, [Validators.required, Validators.min(0)]),
      description: new FormControl(this.data?.product?.description || ''),
    });
    this.isEdit = !!this.data?.product;
  }

onSubmit() {
  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched(); // Trigger validation messages
    return;
  }
  const productData = this.productForm.value;
  if (this.isEdit && this.data.product) {
    this.productService.updateProduct(this.data.product._id, productData).subscribe({
      next: (updated) => this.dialogRef.close(updated)
    });
  } else {
    this.productService.createProduct(productData).subscribe({
      next: (created) => this.dialogRef.close(created)
    });
  }
}

  closeDialog() {
    this.dialogRef.close();
  }
}