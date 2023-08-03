import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  loginForm = new FormGroup({ // Form with username and password
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private http: HttpClient, private router: Router) {}

  login() { 
    // Validates user. If it's labeller it routes with the variable username
    const usernameValue = this.loginForm.get('username')?.value;
    const passwordValue = this.loginForm.get('password')?.value;
    const url = 'http://127.0.0.1:5000/authentication/validate'
    const data = {username: usernameValue,password: passwordValue}
    this.http.post(url, data).subscribe(
      {
        next: (data: any) => {
          console.log('Server response:', data);
          if (data == 'admin'){
            this.router.navigate(['/', data]);
          } else if (data == 'labeller'){
            const path = '/' + data;
            this.router.navigate([path], {queryParams:{ labeller:usernameValue }});
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Request completed.');
        }
      }
    );
  }
}

// good practice to create a class for service (http)