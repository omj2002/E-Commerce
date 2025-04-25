import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.profileForm.patchValue({
      name: this.currentUser.name,
      email: this.currentUser.email
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmitProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    // For now, just show success message as we don't have a real backend
    this.successMessage = 'Profile updated successfully!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  onSubmitPassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    // For now, just show success message as we don't have a real backend
    this.successMessage = 'Password updated successfully!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
    
    // Reset the form
    this.passwordForm.reset();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 