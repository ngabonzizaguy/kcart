// Basic page wiring: render placeholders and bind simple interactions.
// Replace DOM rendering with your framework of choice later.

(function () {
  const { vendors, menus, user } = window.KCART || {};
  if (!vendors) return;

  // Home: vendor grid
  const vendorGrid = document.getElementById('vendor-grid');
  if (vendorGrid) {
    vendorGrid.innerHTML = vendors.map(v => `
      <a class="card" href="vendor.html?id=${v.id}">
        <img class="card__media" src="${v.cover}" alt="${v.name}">
        <div class="card__body">
          <div class="card__title">${v.name}</div>
          <div class="card__meta">${v.rating} ★ • ${v.distanceKm} km</div>
        </div>
      </a>
    `).join('');
  }

  // Explore: chips + grid (reuse vendors)
  const chipList = document.getElementById('chip-list');
  const exploreGrid = document.getElementById('explore-grid');
  if (chipList && exploreGrid) {
    const chips = ['All', 'Trending', 'Near You', 'Top Rated', 'Healthy', 'Pizza', 'Sushi'];
    chipList.innerHTML = chips.map(c => `<button class="chip">${c}</button>`).join('');
    exploreGrid.innerHTML = vendors.map(v => `
      <a class="card" href="vendor.html?id=${v.id}">
        <img class="card__media" src="${v.cover}" alt="${v.name}">
        <div class="card__body">
          <div class="card__title">${v.name}</div>
          <div class="card__meta">${v.categories.join(' • ')}</div>
        </div>
      </a>
    `).join('');
  }

  // Vendor: hero + menu
  const vendorHero = document.getElementById('vendor-hero');
  const params = new URLSearchParams(location.search);
  const vendorId = params.get('id') || vendors[0]?.id;
  const vendor = vendors.find(v => v.id === vendorId);
  if (vendorHero && vendor) {
    vendorHero.innerHTML = `
      <img src="${vendor.logo}" alt="${vendor.name}">
      <div>
        <div class="card__title">${vendor.name}</div>
        <div class="meta">${vendor.rating} ★ • ${vendor.distanceKm} km • ${vendor.categories.join(', ')}</div>
      </div>
    `;
    const grid = document.getElementById('menu-grid');
    const items = (menus[vendor.id] || []);
    grid.innerHTML = items.map(m => `
      <div class="menu-item">
        <img src="${m.img}" alt="${m.title}">
        <div class="menu-item__content">
          <div class="menu-item__title">${m.title}</div>
          <div class="menu-item__price">$${m.price.toFixed(2)}</div>
        </div>
      </div>
    `).join('');
  }

  // Profile: user data
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  if (userName && userEmail && user) {
    userName.textContent = user.name;
    userEmail.textContent = user.email;
  }

  // Cart: sample items from menus
  const cartList = document.getElementById('cart-list');
  if (cartList) {
    const sample = (menus[vendors[0].id] || []).slice(0, 2);
    cartList.innerHTML = sample.map(m => `
      <div class="item">
        <img class="thumb" src="${m.img}" alt="${m.title}">
        <div>
          <div class="card__title">${m.title}</div>
          <div class="card__meta">1 × $${m.price.toFixed(2)}</div>
        </div>
        <div>$${m.price.toFixed(2)}</div>
      </div>
    `).join('');
    const subtotal = sample.reduce((s, m) => s + m.price, 0);
    const delivery = 2.99;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('delivery').textContent = `$${delivery.toFixed(2)}`;
    document.getElementById('total').textContent = `$${(subtotal + delivery).toFixed(2)}`;
  }
})();

