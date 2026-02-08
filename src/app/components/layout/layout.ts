import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { Navbar } from "../navbar/navbar";
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';


@Component({
  selector: 'app-layout',
  imports: [Sidebar, Navbar, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  showLayout = signal(true);

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        const isLoginPage = event.urlAfterRedirects === '/login';
        this.showLayout.set(!isLoginPage);
      });
  }
}
