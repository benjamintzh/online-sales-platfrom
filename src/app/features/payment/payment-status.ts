import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';

type Status = 'checking' | 'success';

@Component({
    selector: 'app-payment-status',
    standalone: true,
    imports: [CommonModule, Header, Footer],
    templateUrl: './payment-status.html',
    styleUrls: ['./payment-status.css'],
})
export class PaymentStatus implements OnInit {
    private router = inject(Router);

    status: Status = 'checking';
    countdown = 3;

    ngOnInit(): void {
        // Step 1 — 5s loading then mark success
        setTimeout(() => {
            this.status = 'success';

            // Step 2 — countdown then navigate
            const interval = setInterval(() => {
                this.countdown--;
                if (this.countdown === 0) {
                    clearInterval(interval);
                    this.router.navigate(['/order']);
                }
            }, 1000);

        }, 5000);
    }
}