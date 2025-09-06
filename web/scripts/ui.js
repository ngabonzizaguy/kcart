import { vendors, orders, menuItems } from './data.js';

// Utility: query helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function initMicroInteractions() {
  if (window.anime) {
    anime.set('.stagger-in', { opacity: 0, translateY: 10 });
    anime({ targets: '.stagger-in', opacity: [0, 1], translateY: [10, 0], easing: 'easeOutQuad', duration: 600, delay: anime.stagger(60, { start: 100 }) });
    $$('[data-tap]').forEach((el) => {
      el.addEventListener('click', () => {
        anime({ targets: el, scale: [1, 0.98, 1], duration: 220, easing: 'easeOutQuad' });
      });
    });
  }
}

export function renderHome() {
  const list = $('#vendor-list');
  if (!list) return;
  list.innerHTML = vendors.map((v) => `
    <a class="list-item stagger-in" href="vendor.html?id=${v.id}" data-tap>
      <div style="display:flex; gap:12px; align-items:center;">
        <div style="width:72px;height:72px;border-radius:16px;overflow:hidden;flex-shrink:0;background:#f0f0f0">
          <img src="${v.image}" alt="${v.name}" style="width:100%;height:100%;object-fit:cover"/>
        </div>
        <div>
          <div class="headline">${v.name}</div>
          <div class="meta">${v.category} • ${v.delivery_time}</div>
          <div class="meta">${v.location}</div>
        </div>
      </div>
      <span class="badge-rating">★ ${v.rating}</span>
    </a>
  `).join('');
}

export function renderExplore() {
  const grid = $('#collections');
  if (!grid) return;
  const collections = [
    { id: 'c1', title: 'Trending Dishes', image: 'https://images.unsplash.com/photo-1604908812010-3182ee3370fa?w=800&auto=format&fit=crop' },
    { id: 'c2', title: 'Groceries Near You', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&auto=format&fit=crop' },
    { id: 'c3', title: 'Healthy Picks', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop' }
  ];
  grid.innerHTML = collections.map((c) => `
    <div class="card overflow stagger-in" style="overflow:hidden">
      <div style="position:relative;width:100%;height:160px;border-radius:20px;overflow:hidden">
        <img src="${c.image}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover"/>
      </div>
      <div style="padding:12px 4px 4px">
        <div class="headline">${c.title}</div>
      </div>
    </div>
  `).join('');
}

export function renderVendor() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const vendor = vendors.find((v) => v.id === id) || vendors[0];
  const header = $('#vendor-header');
  const menu = $('#vendor-menu');
  if (!header || !menu) return;
  header.innerHTML = `
    <div class="hero stagger-in">
      <div style="position:relative;height:160px;border-radius:20px;overflow:hidden;margin-bottom:12px">
        <img src="${vendor.image}" alt="${vendor.name}" style="width:100%;height:100%;object-fit:cover"/>
      </div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between">
        <div>
          <div class="title">${vendor.name}</div>
          <div class="meta">${vendor.category} • ${vendor.delivery_time}</div>
        </div>
        <span class="badge-rating">★ ${vendor.rating}</span>
      </div>
    </div>`;

  menu.innerHTML = menuItems.map((m) => `
    <div class="list-item stagger-in">
      <div>
        <div class="headline">${m.name}</div>
        <div class="meta">${m.desc}</div>
      </div>
      <button class="btn-primary" data-tap>Add — $${m.price.toFixed(2)}</button>
    </div>
  `).join('');
}

export function renderCart() {
  const items = [ { id: '1', name: 'Jollof Rice', qty: 2, price: 6.5 }, { id: '2', name: 'Plantain', qty: 1, price: 2.0 } ];
  const list = $('#cart-items');
  const summary = $('#cart-summary');
  if (!list || !summary) return;
  list.innerHTML = items.map((i) => `
    <div class="list-item stagger-in">
      <div>
        <div class="headline">${i.name}</div>
        <div class="meta">Qty ${i.qty} × $${i.price.toFixed(2)}</div>
      </div>
      <div class="headline">$${(i.qty * i.price).toFixed(2)}</div>
    </div>
  `).join('');
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  summary.innerHTML = `
    <div class="card" style="padding:16px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span class="meta">Subtotal</span>
        <span class="headline">$${total.toFixed(2)}</span>
      </div>
      <button class="btn-primary" style="width:100%;margin-top:12px" data-tap>Checkout (Test)</button>
    </div>`;
}

export function renderWallet() {
  const recent = $('#recent-orders');
  const balanceEl = $('#wallet-balance');
  if (!recent || !balanceEl) return;
  const balance = 124.5;
  balanceEl.textContent = `$${balance.toFixed(2)}`;
  recent.innerHTML = orders.map((o) => `
    <div class="list-item stagger-in">
      <div>
        <div class="headline">Order ${o.id}</div>
        <div class="meta">${o.items.length} items • ${new Date(o.created_at).toLocaleString()}</div>
      </div>
      <div style="text-align:right">
        <div class="headline">$${o.total.toFixed(2)}</div>
        <div class="meta" style="text-transform:capitalize">${o.status}</div>
      </div>
    </div>
  `).join('');
}

export function renderProfile() {
  const card = $('#profile-card');
  if (!card) return;
  card.innerHTML = `
    <div class="card" style="padding:16px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div class="headline">Test User</div>
          <div class="meta">test@example.com</div>
        </div>
        <button class="btn-secondary" data-tap>Edit</button>
      </div>
    </div>
    <div class="card" style="padding:16px;margin-top:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span>Notifications</span>
        <span class="pill">Enabled</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span>Address</span>
        <span class="meta">Add</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span>Payment Methods</span>
        <span class="meta">Stripe • MoMo (test)</span>
      </div>
    </div>
    <div class="card" style="padding:16px;margin-top:12px">
      <button class="btn-primary" style="width:100%" data-tap>Switch to Live (requires creds)</button>
    </div>`;
}

export function setupNavActive(pathname) {
  $$('.tabbar a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && pathname.endsWith(href)) {
      a.style.opacity = '1';
      a.style.fontWeight = '600';
    } else {
      a.style.opacity = '0.7';
    }
  });
}
