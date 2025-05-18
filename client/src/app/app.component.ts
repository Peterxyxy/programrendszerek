import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterModule, MatIconModule, MatToolbarModule, MatButtonModule, MatMenuModule, NgIf],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MobilÁruház';

  constructor(
    public router: Router,
    public authService: AuthService
  ) {}

  redirectToPageWithComponentReload(uri: string): void {
    this.router.navigateByUrl('app/not-found', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri])
    );
  }

  Logout(): void {
    this.authService.logout();
  }
}