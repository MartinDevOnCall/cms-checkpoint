// Hash-based router and event wiring.
class App {
  constructor() {
    this.store = new ContentStore();
    this.auth = new Auth();
    this.root = document.getElementById("app");
    this.logoutBtn = document.getElementById("logoutBtn");
    this.filters = { query: "", category: "" };

    document.getElementById("year").textContent = new Date().getFullYear();
    this.logoutBtn.addEventListener("click", () => {
      this.auth.logout();
      this.toast("Logged out");
      location.hash = "#/";
    });
    window.addEventListener("hashchange", () => this.route());
    this.route();
  }

  route() {
    const path = location.hash.replace(/^#/, "") || "/";
    const parts = path.split("/").filter(Boolean);
    this.logoutBtn.classList.toggle("hidden", !this.auth.isLoggedIn());
    window.scrollTo(0, 0);

    if (parts.length === 0) return this.renderHome();
    if (parts[0] === "post" && parts[1]) return this.render(Views.post(this.store.get(parts[1])));

    if (parts[0] === "admin") {
      if (!this.auth.isLoggedIn()) return this.renderLogin();
      if (parts.length === 1) return this.renderDashboard();
      if (parts[1] === "new") return this.renderEditor();
      if (parts[1] === "edit" && parts[2]) {
        const post = this.store.get(parts[2]);
        return post ? this.renderEditor(post) : this.render(Views.notFound());
      }
    }
    this.render(Views.notFound());
  }

  render(html) {
    this.root.innerHTML = html;
  }

  renderHome() {
    const { query, category } = this.filters;
    const q = query.toLowerCase();
    const posts = this.store
      .published()
      .filter((p) => !category || p.category === category)
      .filter((p) => !q || (p.title + " " + p.excerpt + " " + p.content).toLowerCase().includes(q));
    this.render(Views.home(posts, this.store.categories(), this.filters));

    const form = document.getElementById("filterForm");
    form.addEventListener("submit", (e) => e.preventDefault());
    form.q.addEventListener("input", (e) => {
      this.filters.query = e.target.value;
      this.renderHome();
      const input = document.getElementById("filterForm").q;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
    form.category.addEventListener("change", (e) => {
      this.filters.category = e.target.value;
      this.renderHome();
    });
  }

  renderLogin() {
    this.render(Views.login());
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const { username, password } = e.target;
      if (this.auth.login(username.value.trim(), password.value)) {
        this.toast("Welcome back!");
        this.route();
      } else {
        document.getElementById("loginError").classList.remove("hidden");
      }
    });
  }

  renderDashboard() {
    this.render(Views.dashboard(this.store.all()));
    this.root.querySelectorAll("[data-delete]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const post = this.store.get(btn.dataset.delete);
        if (post && confirm(`Delete "${post.title}"?`)) {
          this.store.remove(post.id);
          this.toast("Post deleted");
          this.renderDashboard();
        }
      })
    );
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (confirm("Reset all content to the demo data?")) {
        this.store.reset();
        this.toast("Demo data restored");
        this.renderDashboard();
      }
    });
  }

  renderEditor(post) {
    this.render(Views.editor(post));
    document.getElementById("postForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const data = Object.fromEntries(new FormData(form));
      if (!data.title.trim() || !data.excerpt.trim() || !data.content.trim()) {
        return this.toast("Title, excerpt and content are required");
      }
      if (form.dataset.id) {
        this.store.update(form.dataset.id, data);
        this.toast("Post updated");
      } else {
        this.store.create(data);
        this.toast("Post created");
      }
      location.hash = "#/admin";
    });
  }

  toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }
}

new App();
