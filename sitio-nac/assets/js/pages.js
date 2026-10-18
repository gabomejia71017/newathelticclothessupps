/* =========================================================================
   Lógica de cada página (según <body data-page="...">)
   ========================================================================= */
(function () {
  const S = window.SITE, C = window.Catalog, N = window.NAC;
  const { $, $$, esc, money, url, waLink } = N;
  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const main = $("#main");

  function setMeta(title, description) {
    document.title = title + " | " + S.name;
    if (description) {
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", description);
    }
  }

  // ---------------- INICIO ----------------
  function heroBanner(b) {
    if (b.image) {
      return '<a class="hero__banner" href="' + url(b.href) + '"><picture>' +
        (b.imageMobile ? '<source media="(max-width: 767px)" srcset="' + esc(url(b.imageMobile)) + '">' : "") +
        '<img src="' + esc(url(b.image)) + '" alt="' + esc(b.alt) + '" width="1920" height="800" fetchpriority="high"></picture></a>';
    }
    return '<div class="hero__banner">' +
      '<div class="hero-art hero-art--' + b.theme + '">' +
        '<div class="hero-art__rings" aria-hidden="true"></div>' +
        '<div class="hero-art__bgword" aria-hidden="true">NAC</div>' +
        '<div class="hero-art__content">' +
          '<div class="hero-art__kicker">' + esc(b.kicker) + "</div>" +
          '<h2 class="hero-art__title">' + esc(b.title) + "</h2>" +
          '<p class="hero-art__subtitle">' + esc(b.subtitle) + "</p>" +
          heroCtas(b) +
        "</div>" +
      "</div></div>";
  }

  // Botones del banner (config/site.js → hero[].cta)
  function heroCtas(b) {
    const ctas = b.cta && b.cta.length ? b.cta : [{ label: "Comprar ahora", href: b.href }];
    const dark = b.theme === "dark";
    return '<div class="hero-art__ctas">' + ctas.map((c, i) => {
      const cls = i === 0 ? (dark ? "btn btn--light" : "btn") : (dark ? "btn btn--ghost-light" : "btn btn--outline");
      return '<a class="' + cls + '" href="' + url(c.href) + '">' + esc(c.label) + "</a>";
    }).join("") + "</div>";
  }

  // Barra de beneficios (config/site.js → benefits)
  function benefits() {
    if (!S.benefits || !S.benefits.length) return "";
    return '<section class="benefits" aria-label="Por qué comprar con nosotros"><div class="container benefits__grid">' + S.benefits.map((b) => {
      const href = b.link === "whatsapp" ? waLink() : b.link === "instagram" ? S.social.instagram : (b.link ? url(b.link) : "");
      const tag = href ? 'a href="' + esc(href) + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "") : "div";
      return "<" + tag + ' class="benefit">' + '<span class="benefit__icon">' + (N.ICON[b.icon] || "") + "</span>" +
        '<span><strong class="benefit__title">' + esc(b.title) + '</strong><span class="benefit__text">' + esc(b.text) + "</span></span></" + tag.split(" ")[0] + ">";
    }).join("") + "</div></section>";
  }

  // Accesos rápidos por categoría
  function categoryNav() {
    return '<nav class="catnav" aria-label="Compra por categoría"><div class="container"><div class="catnav__row">' +
      S.categories.map((c) => '<a class="catnav__item" href="' + url("categoria.html?c=" + c.slug) + '">' + esc(c.name) + "</a>").join("") +
      "</div></div></nav>";
  }

  function strip(s, i) {
    const href = s.type === "whatsapp" ? waLink() : S.social.instagram;
    const theme = s.image ? "strip--image" : (i % 2 === 0 ? "strip--dark" : "strip--light");
    const btn = (s.image || i % 2 === 0) ? "btn btn--light" : "btn";
    return '<section class="strip ' + theme + '">' +
      (s.image ? '<img src="' + esc(url(s.image)) + '" alt="" loading="lazy">' : "") +
      '<div class="container strip__inner"><p class="strip__text">' + esc(s.text) + '</p><a class="' + btn + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(s.button) + "</a></div></section>";
  }

  function bannerRow(row) {
    return '<section class="banner-row"><div class="container banner-row__grid">' + row.map((t) =>
      '<a class="tile' + (t.image ? " tile--image" : "") + '" href="' + url(t.href) + '">' +
        (t.image ? '<img src="' + esc(url(t.image)) + '" alt="' + esc(t.title) + '" loading="lazy" width="800" height="1000">' : '<div class="tile__art" aria-hidden="true"></div>') +
        '<div class="tile__content"><h3 class="tile__title">' + esc(t.title) + '</h3><p class="tile__text">' + esc(t.text) + '</p><span class="tile__link">Ver más</span></div>' +
      "</a>").join("") + "</div></section>";
  }

  function section(title, list, cols, moreHref, kicker) {
    return '<section class="section"><div class="container">' +
      '<div class="section__head"><div>' + (kicker ? '<p class="section__kicker">' + esc(kicker) + "</p>" : "") + '<h2 class="section__title">' + esc(title) + "</h2></div>" +
      (moreHref ? '<a class="section__link" href="' + url(moreHref) + '">Ver todos <span aria-hidden="true">→</span></a>' : "") + "</div>" +
      N.productGrid(list, cols) + "</div></section>";
  }

  // ================= CARRUSEL PRINCIPAL =================
  function heroSlide(b, i) {
    const dark = b.theme !== "light";
    const link = (h) => (h === "whatsapp" ? waLink() : url(h));
    const ext = (h) => (h === "whatsapp" ? ' target="_blank" rel="noopener"' : "");
    const ctas = (b.cta || []).slice(0, 2).map((c, k) =>
      '<a class="btn ' + (k === 0 ? (dark ? "btn--light" : "") : (dark ? "btn--ghost-light" : "btn--outline")) + '" href="' + link(c.href) + '"' + ext(c.href) + ">" + esc(c.label) + "</a>").join("");
    const prods = (b.products || []).map((sl) => C.getProductBySlug(sl)).filter(Boolean).slice(0, 3);
    const visual = b.image
      ? '<picture class="slide__photo">' + (b.imageMobile ? '<source media="(max-width: 767px)" srcset="' + esc(url(b.imageMobile)) + '">' : "") +
        '<img src="' + esc(url(b.image)) + '" alt="" ' + (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + "></picture>"
      : "";
    const stack = prods.length
      ? '<div class="slide__products" aria-hidden="true">' + prods.map((pr, k) =>
          '<a class="slide__product slide__product--' + (k + 1) + '" href="' + url("producto.html?p=" + pr.slug) + '" tabindex="-1">' + N.productImage(pr).replace('loading="lazy"', 'loading="eager"') + "</a>").join("") + "</div>"
      : "";
    return '<div class="slide slide--' + (dark ? "dark" : "light") + (b.image ? " slide--photo" : "") + '" role="group" aria-roledescription="diapositiva" aria-label="' + (i + 1) + " de " + S.hero.length + '">' +
      visual + '<div class="slide__deco" aria-hidden="true"></div>' +
      (b.href ? '<a class="slide__link" href="' + link(b.href) + '"' + ext(b.href) + ' aria-label="' + esc(b.title + " " + b.subtitle) + '"></a>' : "") +
      '<div class="container slide__inner">' +
        '<div class="slide__copy">' +
          '<p class="slide__kicker">' + esc(b.kicker) + "</p>" +
          (i === 0 ? "<h2" : "<h2") + ' class="slide__title">' + esc(b.title) + ' <span class="slide__outline">' + esc(b.subtitle) + "</span></h2>" +
          (b.text ? '<p class="slide__text">' + esc(b.text) + "</p>" : "") +
          (ctas ? '<div class="slide__ctas">' + ctas + "</div>" : "") +
        "</div>" + stack +
      "</div></div>";
  }

  function heroCarousel() {
    const n = S.hero.length;
    return '<section class="carousel" aria-roledescription="carrusel" aria-label="Destacados">' +
      '<div class="carousel__track">' + S.hero.map(heroSlide).join("") + "</div>" +
      (n > 1 ? '<button class="carousel__arrow carousel__arrow--prev" type="button" aria-label="Anterior">' + N.ICON.prev + "</button>" +
        '<button class="carousel__arrow carousel__arrow--next" type="button" aria-label="Siguiente">' + N.ICON.next + "</button>" +
        '<div class="carousel__dots">' + S.hero.map((_, i) => '<button type="button" aria-label="Ir a la diapositiva ' + (i + 1) + '"></button>').join("") + "</div>" : "") +
      "</section>";
  }

  function initHeroCarousel() {
    const root = $(".carousel");
    if (!root) return;
    const track = $(".carousel__track", root), slides = $$(".slide", root), dots = $$(".carousel__dots button", root);
    if (slides.length < 2) { slides[0] && slides[0].classList.add("is-active"); return; }
    let i = 0, timer;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const go = (k) => {
      i = (k + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-100 * i) + "%)";
      slides.forEach((s, j) => { s.classList.toggle("is-active", j === i); s.setAttribute("aria-hidden", String(j !== i)); });
      dots.forEach((d, j) => d.setAttribute("aria-current", String(j === i)));
    };
    const play = () => { if (reduce) return; clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); };
    const stop = () => clearInterval(timer);
    $(".carousel__arrow--prev", root).addEventListener("click", () => { go(i - 1); play(); });
    $(".carousel__arrow--next", root).addEventListener("click", () => { go(i + 1); play(); });
    dots.forEach((d, j) => d.addEventListener("click", () => { go(j); play(); }));
    root.addEventListener("mouseenter", stop); root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop); root.addEventListener("focusout", play);
    // deslizar con el dedo
    let x0 = null;
    root.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      x0 = null; play();
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
    go(0); play();
  }

  // ================= CARRUSEL DE PRODUCTOS =================
  function productRail(title, list, kicker, moreHref) {
    if (!list.length) return "";
    return '<section class="section"><div class="container">' +
      '<div class="section__head"><div>' + (kicker ? '<p class="section__kicker">' + esc(kicker) + "</p>" : "") + '<h2 class="section__title">' + esc(title) + "</h2></div>" +
      '<div class="rail__controls">' + (moreHref ? '<a class="section__link" href="' + url(moreHref) + '">Ver todos <span aria-hidden="true">→</span></a>' : "") +
      '<button class="rail__btn" type="button" data-rail="-1" aria-label="Anterior">' + N.ICON.prev + '</button><button class="rail__btn" type="button" data-rail="1" aria-label="Siguiente">' + N.ICON.next + "</button></div></div>" +
      '<div class="rail">' + list.map(N.productCard).join("") + "</div></div></section>";
  }
  function initRails() {
    $$(".rail__controls").forEach((ctrl) => {
      const rail = ctrl.closest(".container").querySelector(".rail");
      $$("[data-rail]", ctrl).forEach((b) => b.addEventListener("click", () => {
        rail.scrollBy({ left: Number(b.dataset.rail) * rail.clientWidth * 0.9, behavior: "smooth" });
      }));
    });
  }

  // ================= SECCIONES EXTRA =================
  function goals() {
    if (!S.goals) return "";
    return '<section class="section goals"><div class="container">' +
      '<div class="section__head section__head--center"><div><p class="section__kicker">¿Qué buscas?</p><h2 class="section__title">Compra por objetivo</h2></div></div>' +
      '<div class="goals__grid">' + S.goals.map((g) =>
        '<a class="goal" href="' + url(g.href) + '"><span class="goal__icon">' + (N.ICON[g.icon] || "") + '</span><span class="goal__title">' + esc(g.title) +
        '</span><span class="goal__text">' + esc(g.text) + '</span><span class="goal__go" aria-hidden="true">→</span></a>').join("") +
      "</div></div></section>";
  }

  function brandWall() {
    const brands = S.brands.filter((b) => b.slug !== "otras" && C.getByBrand(b.slug).length);
    if (!brands.length) return "";
    const items = brands.map((b) => '<a class="brandwall__item" href="' + url("marca.html?m=" + b.slug) + '">' + esc(b.name) + "</a>").join("");
    return '<section class="brandwall" aria-label="Nuestras marcas"><p class="brandwall__label">Marcas originales que manejamos</p>' +
      '<div class="brandwall__mask"><div class="brandwall__track">' + items + '<span aria-hidden="true" class="brandwall__dup">' + items + "</span></div></div></section>";
  }

  function steps() {
    if (!S.steps) return "";
    return '<section class="steps"><div class="container">' +
      '<div class="section__head section__head--center section__head--dark"><div><p class="section__kicker">Sin complicaciones</p><h2 class="section__title">Así de fácil compras</h2></div></div>' +
      '<ol class="steps__grid">' + S.steps.map((st, k) =>
        '<li class="step"><span class="step__n">0' + (k + 1) + '</span><h3 class="step__title">' + esc(st.title) + '</h3><p class="step__text">' + esc(st.text) + "</p></li>").join("") +
      '</ol><div class="steps__cta"><a class="btn btn--light" href="' + waLink() + '" target="_blank" rel="noopener">Escríbenos por WhatsApp</a></div></div></section>';
  }

  function renderHome() {
    const lim = (arr, n) => (n ? arr.slice(0, n) : arr);
    const best = lim(C.sortProducts(C.getBestSellers()), S.home.bestSellersLimit);
    const offers = lim(C.sortProducts(C.getOffers()), S.home.offersLimit);
    const news = lim(C.sortProducts(C.getNew()), S.home.newLimit);
    main.innerHTML =
      '<h1 class="sr-only">' + esc(S.name) + " — Suplementos deportivos en Colombia</h1>" +
      heroCarousel() +
      benefits() +
      categoryNav() +
      productRail("Suplementos más vendidos", best, "Los favoritos") +
      goals() +
      productRail("Suplementos en oferta", offers, "Precio especial", "ofertas.html") +
      brandWall() +
      (S.bannerRows[0] ? bannerRow(S.bannerRows[0]) : "") +
      section("Nuevos suplementos", news, 5, "", "Recién llegados") +
      steps();
    initHeroCarousel();
    initRails();
  }

  // ---------------- LISTADOS ----------------
  function renderListing({ title, subtitle, list, crumbs, chips }) {
    setMeta(title, subtitle || ("Compra " + title.toLowerCase() + " en " + S.name + ". Envíos a todo Colombia."));
    const crumbHTML = '<nav class="breadcrumb" aria-label="Ruta"><a href="' + url("index.html") + '">Inicio</a>' + (crumbs || []).map((c) => " / " + (c.href ? '<a href="' + url(c.href) + '">' + esc(c.label) + "</a>" : esc(c.label))).join("") + "</nav>";
    main.innerHTML =
      heroCarousel() +
      '<div class="page-head page-head--compact"><div class="container">' + crumbHTML + "<h1>" + esc(title) + "</h1>" + (subtitle ? "<p>" + esc(subtitle) + "</p>" : "") + "</div></div>" +
      '<div class="container listing"><div class="toolbar"><span class="toolbar__count" data-list-count></span>' +
        '<label><span class="sr-only">Ordenar</span><select class="select" data-sort><option value="">Ordenar: destacados</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option><option value="name">Nombre A–Z</option></select></label>' +
      '</div><div data-grid></div></div>';
    const draw = () => {
      const sorted = C.sortProducts(list, $("[data-sort]").value);
      $("[data-grid]").innerHTML = N.productGrid(sorted, 4);
      $("[data-list-count]").textContent = list.length + (list.length === 1 ? " producto" : " productos");
    };
    $("[data-sort]").addEventListener("change", draw);
    draw();
    initHeroCarousel();
  }

  function notFound(msg) {
    setMeta("No encontrado");
    main.innerHTML = '<div class="container empty"><h1 class="section__title">No encontrado</h1><p>' + esc(msg) + '</p><a class="btn" href="' + url("index.html") + '">Volver al inicio</a></div>';
  }

  function renderCategory() {
    const slug = params.get("c");
    const cat = C.getCategory(slug);
    if (!cat) return notFound("Esta categoría no existe.");
    renderListing({ title: cat.name, list: C.getByCategory(slug), crumbs: [{ label: "Categorías" }, { label: cat.name }] });
  }

  function renderBrand() {
    const slug = params.get("m");
    const b = C.getBrand(slug);
    if (!b) return notFound("Esta marca no existe.");
    renderListing({ title: b.name, subtitle: "Productos de la marca " + b.name, list: C.getByBrand(slug), crumbs: [{ label: "Marcas" }, { label: b.name }] });
  }

  function renderSearch() {
    const q = params.get("q") || "";
    renderListing({ title: q ? 'Resultados para "' + q + '"' : "Buscar", list: C.search(q), crumbs: [{ label: "Búsqueda" }] });
  }

  // ---------------- DETALLE DE PRODUCTO ----------------
  function renderProduct() {
    const p = C.getProductBySlug(params.get("p"));
    if (!p) return notFound("Este producto no existe o ya no está disponible.");
    const cat = C.getCategory(p.category);
    const brand = C.getBrand(p.brand);
    setMeta(p.name, (p.description || "").slice(0, 155));

    const hasV = C.hasVariants(p);
    let variant = hasV ? (p.variants.find((v) => v.stock > 0) || p.variants[0]).name : "";
    let current = 0;

    const thumbs = (p.images || []).length > 1
      ? '<div class="gallery__thumbs">' + p.images.map((src, i) => '<button class="gallery__thumb" type="button" data-thumb="' + i + '" aria-label="Ver imagen ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : "") + '><img src="' + esc(url(src)) + '" alt="" loading="lazy"></button>').join("") + "</div>"
      : "";

    const variantsHTML = hasV
      ? '<span class="pdp__label" id="vlabel">' + esc(p.variantLabel || "Opción") + ': <span data-vname></span></span><div class="variants" role="group" aria-labelledby="vlabel">' +
        p.variants.map((v) => '<button class="variant" type="button" data-variant="' + esc(v.name) + '"' + (v.stock > 0 ? "" : ' disabled title="Agotado"') + ">" + esc(v.name) + "</button>").join("") + "</div>"
      : "";

    main.innerHTML =
      '<div class="container pdp">' +
        '<nav class="breadcrumb breadcrumb--light" aria-label="Ruta"><a href="' + url("index.html") + '">Inicio</a> / ' + (cat ? '<a href="' + url("categoria.html?c=" + cat.slug) + '">' + esc(cat.name) + "</a> / " : "") + esc(p.name) + "</nav>" +
        '<div class="pdp__grid">' +
          '<div class="gallery"><div class="gallery__main" data-main>' + (C.isOnSale(p) ? '<span class="badge">¡Oferta!</span>' : "") + N.productImage(p, 0) + "</div>" + thumbs + "</div>" +
          "<div>" +
            (brand ? '<div class="pdp__brand"><a href="' + url("marca.html?m=" + brand.slug) + '">' + esc(brand.name) + "</a></div>" : "") +
            '<h1 class="pdp__title">' + esc(p.name) + "</h1>" +
            '<p class="pdp__price" data-price></p>' +
            '<div class="pdp__stock" data-stock></div>' +
            variantsHTML +
            '<span class="pdp__label">Cantidad</span>' +
            '<div class="pdp__buy"><div class="qty"><button type="button" aria-label="Restar uno" data-q="-1">−</button><input type="number" min="1" max="99" value="1" aria-label="Cantidad" data-qinput><button type="button" aria-label="Sumar uno" data-q="1">+</button></div>' +
            '<button class="btn" type="button" data-add>Agregar al carrito</button></div>' +
            '<a class="btn btn--outline btn--block" data-wa target="_blank" rel="noopener">Pedir por WhatsApp</a>' +
            '<div class="pdp__desc"><h2>Descripción</h2><p>' + esc(p.description) + "</p></div>" +
            '<div class="pdp__meta">' + (cat ? 'Categoría: <a href="' + url("categoria.html?c=" + cat.slug) + '">' + esc(cat.name) + "</a>" : "") + "</div>" +
            '<p class="notice">Los suplementos no reemplazan una alimentación balanceada. Consulta con un profesional de la salud antes de consumirlos.</p>' +
          "</div>" +
        "</div>" +
      "</div>" +
      (C.getRelated(p).length ? '<section class="section"><div class="container"><h2 class="section__title">También te puede interesar</h2>' + N.productGrid(C.getRelated(p), 4) + "</div></section>" : "");

    const qInput = $("[data-qinput]");
    const update = () => {
      const unitObj = hasV ? p.variants.find((v) => v.name === variant) : p;
      const ok = C.inStock(p, variant || undefined);
      const reg = unitObj.price, eff = C.unitPrice(p, variant);
      $("[data-price]").innerHTML = eff < reg ? '<span class="price-old">' + money(reg) + '</span><span class="price-new">' + money(eff) + "</span>" : '<span class="price-new">' + money(eff) + "</span>";
      const st = $("[data-stock]");
      st.textContent = ok ? "Disponible" : "Agotado";
      st.classList.toggle("is-out", !ok);
      $("[data-add]").disabled = !ok;
      $("[data-add]").textContent = ok ? "Agregar al carrito" : "Agotado";
      $$("[data-variant]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.variant === variant)));
      const vn = $("[data-vname]"); if (vn) vn.textContent = variant;
      const qty = Math.max(1, Number(qInput.value) || 1);
      const text = S.whatsappGreeting + ". Me interesa: " + p.name + (variant ? " (" + (p.variantLabel || "Opción") + ": " + variant + ")" : "") + " x" + qty + " — " + money(eff * qty) + ". ¿Está disponible?";
      $("[data-wa]").href = waLink(text);
    };
    $$("[data-variant]").forEach((b) => b.addEventListener("click", () => { variant = b.dataset.variant; update(); }));
    $$("[data-q]").forEach((b) => b.addEventListener("click", () => { qInput.value = Math.max(1, Math.min(99, (Number(qInput.value) || 1) + Number(b.dataset.q))); update(); }));
    qInput.addEventListener("change", () => { qInput.value = Math.max(1, Math.min(99, Number(qInput.value) || 1)); update(); });
    $("[data-add]").addEventListener("click", () => {
      N.Cart.add(p.id, variant, Math.max(1, Number(qInput.value) || 1));
      N.toast("Producto agregado al carrito");
      N.openCart();
    });
    $$("[data-thumb]").forEach((b) => b.addEventListener("click", () => {
      current = Number(b.dataset.thumb);
      const img = $("[data-main] img"); if (img) img.src = url(p.images[current]);
      $$("[data-thumb]").forEach((x) => x.setAttribute("aria-current", String(x === b)));
    }));
    update();

    // Datos estructurados (SEO)
    const info = C.priceInfo(p);
    const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
      offers: { "@type": "AggregateOffer", priceCurrency: "COP", lowPrice: info.min, highPrice: info.max, availability: C.inStock(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
    const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
  }

  // ---------------- CARRITO ----------------
  function renderCartPage() {
    main.innerHTML =
      '<div class="page-head"><div class="container"><nav class="breadcrumb" aria-label="Ruta"><a href="' + url("index.html") + '">Inicio</a> / Carrito</nav><h1>Tu carrito</h1></div></div>' +
      '<div class="container cart-page"><div class="cart-page__grid">' +
        '<div class="panel"><h2>Productos</h2><div data-page-lines></div></div>' +
        '<div class="panel" id="pedido"><h2>Resumen del pedido</h2>' +
          '<div class="summary-row"><span>Subtotal</span><strong data-sub></strong></div>' +
          '<div class="summary-row"><span>Envío</span><span>Por confirmar</span></div>' +
          '<div class="summary-row summary-row--total"><span>Total productos</span><span data-total></span></div>' +
          '<form data-checkout novalidate style="margin-top:18px">' +
            '<div class="field"><label for="c-name">Nombre</label><input id="c-name" name="name" autocomplete="name" required maxlength="80"><span class="field__error">Escribe tu nombre.</span></div>' +
            '<div class="field"><label for="c-city">Ciudad</label><input id="c-city" name="city" autocomplete="address-level2" required maxlength="60"><span class="field__error">Escribe tu ciudad.</span></div>' +
            '<div class="field"><label for="c-notes">Notas (opcional)</label><textarea id="c-notes" name="notes" rows="3" maxlength="300" placeholder="Ej: horario de entrega, sabor alternativo…"></textarea></div>' +
            '<button class="btn btn--block" type="submit" data-checkout-btn>Finalizar pedido por WhatsApp</button>' +
            '<p class="fine">Al enviar, se abrirá WhatsApp con el detalle de tu pedido. Allí coordinamos el pago y el envío. Los datos que escribas solo se incluyen en tu mensaje; consulta nuestra <a href="' + url("legal/datos.html") + '">política de datos</a>.</p>' +
          "</form>" +
        "</div>" +
      "</div></div>";

    const linesEl = $("[data-page-lines]");
    const draw = () => {
      const lines = N.Cart.lines();
      linesEl.innerHTML = lines.length ? lines.map(lineFor).join("") :'<div class="cart-empty"><p>Tu carrito está vacío.</p><a class="btn" href="' + url("index.html") + '">Ver productos</a></div>';
      $("[data-sub]").textContent = money(N.Cart.subtotal());
      $("[data-total]").textContent = money(N.Cart.subtotal());
      $("[data-checkout-btn]").disabled = !lines.length;
    };
    // Reutiliza el mismo marcado de línea del drawer
    function lineFor(l) {
      const p = l.product;
      return '<div class="cart-line" data-key="' + esc(l.key) + '">' +
        '<a class="cart-line__img" href="' + url("producto.html?p=" + p.slug) + '">' + N.productImage(p) + "</a>" +
        '<div><a class="cart-line__name" href="' + url("producto.html?p=" + p.slug) + '">' + esc(p.name) + '</a><div class="cart-line__variant">' + (l.variant ? esc(p.variantLabel || "Opción") + ": " + esc(l.variant) + " · " : "") + money(l.unit) + " c/u</div>" +
        '<div class="qty qty--sm"><button type="button" aria-label="Restar uno" data-qty="-1">−</button><input type="number" min="1" max="99" value="' + l.qty + '" aria-label="Cantidad" data-qty-input><button type="button" aria-label="Sumar uno" data-qty="1">+</button></div></div>' +
        '<div><div class="cart-line__price">' + money(l.total) + '</div><button class="cart-line__remove" type="button" data-remove>Quitar</button></div></div>';
    }
    linesEl.addEventListener("click", (e) => {
      const line = e.target.closest(".cart-line"); if (!line) return;
      const key = line.dataset.key;
      if (e.target.closest("[data-remove]")) return N.Cart.remove(key);
      const b = e.target.closest("[data-qty]");
      if (b) { const it = N.Cart.read().find((i) => i.key === key); if (it) N.Cart.setQty(key, it.qty + Number(b.dataset.qty)); }
    });
    linesEl.addEventListener("change", (e) => {
      if (!e.target.matches("[data-qty-input]")) return;
      N.Cart.setQty(e.target.closest(".cart-line").dataset.key, Number(e.target.value) || 1);
    });
    N.Cart.listeners.push(draw);
    draw();

    $("[data-checkout]").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      let ok = true;
      ["name", "city"].forEach((n) => {
        const input = f.elements[n];
        const bad = !input.value.trim();
        input.closest(".field").classList.toggle("has-error", bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      if (!ok || !N.Cart.lines().length) return;
      const msg = N.orderMessage({ name: f.elements.name.value.trim(), city: f.elements.city.value.trim(), notes: f.elements.notes.value.trim() });
      window.open(waLink(msg), "_blank", "noopener");
    });
    if (location.hash === "#pedido") setTimeout(() => $("#pedido").scrollIntoView(), 50);
  }

  const routes = {
    home: renderHome,
    categoria: renderCategory,
    marca: renderBrand,
    ofertas: () => renderListing({ title: "Ofertas", subtitle: "Suplementos con precio especial por tiempo limitado.", list: C.getOffers(), crumbs: [{ label: "Ofertas" }] }),
    combos: () => renderListing({ title: "Combos", subtitle: "Arma tu stack y ahorra con nuestros combos.", list: C.getCombos(), crumbs: [{ label: "Combos" }] }),
    buscar: renderSearch,
    producto: renderProduct,
    carrito: renderCartPage,
  };
  if (routes[page] && main) routes[page]();
})();
