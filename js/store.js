// Data layer: all content is persisted in localStorage.
class ContentStore {
  constructor(key = "simplecms_posts") {
    this.key = key;
    if (!localStorage.getItem(this.key)) this.seed();
  }

  all() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  }

  save(posts) {
    localStorage.setItem(this.key, JSON.stringify(posts));
  }

  published() {
    return this.all()
      .filter((p) => p.status === "published")
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  get(id) {
    return this.all().find((p) => p.id === id);
  }

  create(data) {
    const now = Date.now();
    const post = {
      id: now.toString(36) + Math.random().toString(36).slice(2, 6),
      title: data.title.trim(),
      category: data.category.trim() || "General",
      excerpt: data.excerpt.trim(),
      content: data.content.trim(),
      image: data.image.trim(),
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };
    this.save([post, ...this.all()]);
    return post;
  }

  update(id, data) {
    const posts = this.all().map((p) =>
      p.id === id
        ? {
            ...p,
            title: data.title.trim(),
            category: data.category.trim() || "General",
            excerpt: data.excerpt.trim(),
            content: data.content.trim(),
            image: data.image.trim(),
            status: data.status,
            updatedAt: Date.now(),
          }
        : p
    );
    this.save(posts);
  }

  remove(id) {
    this.save(this.all().filter((p) => p.id !== id));
  }

  categories() {
    return [...new Set(this.published().map((p) => p.category))].sort();
  }

  reset() {
    localStorage.removeItem(this.key);
    this.seed();
  }

  seed() {
    const day = 86400000;
    const now = Date.now();
    this.save([
      {
        id: "welcome",
        title: "Welcome to SimpleCMS",
        category: "Announcements",
        excerpt: "A lightweight content management system built with plain HTML, CSS and JavaScript.",
        content:
          "SimpleCMS lets you create, edit, publish and delete content from a browser-based admin panel.\n\nGo to the Admin page, sign in with the demo credentials, and start writing. Drafts stay hidden from the public site until you publish them.",
        image: "https://picsum.photos/seed/welcome/800/400",
        status: "published",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "getting-started",
        title: "Getting Started with the Admin Panel",
        category: "Guides",
        excerpt: "Learn how to manage posts: create, edit, publish and delete.",
        content:
          "1. Open the Admin page and log in.\n2. Click \"New Post\" to write content.\n3. Choose Draft or Published.\n4. Use Edit and Delete on the dashboard table to manage existing posts.\n\nAll data is saved in your browser's localStorage.",
        image: "https://picsum.photos/seed/guide/800/400",
        status: "published",
        createdAt: now - day,
        updatedAt: now - day,
      },
      {
        id: "draft-example",
        title: "This Is a Draft",
        category: "Guides",
        excerpt: "Drafts are only visible inside the admin dashboard.",
        content: "Publish me from the admin panel to see me on the home page.",
        image: "",
        status: "draft",
        createdAt: now - 2 * day,
        updatedAt: now - 2 * day,
      },
    ]);
  }
}
