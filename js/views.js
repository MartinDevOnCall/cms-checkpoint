// HTML templates for each route.
const escapeHTML = (str = "") =>
  str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const formatDate = (ts) =>
  new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const paragraphs = (text) =>
  escapeHTML(text)
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

const Views = {
  home(posts, categories, { query = "", category = "" } = {}) {
    const cards = posts.length
      ? posts
          .map(
            (p) => `
        <article class="card">
          ${p.image ? `<img src="${escapeHTML(p.image)}" alt="" loading="lazy" />` : ""}
          <div class="card-body">
            <span class="tag">${escapeHTML(p.category)}</span>
            <h2><a href="#/post/${p.id}">${escapeHTML(p.title)}</a></h2>
            <p class="muted">${formatDate(p.createdAt)}</p>
            <p>${escapeHTML(p.excerpt)}</p>
            <a class="btn btn-outline" href="#/post/${p.id}">Read more</a>
          </div>
        </article>`
          )
          .join("")
      : `<p class="empty">No posts found.</p>`;

    return `
      <section class="hero">
        <h1>Latest Content</h1>
        <p class="muted">Articles managed through the SimpleCMS admin panel.</p>
      </section>
      <form id="filterForm" class="filters">
        <input type="search" name="q" placeholder="Search posts..." value="${escapeHTML(query)}" />
        <select name="category">
          <option value="">All categories</option>
          ${categories
            .map((c) => `<option ${c === category ? "selected" : ""}>${escapeHTML(c)}</option>`)
            .join("")}
        </select>
      </form>
      <section class="grid">${cards}</section>`;
  },

  post(p) {
    if (!p || p.status !== "published") return Views.notFound();
    return `
      <article class="post">
        <a href="#/" class="muted">&larr; Back to posts</a>
        <span class="tag">${escapeHTML(p.category)}</span>
        <h1>${escapeHTML(p.title)}</h1>
        <p class="muted">Published ${formatDate(p.createdAt)}${
      p.updatedAt !== p.createdAt ? ` · Updated ${formatDate(p.updatedAt)}` : ""
    }</p>
        ${p.image ? `<img class="post-image" src="${escapeHTML(p.image)}" alt="" />` : ""}
        <div class="post-content">${paragraphs(p.content)}</div>
      </article>`;
  },

  login() {
    return `
      <section class="panel narrow">
        <h1>Admin Login</h1>
        <p class="muted">Demo credentials: <code>admin</code> / <code>admin123</code></p>
        <form id="loginForm" class="form">
          <label>Username<input name="username" required autocomplete="username" /></label>
          <label>Password<input name="password" type="password" required autocomplete="current-password" /></label>
          <p id="loginError" class="error hidden">Invalid username or password.</p>
          <button class="btn" type="submit">Log in</button>
        </form>
      </section>`;
  },

  dashboard(posts) {
    const published = posts.filter((p) => p.status === "published").length;
    const rows = posts.length
      ? posts
          .map(
            (p) => `
        <tr>
          <td data-label="Title">${escapeHTML(p.title)}</td>
          <td data-label="Category">${escapeHTML(p.category)}</td>
          <td data-label="Status"><span class="status ${p.status}">${p.status}</span></td>
          <td data-label="Updated">${formatDate(p.updatedAt)}</td>
          <td data-label="Actions" class="actions">
            ${p.status === "published" ? `<a href="#/post/${p.id}" class="btn btn-small btn-outline">View</a>` : ""}
            <a href="#/admin/edit/${p.id}" class="btn btn-small">Edit</a>
            <button class="btn btn-small btn-danger" data-delete="${p.id}">Delete</button>
          </td>
        </tr>`
          )
          .join("")
      : `<tr><td colspan="5" class="empty">No posts yet.</td></tr>`;

    return `
      <section class="panel">
        <div class="panel-head">
          <h1>Dashboard</h1>
          <div>
            <button id="resetBtn" class="btn btn-outline">Reset demo data</button>
            <a href="#/admin/new" class="btn">+ New Post</a>
          </div>
        </div>
        <div class="stats">
          <div class="stat"><strong>${posts.length}</strong><span>Total</span></div>
          <div class="stat"><strong>${published}</strong><span>Published</span></div>
          <div class="stat"><strong>${posts.length - published}</strong><span>Drafts</span></div>
        </div>
        <table class="table">
          <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  },

  editor(p) {
    const post = p || { title: "", category: "", excerpt: "", content: "", image: "", status: "draft" };
    return `
      <section class="panel">
        <a href="#/admin" class="muted">&larr; Back to dashboard</a>
        <h1>${p ? "Edit Post" : "New Post"}</h1>
        <form id="postForm" class="form" data-id="${p ? p.id : ""}">
          <label>Title<input name="title" required maxlength="120" value="${escapeHTML(post.title)}" /></label>
          <label>Category<input name="category" placeholder="General" value="${escapeHTML(post.category)}" /></label>
          <label>Image URL (optional)<input name="image" type="url" value="${escapeHTML(post.image)}" /></label>
          <label>Excerpt<textarea name="excerpt" rows="2" required maxlength="250">${escapeHTML(post.excerpt)}</textarea></label>
          <label>Content<textarea name="content" rows="10" required>${escapeHTML(post.content)}</textarea></label>
          <label>Status
            <select name="status">
              <option value="draft" ${post.status === "draft" ? "selected" : ""}>Draft</option>
              <option value="published" ${post.status === "published" ? "selected" : ""}>Published</option>
            </select>
          </label>
          <div class="form-actions">
            <button class="btn" type="submit">${p ? "Save changes" : "Create post"}</button>
            <a href="#/admin" class="btn btn-outline">Cancel</a>
          </div>
        </form>
      </section>`;
  },

  notFound() {
    return `<section class="panel narrow"><h1>Not found</h1><p>The page you requested does not exist.</p><a class="btn" href="#/">Go home</a></section>`;
  },
};
