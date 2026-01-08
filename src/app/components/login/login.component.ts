import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  //login.html вместо login.component.html
  templateUrl: './login.html', 
  styles: [] // Убираем ссылку на несуществующий CSS файл
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        // если вошли успешно. то идем к пластинкам
        this.router.navigate(['/records']);
      },
      error: (err) => {
        // если ошибка, то показываем текст красным
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}