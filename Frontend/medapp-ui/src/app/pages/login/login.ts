import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements AfterViewInit {

  private backendUrl = "http://localhost:5114/api/auth/google";

  constructor(private router: Router, private http: HttpClient) { }

  ngAfterViewInit(): void {
    const init = () => {
      if (typeof (window as any).google !== 'undefined' && (window as any).google.accounts) {
        this.initializeGoogleSignIn();
        return true;
      }
      return false;
    };

    if (!init()) {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement | null;
      if (script) {
        script.addEventListener('load', () => init());
      } else {
        const interval = setInterval(() => {
          if (init()) {
            clearInterval(interval);
          }
        }, 200);
      }
    }
  }

  initializeGoogleSignIn() {
    const g = (window as any).google;
    g.accounts.id.initialize({
      client_id: "760977581854-i7gk41eun4mj6nid7ie59iccpfdbvlkj.apps.googleusercontent.com",
      callback: (response: any) => this.handleGoogleCredential(response),
    });

    const container = document.getElementById('googleBtn');
    if (container) {
      g.accounts.id.renderButton(container, {
        theme: 'filled_blue',
        size: 'large',
        width: '320'
      });
    }
  }

  // Called by template if present; prompts the Google One-Tap or chooser
  startGoogleLogin() {
    try {
      const g = (window as any).google;
      if (g && g.accounts && g.accounts.id) {
        // prompt may show One-Tap or the credential chooser
        g.accounts.id.prompt();
      } else {
        console.warn('Google Identity SDK not ready yet');
      }
    } catch (e) {
      console.error('startGoogleLogin error', e);
    }
  }

  handleGoogleCredential(response: any) {
    const idToken = response.credential;

    this.http.post(this.backendUrl, { idToken }).subscribe({
      next: (res: any) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("name", res.name);
        localStorage.setItem("email", res.email);

        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert("Google login failed. Try again.");
      }
    });
  }
}
