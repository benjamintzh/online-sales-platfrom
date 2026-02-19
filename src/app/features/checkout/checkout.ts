import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CartService } from '../../services/cart-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, Header, Footer],
    templateUrl: './checkout.html',
    styleUrls: ['./checkout.css'],
})
export class Checkout {
    private cartService = inject(CartService);
    private router = inject(Router);

    deliveryMode: 'deliver' | 'pickup' = 'deliver';
    shippingFee = 50;
    submitted = false;

    form = {
        fullName: '',
        phone: '',
        email: '',
        address1: '',
        address2: '',
        postalCode: '',
        city: '',
        state: '',
        country: '',
    };

    readonly numberPattern = '^[0-9]*$';
    readonly emailPattern = '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$';

    isInvalid(field: keyof typeof this.form): boolean {
        if (!this.submitted) return false;
        if (field === 'address2') return false;

        const value = this.form[field].trim();
        if (!value) return true;

        if (field === 'phone' || field === 'postalCode') {
            return !new RegExp(this.numberPattern).test(value);
        }
        if (field === 'email') {
            return !new RegExp(this.emailPattern).test(value);
        }
        return false;
    }


    get formValid(): boolean {
        const f = this.form;
        return !!(
            f.fullName.trim() &&
            f.address1.trim() &&
            f.city.trim() &&
            f.state.trim() &&
            f.country.trim() &&
            new RegExp(this.numberPattern).test(f.phone.trim()) && f.phone.trim() &&
            new RegExp(this.numberPattern).test(f.postalCode.trim()) && f.postalCode.trim() &&
            new RegExp(this.emailPattern).test(f.email.trim())
        );
    }

    get subtotal(): number { return this.cartService.subtotal; }
    get total(): number {
        return this.deliveryMode === 'deliver' ? this.subtotal + this.shippingFee : this.subtotal;
    }

    setMode(mode: 'deliver' | 'pickup'): void {
        this.deliveryMode = mode;
    }


    proceedToPayment(): void {
        this.submitted = true;
        if (!this.formValid) return;
        this.router.navigate(['/payment']);
    }
}