// Demo authentication (client-side only, for checkpoint purposes).
class Auth {
  constructor() {
    this.key = "simplecms_session";
    this.credentials = { username: "admin", password: "admin123" };
  }

  login(username, password) {
    const ok =
      username === this.credentials.username &&
      password === this.credentials.password;
    if (ok) sessionStorage.setItem(this.key, username);
    return ok;
  }

  logout() {
    sessionStorage.removeItem(this.key);
  }

  isLoggedIn() {
    return Boolean(sessionStorage.getItem(this.key));
  }
}
