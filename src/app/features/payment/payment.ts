import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { Router } from '@angular/router';


interface PaymentMethod {
    id: string;
    label: string;
    logo?: string;
    logoAlt?: string;
    width: string;
    height: string;
}

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, Header, Footer],
    templateUrl: './payment.html',
    styleUrls: ['./payment.css'],
})
export class Payment {
    selectedMethod: string = '';
    submitted = false;
    private router = inject(Router);


    paymentMethods: PaymentMethod[] = [
        {
            id: 'paypal',
            label: 'Paypal',
            logo: 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png',
            logoAlt: 'PayPal',
            width: 'auto',
            height: '30px',
        },
        {
            id: 'card',
            label: 'Credit or Debit Card',
            logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5DekXh0etR9Hr1UVsf_PjkhjKWQZaAueG0w&s',
            logoAlt: 'Visa Mastercard',
            width: 'auto',
            height: '80px',
        },
        {
            id: 'touchngo',
            label: "Touch'n Go E-wallet",
            logo: 'https://play-lh.googleusercontent.com/he5EAB7s3xJ5w5dHKP8avzHmyXw4Bkp-Y1u1owZBvNxjR3kLzzuoAwjSozrmN0TZY92mN0iv1sv4bonLO97r',
            logoAlt: 'TouchnGo',
            width: 'auto',
            height: '80px',
        },
        {
            id: 'grabpay',
            label: 'GrabPay',
            logo: 'https://assets.grab.com/wp-content/uploads/sites/8/2021/11/26235239/GrabPay_Final_Logo_RGB_green_StackedVersion-01.png',
            logoAlt: 'GrabPay',
            width: 'auto',
            height: '80px',
        },
    ];

    select(id: string): void {
        this.selectedMethod = id;
    }

    isSelected(id: string): boolean {
        return this.selectedMethod === id;
    }

    continue(): void {
        this.submitted = true;
        if (!this.selectedMethod) return;
        this.router.navigate(['/payment/status']);
    }
}