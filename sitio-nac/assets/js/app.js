/* =========================================================================
   New Athletic Clothes — Interfaz común (header, footer, carrito, tarjetas)
   ========================================================================= */
(function () {
  const S = window.SITE;
  const C = window.Catalog;
  // Ruta raíz relativa (las páginas legales están en /legal/ y usan "../")
  const ROOT = document.body.dataset.root || "";
  const url = (p) => ROOT + p;

  // ---------- Utilidades ----------
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /** Formato colombiano: $139.000 */
  function money(n) {
    const v = Math.round(Number(n) || 0);
    return "$" + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function waLink(text) {
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text || S.whatsappGreeting);
  }

  // ---------- Íconos (SVG simples) ----------
  const ICON = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z"/><path d="M9.3 9.2c.2 2.3 1.8 4.1 4.3 4.9l1-1.1 1.8.8-.4 1.6c-3.9.2-7.6-3.2-7.5-7l1.6-.4.8 1.8Z" fill="currentColor" stroke="none"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3a7 7 0 0 1-3.8-1.2v6.1a5.7 5.7 0 1 1-5.7-5.7l.6.1v3.1a2.7 2.7 0 1 0 2 2.6V3h3Z"/></svg>',
  };

  /** Imagen de ejemplo (gris neutro) para productos sin foto */
  function placeholder(label) {
    return '<svg class="ph" viewBox="0 0 400 400" role="img" aria-label="' + esc(label || "Imagen de ejemplo") + '">' +
      '<rect width="400" height="400" fill="#efefef"/>' +
      '<rect x="138" y="96" width="124" height="30" rx="6" fill="#d2d2d2"/>' +
      '<rect x="122" y="124" width="156" height="186" rx="18" fill="#dcdcdc"/>' +
      '<rect x="122" y="178" width="156" height="66" fill="#c9c9c9"/>' +
      '<text x="200" y="352" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="3" fill="#9a9a9a">FOTO DE EJEMPLO</text>' +
      "</svg>";
  }

  function productImage(p, i = 0, cls = "") {
    const src = p.images && p.images[i];
    if (!src) return placeholder(p.name);
    // Si la foto aún no existe en /products, se reemplaza por el recuadro gris
    return '<img class="' + cls + '" src="' + esc(url(src)) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" width="600" height="600" onerror="this.outerHTML=window.NAC.placeholder(this.alt)">';
  }

  function priceHTML(p) {
    const info = C.priceInfo(p);
    if (info.min !== info.max) return '<span class="price-new">' + money(info.min) + " – " + money(info.max) + "</span>";
    if (info.onSale && info.regular > info.min) {
      return '<span class="price-old"><span class="sr-only">Antes </span>' + money(info.regular) + '</span><span class="price-new"><span class="sr-only">Ahora </span>' + money(info.min) + "</span>";
    }
    return '<span class="price-new">' + money(info.min) + "</span>";
  }

  // ---------- Tarjeta de producto ----------
  function productCard(p) {
    const soldOut = !C.inStock(p);
    const sale = C.isOnSale(p);
    return (
      '<a class="card' + (soldOut ? " is-soldout" : "") + '" href="' + url("producto.html?p=" + encodeURIComponent(p.slug)) + '">' +
        '<div class="card__media">' +
          (sale ? '<span class="badge">¡Oferta!</span>' : "") +
          (soldOut ? '<span class="badge badge--soldout' + (sale ? " badge--second" : "") + '">Agotado</span>' : "") +
          productImage(p) +
          '<div class="card__overlay" aria-hidden="true"><span>Ver producto</span></div>' +
        "</div>" +
        '<h3 class="card__title">' + esc(p.name) + "</h3>" +
        '<p class="card__price">' + priceHTML(p) + "</p>" +
      "</a>"
    );
  }

  function productGrid(list, cols = 4) {
    if (!list.length) return '<div class="empty"><p>No hay productos para mostrar por ahora.</p><a class="btn" href="' + url("index.html") + '">Volver al inicio</a></div>';
    return '<div class="grid grid--' + cols + '">' + list.map(productCard).join("") + "</div>";
  }

  // ---------- Barra superior ----------
  function renderTopbar() {
    const el = $("#nac-topbar");
    if (!el) return;
    const items = S.marquee.map((m) => '<span class="marquee__item">' + esc(m) + "</span>").join("");
    // se repite el grupo para que el desplazamiento sea continuo
    const group = '<div class="marquee__group">' + items + items + items + "</div>";
    el.innerHTML = '<div class="topbar" role="region" aria-label="Anuncios"><p class="sr-only">' + esc(S.marquee.join(". ")) + '</p><div class="marquee" aria-hidden="true">' + group + group + "</div></div>";
  }

  // ---------- Header ----------
  function renderHeader() {
    const el = $("#nac-header");
    if (!el) return;
    const page = document.body.dataset.page;
    const cur = (name) => (page === name ? ' aria-current="page"' : "");
    const catLinks = S.categories.map((c) => '<li><a href="' + url("categoria.html?c=" + c.slug) + '">' + esc(c.name) + "</a></li>").join("");
    const brandLinks = S.brands.map((b) => '<li><a href="' + url("marca.html?m=" + b.slug) + '">' + esc(b.name) + "</a></li>").join("");
    const account = S.features.showAccount ? '<li><a class="nav__link" href="' + url("cuenta.html") + '">Mi cuenta</a></li>' : "";

    el.innerHTML =
      '<header class="header header--mobile-logo">' +
        '<div class="container header__inner">' +
          '<button class="icon-btn hamburger" type="button" aria-label="Abrir menú" aria-controls="mobile-menu" aria-expanded="false" data-open-menu>' + ICON.menu + "</button>" +
          '<a class="header__logo" href="' + url("index.html") + '" aria-label="' + esc(S.name) + ' — inicio"><img src="' + url("assets/brand/logo-blanco.png") + '" alt="' + esc(S.name) + '" width="600" height="210"></a>' +
          '<nav class="header__nav" aria-label="Principal"><ul class="nav">' +
            '<li><a class="nav__link" href="' + url("index.html") + '"' + cur("home") + ">Inicio</a></li>" +
            '<li><button class="nav__link" type="button" aria-expanded="false" aria-controls="mega-cat" data-mega="mega-cat">Categorías ' + ICON.chevron + "</button></li>" +
            '<li><button class="nav__link" type="button" aria-expanded="false" aria-controls="mega-brand" data-mega="mega-brand">Marcas ' + ICON.chevron + "</button></li>" +
            '<li><a class="nav__link" href="' + url("combos.html") + '"' + cur("combos") + ">Combos</a></li>" +
            '<li><a class="nav__link" href="' + url("ofertas.html") + '"' + cur("ofertas") + ">Ofertas</a></li>" +
            account +
          "</ul></nav>" +
          '<div class="header__actions">' +
            '<button class="icon-btn" type="button" aria-label="Abrir carrito" data-open-cart>' + ICON.cart + '<span class="cart-count" data-cart-count data-count="0">0</span></button>' +
            '<button class="icon-btn" type="button" aria-label="Buscar productos" aria-controls="search" aria-expanded="false" data-toggle-search>' + ICON.search + "</button>" +
          "</div>" +
          '<div class="mega" id="mega-cat" role="region" aria-label="Categorías"><ul class="mega__grid">' + catLinks + "</ul></div>" +
          '<div class="mega" id="mega-brand" role="region" aria-label="Marcas"><ul class="mega__grid">' + brandLinks + "</ul></div>" +
        "</div>" +
        '<div class="search" id="search"><div class="container"><form class="search__form" role="search" action="' + url("buscar.html") + '" autocomplete="off">' +
          '<label class="sr-only" for="search-input">Buscar productos</label>' +
          '<input class="search__input" id="search-input" name="q" type="search" placeholder="¿Qué suplemento buscas?" aria-autocomplete="list" aria-controls="search-results">' +
          '<button class="icon-btn search__close" type="button" aria-label="Cerrar búsqueda" data-toggle-search>' + ICON.close + "</button>" +
          '<ul class="search__results" id="search-results" role="listbox"></ul>' +
        "</form></div></div>" +
      "</header>" +
      // Menú móvil
      '<div class="drawer-backdrop" data-backdrop></div>' +
      '<aside class="mobile-menu" id="mobile-menu" aria-label="Menú" aria-hidden="true">' +
        '<div class="mobile-menu__head"><img src="' + url("assets/brand/logo-blanco.png") + '" alt="' + esc(S.name) + '" width="600" height="210"><button class="icon-btn" type="button" aria-label="Cerrar menú" data-close-drawers>' + ICON.close + "</button></div>" +
        "<ul>" +
          '<li><a class="mobile-menu__link" href="' + url("index.html") + '">Inicio</a></li>' +
          '<li><button class="mobile-menu__toggle" type="button" aria-expanded="false" aria-controls="m-cat">Categorías ' + ICON.chevron + '</button><ul class="mobile-menu__sub" id="m-cat">' + catLinks + "</ul></li>" +
          '<li><button class="mobile-menu__toggle" type="button" aria-expanded="false" aria-controls="m-brand">Marcas ' + ICON.chevron + '</button><ul class="mobile-menu__sub" id="m-brand">' + brandLinks + "</ul></li>" +
          '<li><a class="mobile-menu__link" href="' + url("combos.html") + '">Combos</a></li>' +
          '<li><a class="mobile-menu__link" href="' + url("ofertas.html") + '">Ofertas</a></li>' +
          '<li><a class="mobile-menu__link" href="' + url("carrito.html") + '">Carrito</a></li>' +
        "</ul>" +
        '<div class="mobile-menu__foot"><a class="btn btn--light" href="' + waLink() + '" target="_blank" rel="noopener">Escríbenos por WhatsApp</a></div>' +
      "</aside>";
  }

  // ---------- Footer ----------
  function renderFooter() {
    const el = $("#nac-footer");
    if (!el) return;
    const legal = S.legal.map((l) => '<li><a href="' + url(l.href) + '">' + esc(l.label) + "</a></li>").join("");
    const pays = S.paymentMethods.map((m) => "<li>" + esc(m) + "</li>").join("");
    const soc = [];
    if (S.social.facebook) soc.push('<a href="' + esc(S.social.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + ICON.facebook + "</a>");
    if (S.social.instagram) soc.push('<a href="' + esc(S.social.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICON.instagram + "</a>");
    if (S.social.tiktok) soc.push('<a href="' + esc(S.social.tiktok) + '" target="_blank" rel="noopener" aria-label="TikTok">' + ICON.tiktok + "</a>");
    soc.push('<a href="' + waLink() + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ICON.chat + "</a>");
    const year = new Date().getFullYear();

    el.innerHTML =
      '<footer class="footer">' +
        '<div class="container footer__grid">' +
          '<div><h3>Información</h3><ul class="footer__links">' + legal + "</ul></div>" +
          '<div class="pay"><h3>Medios de pago</h3><ul class="pay__list">' + pays + '</ul><p class="pay__note">' + esc(S.paymentNote) + '</p>' +
            '<a class="pay__wa" href="' + waLink() + '" target="_blank" rel="noopener">' + ICON.chat + esc(S.whatsappDisplay) + "</a></div>" +
          '<div><img class="footer__logo" src="' + url("assets/brand/logo-blanco.png") + '" alt="' + esc(S.name) + '" loading="lazy" width="600" height="210"><h3>Síguenos en redes sociales</h3><div class="socials">' + soc.join("") + '</div><p class="footer__line">' + esc(S.footerLine) + "</p></div>" +
        "</div>" +
        '<div class="footer__bottom"><div class="container">© ' + year + " " + esc(S.name) + ". Todos los derechos reservados.</div></div>" +
      "</footer>";
  }

  // ---------- Flotantes ----------
  function renderFloats() {
    const wrap = document.createElement("div");
    wrap.innerHTML =
      '<a class="fab-wa" href="' + waLink() + '" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">' + ICON.chat + "</a>" +
      '<button class="to-top" type="button" aria-label="Volver arriba">' + ICON.up + "</button>" +
      '<aside class="cart-drawer" id="cart-drawer" aria-label="Carrito" aria-hidden="true">' +
        '<div class="cart-drawer__head"><h2>Tu carrito</h2><button class="icon-btn" type="button" aria-label="Cerrar carrito" data-close-drawers>' + ICON.close + "</button></div>" +
        '<div class="cart-drawer__body" data-cart-lines></div>' +
        '<div class="cart-drawer__foot" data-cart-foot></div>' +
      "</aside>" +
      '<div class="toast" role="status" aria-live="polite"></div>';
    document.body.append(...wrap.childNodes);

    const toTop = $(".to-top");
    const onScroll = () => toTop.classList.toggle("is-visible", window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));
  }

  function toast(msg) {
    const t = $(".toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("is-visible"), 2200);
  }

  // =====================================================================
  // CARRITO (se guarda en el navegador con localStorage)
  // =====================================================================
  const CART_KEY = "nac_cart_v1";
  const Cart = {
    read() {
      try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return Cart._mem || []; }
    },
    write(items) {
      Cart._mem = items;
      try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* modo privado: queda en memoria */ }
      Cart.render();
    },
    key: (id, variant) => id + "::" + (variant || ""),
    add(id, variant, qty = 1) {
      const items = Cart.read();
      const k = Cart.key(id, variant);
      const found = items.find((i) => i.key === k);
      if (found) found.qty += qty; else items.push({ key: k, id, variant: variant || "", qty });
      Cart.write(items);
    },
    setQty(key, qty) {
      let items = Cart.read();
      const it = items.find((i) => i.key === key);
      if (!it) return;
      it.qty = Math.max(1, Math.min(99, qty | 0));
      Cart.write(items);
    },
    remove(key) { Cart.write(Cart.read().filter((i) => i.key !== key)); },
    clear() { Cart.write([]); },
    /** Líneas con datos del producto (ignora productos que ya no existen) */
    lines() {
      return Cart.read().map((i) => {
        const p = C.getProductById(i.id);
        if (!p) return null;
        const unit = C.unitPrice(p, i.variant);
        return { ...i, product: p, unit, total: unit * i.qty };
      }).filter(Boolean);
    },
    count() { return Cart.read().reduce((a, i) => a + i.qty, 0); },
    subtotal() { return Cart.lines().reduce((a, l) => a + l.total, 0); },
    listeners: [],
    render() {
      $$("[data-cart-count]").forEach((el) => { const n = Cart.count(); el.textContent = n; el.dataset.count = n; });
      renderDrawer();
      Cart.listeners.forEach((fn) => fn());
    },
  };

  function lineHTML(l, compact) {
    const p = l.product;
    const vlabel = l.variant ? '<div class="cart-line__variant">' + esc(p.variantLabel || "Opción") + ": " + esc(l.variant) + "</div>" : '<div class="cart-line__variant"></div>';
    return (
      '<div class="cart-line" data-key="' + esc(l.key) + '">' +
        '<a class="cart-line__img" href="' + url("producto.html?p=" + p.slug) + '">' + productImage(p) + "</a>" +
        "<div>" +
          '<a class="cart-line__name" href="' + url("producto.html?p=" + p.slug) + '">' + esc(p.name) + "</a>" + vlabel +
          '<div class="qty qty--sm"><button type="button" aria-label="Restar uno" data-qty="-1">−</button><input type="number" min="1" max="99" value="' + l.qty + '" aria-label="Cantidad" data-qty-input><button type="button" aria-label="Sumar uno" data-qty="1">+</button></div>' +
        "</div>" +
        '<div><div class="cart-line__price">' + money(l.total) + '</div><button class="cart-line__remove" type="button" data-remove>Quitar</button></div>' +
      "</div>"
    );
  }

  function bindLines(container) {
    container.addEventListener("click", (e) => {
      const line = e.target.closest(".cart-line");
      if (!line) return;
      const key = line.dataset.key;
      if (e.target.closest("[data-remove]")) { Cart.remove(key); return; }
      const b = e.target.closest("[data-qty]");
      if (b) {
        const it = Cart.read().find((i) => i.key === key);
        if (it) Cart.setQty(key, it.qty + Number(b.dataset.qty));
      }
    });
    container.addEventListener("change", (e) => {
      if (!e.target.matches("[data-qty-input]")) return;
      const key = e.target.closest(".cart-line").dataset.key;
      Cart.setQty(key, Number(e.target.value) || 1);
    });
  }

  function renderDrawer() {
    const body = $("[data-cart-lines]");
    const foot = $("[data-cart-foot]");
    if (!body) return;
    const lines = Cart.lines();
    if (!lines.length) {
      body.innerHTML = '<div class="cart-empty"><p>Tu carrito está vacío.</p></div>';
      foot.innerHTML = '<a class="btn btn--outline btn--block" href="' + url("index.html") + '">Ver productos</a>';
      return;
    }
    body.innerHTML = lines.map((l) => lineHTML(l)).join("");
    foot.innerHTML =
      '<div class="cart-total"><span>Subtotal</span><span>' + money(Cart.subtotal()) + "</span></div>" +
      '<p class="fine" style="margin:0">El envío se coordina por WhatsApp según tu ciudad.</p>' +
      '<a class="btn btn--block" href="' + url("carrito.html#pedido") + '">Finalizar pedido</a>' +
      '<a class="btn btn--outline btn--block" href="' + url("carrito.html") + '">Ver carrito</a>';
  }

  // ---------- Mensaje de pedido por WhatsApp ----------
  function orderMessage(customer) {
    const lines = Cart.lines();
    let msg = S.whatsappGreeting + ".\n\nQuiero hacer este pedido:\n";
    lines.forEach((l, i) => {
      msg += "\n" + (i + 1) + ". " + l.product.name;
      if (l.variant) msg += " (" + (l.product.variantLabel || "Opción") + ": " + l.variant + ")";
      msg += "\n   Cantidad: " + l.qty + " x " + money(l.unit) + " = " + money(l.total);
    });
    const sub = Cart.subtotal();
    msg += "\n\nSubtotal: " + money(sub);
    msg += "\nEnvío: por confirmar";
    msg += "\nTotal productos: " + money(sub);
    if (customer) {
      msg += "\n\nMis datos:";
      msg += "\nNombre: " + (customer.name || "");
      msg += "\nCiudad: " + (customer.city || "");
      if (customer.notes) msg += "\nNotas: " + customer.notes;
    }
    return msg;
  }

  // =====================================================================
  // Interacciones del header (mega menú, menú móvil, búsqueda, drawers)
  // =====================================================================
  function openDrawer(el) {
    closeDrawers();
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    $("[data-backdrop]").classList.add("is-open");
    document.body.classList.add("no-scroll");
    const f = el.querySelector("button, a, input");
    f && f.focus();
  }
  function closeDrawers() {
    $$(".mobile-menu, .cart-drawer").forEach((d) => { d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true"); });
    const bd = $("[data-backdrop]"); bd && bd.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    $$("[data-open-menu]").forEach((b) => b.setAttribute("aria-expanded", "false"));
  }
  function closeMegas(except) {
    $$("[data-mega]").forEach((b) => {
      if (b === except) return;
      b.setAttribute("aria-expanded", "false");
      document.getElementById(b.dataset.mega).classList.remove("is-open");
    });
  }

  function bindHeader() {
    // Mega menús: clic o pasar el mouse (escritorio)
    $$("[data-mega]").forEach((btn) => {
      const panel = document.getElementById(btn.dataset.mega);
      const open = () => { closeMegas(btn); btn.setAttribute("aria-expanded", "true"); panel.classList.add("is-open"); };
      const close = () => { btn.setAttribute("aria-expanded", "false"); panel.classList.remove("is-open"); };
      btn.addEventListener("click", () => (btn.getAttribute("aria-expanded") === "true" ? close() : open()));
      let t;
      const enter = () => { clearTimeout(t); if (window.matchMedia("(hover: hover)").matches) open(); };
      const leave = () => { t = setTimeout(close, 180); };
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      panel.addEventListener("mouseenter", () => clearTimeout(t));
      panel.addEventListener("mouseleave", leave);
    });
    document.addEventListener("click", (e) => { if (!e.target.closest("[data-mega], .mega")) closeMegas(); });

    // Menú móvil
    $$("[data-open-menu]").forEach((b) => b.addEventListener("click", () => { openDrawer($("#mobile-menu")); b.setAttribute("aria-expanded", "true"); }));
    $$(".mobile-menu__toggle").forEach((b) => b.addEventListener("click", () => {
      const sub = document.getElementById(b.getAttribute("aria-controls"));
      const open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(open));
      sub.classList.toggle("is-open", open);
    }));

    // Carrito
    $$("[data-open-cart]").forEach((b) => b.addEventListener("click", () => openDrawer($("#cart-drawer"))));
    document.addEventListener("click", (e) => { if (e.target.closest("[data-close-drawers], [data-backdrop]")) closeDrawers(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeDrawers(); closeMegas(); }
    });
    bindLines($("[data-cart-lines]"));

    // Búsqueda predictiva
    const search = $("#search");
    const input = $("#search-input");
    const results = $("#search-results");
    $$("[data-toggle-search]").forEach((b) => b.addEventListener("click", () => {
      const open = !search.classList.contains("is-open");
      search.classList.toggle("is-open", open);
      $$("[data-toggle-search]").forEach((x) => x.setAttribute("aria-expanded", String(open)));
      if (open) input.focus(); else { results.innerHTML = ""; }
    }));
    let active = -1;
    const renderResults = () => {
      const q = input.value.trim();
      active = -1;
      if (q.length < 2) { results.innerHTML = ""; return; }
      const found = C.search(q);
      if (!found.length) { results.innerHTML = '<li class="search__empty">No encontramos productos para "' + esc(q) + '".</li>'; return; }
      results.innerHTML = found.slice(0, 6).map((p) =>
        '<li role="option"><a class="search__result" href="' + url("producto.html?p=" + p.slug) + '"><span class="thumb">' + productImage(p) + '</span><span><span class="name">' + esc(p.name) + '</span><br><span class="price">' + priceHTML(p) + "</span></span></a></li>"
      ).join("") + (found.length > 6 ? '<li><a class="search__all" href="' + url("buscar.html?q=" + encodeURIComponent(q)) + '">Ver los ' + found.length + " resultados</a></li>" : "");
    };
    input.addEventListener("input", renderResults);
    input.addEventListener("keydown", (e) => {
      const opts = $$(".search__result, .search__all", results);
      if (!opts.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length;
        opts.forEach((o, i) => o.classList.toggle("is-active", i === active));
        opts[active].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        window.location.href = opts[active].href;
      }
    });
  }

  // ---------- Inicio común ----------
  function init() {
    renderTopbar();
    renderHeader();
    renderFooter();
    renderFloats();
    bindHeader();
    Cart.render();
    // Sincroniza el carrito entre pestañas
    window.addEventListener("storage", (e) => { if (e.key === CART_KEY) Cart.render(); });
  }

  window.NAC = { $, $$, esc, money, url, waLink, ICON, placeholder, productImage, priceHTML, productCard, productGrid, Cart, orderMessage, toast, openCart: () => openDrawer($("#cart-drawer")), closeDrawers };
  init();
})();
