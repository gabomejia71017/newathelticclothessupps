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
    return '<section class="banner-row"><div class="container banner-row__grid">' + row.map((t, i) => {
      const n = t.category ? C.getByCategory(t.category).length : 0;
      const fl = (t.floating || []).slice(0, 2);
      const visual = t.image
        ? '<img class="tile__photo" src="' + esc(url(t.image)) + '" alt="' + esc(t.title) + '" loading="lazy" width="800" height="1000">'
        : '<div class="tile__art" aria-hidden="true"><span class="tile__ring"></span><span class="tile__ring tile__ring--sm"></span></div>' +
          (fl.length ? '<div class="tile__jars" aria-hidden="true">' + fl.map((src, k) =>
            '<img class="tile__jar tile__jar--' + (k + 1) + '" src="' + esc(url(src)) + '" alt="" loading="lazy">').join("") + "</div>" : "");
      return '<a class="tile tile--v2' + (t.image ? " tile--image" : "") + '" href="' + url(t.href) + '">' + visual +
        '<div class="tile__content">' +
          '<span class="tile__num">0' + (i + 1) + (n ? " · " + n + " productos" : "") + "</span>" +
          '<h3 class="tile__title">' + esc(t.title) + '</h3><p class="tile__text">' + esc(t.text) + "</p>" +
          '<span class="tile__link">Ver más <span aria-hidden="true">→</span></span>' +
        "</div></a>";
    }).join("") + "</div></section>";
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
    const floats = (b.floating || []).slice(0, 3);
    const stack = (b.layout === "podium" && floats.length) ? podiumStage(b, floats, prods)
      : (b.layout === "deal" && floats.length) ? dealStage(b, floats, prods)
      : floats.length
      ? '<div class="stage stage--' + floats.length + '" aria-hidden="true">' +
        floats.map((src, k) => '<img class="stage__item stage__item--' + (k + 1) + '" src="' + esc(url(src)) + '" alt="" ' + (i === 0 ? "" : 'loading="eager"') + ' width="300" height="450">').join("") + "</div>"
      : prods.length
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

  // ---- Diseño "podio" (diapositiva de creatinas) ----
  function podiumStage(b, floats, prods) {
    const order = [1, 0, 2]; // izquierda = 2.º, centro = 1.º, derecha = 3.º
    const steps = order.filter((k) => floats[k]).map((k) => {
      const pr = prods[k];
      return '<div class="podium__col podium__col--' + (k + 1) + '">' +
        '<img class="podium__img" src="' + esc(url(floats[k])) + '" alt="" loading="eager">' +
        '<div class="podium__step"><span class="podium__n">' + (k + 1) + '</span>' + (pr ? '<span class="podium__name">' + esc(pr.name) + "</span>" : "") + "</div></div>";
    }).join("");
    return '<div class="podium" aria-hidden="true">' + (b.bgWord ? '<span class="podium__word">' + esc(b.bgWord) + "</span>" : "") + '<div class="podium__row">' + steps + "</div></div>";
  }

  // ---- Diseño "oferta" (diapositiva de ofertas) ----
  function dealStage(b, floats, prods) {
    const tag = (pr) => {
      if (!pr) return { pct: "", old: "", now: "" };
      const info = C.priceInfo(pr);
      const pct = info.regular > info.min ? Math.round((1 - info.min / info.regular) * 100) : 0;
      return { pct: pct ? "−" + pct + "%" : "", old: info.regular > info.min ? money(info.regular) : "", now: money(info.min) };
    };
    const main = tag(prods[0]);
    const side = floats.slice(1).map((src, k) => {
      const t = tag(prods[k + 1]);
      return '<div class="deal__side deal__side--' + (k + 1) + '"><img src="' + esc(url(src)) + '" alt="" loading="eager">' + (t.pct ? '<span class="deal__mini">' + t.pct + "</span>" : "") + "</div>";
    }).join("");
    return '<div class="deal" aria-hidden="true">' + side +
      '<div class="deal__main"><img src="' + esc(url(floats[0])) + '" alt="" loading="eager">' +
        (main.pct ? '<div class="deal__badge"><svg class="deal__ring" viewBox="0 0 120 120"><defs><path id="dealc" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs><text><textPath href="#dealc">OFERTA • OFERTA • OFERTA • OFERTA • </textPath></text></svg><span class="deal__pct">' + main.pct + "</span></div>" : "") +
        '<div class="deal__price">' + (main.old ? '<s>' + main.old + "</s>" : "") + "<strong>" + main.now + "</strong>" + (prods[0] ? '<span>' + esc(prods[0].name) + "</span>" : "") + "</div>" +
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
      (N.Recent.products().length >= 2 ? productRail("Vistos recientemente", N.Recent.products().slice(0, 12), "Sigue donde quedaste") : "") +
      goals() +
      productRail("Suplementos en oferta", offers, "Precio especial", "ofertas.html") +
      brandWall() +
      (S.bannerRows[0] ? bannerRow(S.bannerRows[0]) : "") +
      productRail("Nuevos suplementos", news.slice(0, 12), "Recién llegados", "novedades.html") +
      steps();
    initHeroCarousel();
    initRails();
  }

  // ---------------- LISTADOS ----------------
  function renderListing({ title, subtitle, list, crumbs }) {
    setMeta(title, subtitle || ("Compra " + title.toLowerCase() + " en " + S.name + ". Envíos a todo Colombia."));
    const crumbHTML = '<nav class="breadcrumb" aria-label="Ruta"><a href="' + url("index.html") + '">Inicio</a>' + (crumbs || []).map((c) => " / " + (c.href ? '<a href="' + url(c.href) + '">' + esc(c.label) + "</a>" : esc(c.label))).join("") + "</nav>";
    const PAGE = 24;
    const st = { brands: new Set(), cats: new Set(), price: "", sale: false, sort: "", shown: PAGE };
    const count = (arr, key) => { const m = new Map(); arr.forEach((p) => m.set(p[key], (m.get(p[key]) || 0) + 1)); return [...m.entries()].sort((x, y) => y[1] - x[1]); };
    const brandOpts = count(list, "brand").filter(([k]) => C.getBrand(k));
    const catOpts = count(list, "category").filter(([k]) => C.getCategory(k));
    const PRICES = [["0-100000", "Menos de $100.000"], ["100000-200000", "$100.000 a $200.000"], ["200000-300000", "$200.000 a $300.000"], ["300000-99999999", "Más de $300.000"]];
    const priceOpts = PRICES.filter(([r]) => { const [lo, hi] = r.split("-").map(Number); return list.some((p) => { const v = C.priceInfo(p).min; return v >= lo && v < hi; }); });
    const hasSale = list.some(C.isOnSale) && !list.every(C.isOnSale);
    const group = (name, label, opts, type) => opts.length < 2 ? "" :
      '<fieldset class="filters__group"><legend>' + label + "</legend>" + opts.map(([v, txt, n]) =>
        '<label class="check"><input type="' + type + '" name="' + name + '" value="' + esc(v) + '"><span>' + esc(txt) + "</span>" + (n ? '<em>' + n + "</em>" : "") + "</label>").join("") + "</fieldset>";
    const filtersHTML =
      '<aside class="filters" id="filters" aria-label="Filtros"><div class="filters__head"><h2>Filtrar</h2><button class="icon-btn" type="button" data-filters-close aria-label="Cerrar filtros">' + N.ICON.close + "</button></div>" +
      '<form class="filters__body" data-filters>' +
        (hasSale ? '<fieldset class="filters__group"><legend>Precio especial</legend><label class="check"><input type="checkbox" name="sale" value="1"><span>Solo productos en oferta</span></label></fieldset>' : "") +
        group("cat", "Categoría", catOpts.map(([k, n]) => [k, C.getCategory(k).name, n]), "checkbox") +
        group("brand", "Marca", brandOpts.map(([k, n]) => [k, C.getBrand(k).name, n]), "checkbox") +
        group("price", "Precio", [["", "Todos los precios"]].concat(priceOpts), "radio") +
      "</form>" +
      '<div class="filters__foot"><button class="btn btn--outline" type="button" data-filters-clear>Limpiar</button><button class="btn" type="button" data-filters-close data-filters-apply>Ver productos</button></div></aside>';

    main.innerHTML =
      heroCarousel() +
      '<div class="page-head page-head--compact"><div class="container">' + crumbHTML + "<h1>" + esc(title) + "</h1>" + (subtitle ? "<p>" + esc(subtitle) + "</p>" : "") + "</div></div>" +
      '<div class="container listing listing--filters">' + filtersHTML +
        '<div class="listing__main"><div class="toolbar">' +
          '<button class="btn btn--outline btn--sm toolbar__filter" type="button" data-filters-open aria-controls="filters">' + N.ICON.filter + 'Filtrar<span class="toolbar__badge" data-fcount></span></button>' +
          '<span class="toolbar__count" data-list-count aria-live="polite"></span>' +
          '<label class="toolbar__sort"><span class="sr-only">Ordenar</span><select class="select" data-sort><option value="">Destacados</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option><option value="discount">Mayor descuento</option><option value="name">Nombre A–Z</option></select></label>' +
        '</div><div class="active-filters" data-active></div><div data-grid></div><div class="loadmore" data-more></div></div>' +
      "</div>" + '<div class="filters-backdrop" data-filters-close></div>';

    const form = $("[data-filters]");
    const filtered = () => list.filter((p) => {
      if (st.sale && !C.isOnSale(p)) return false;
      if (st.brands.size && !st.brands.has(p.brand)) return false;
      if (st.cats.size && !st.cats.has(p.category)) return false;
      if (st.price) { const [lo, hi] = st.price.split("-").map(Number); const v = C.priceInfo(p).min; if (v < lo || v >= hi) return false; }
      return true;
    });
    const sortList = (l) => {
      if (st.sort === "discount") {
        const d = (p) => { const i = C.priceInfo(p); return i.regular > i.min ? 1 - i.min / i.regular : 0; };
        return l.slice().sort((x, y) => d(y) - d(x));
      }
      return C.sortProducts(l, st.sort);
    };
    const draw = (keepShown) => {
      if (!keepShown) st.shown = PAGE;
      const res = sortList(filtered());
      $("[data-grid]").innerHTML = res.length ? N.productGrid(res.slice(0, st.shown), 4)
        : '<div class="empty"><p>Ningún producto coincide con estos filtros.</p><button class="btn" type="button" data-filters-clear>Quitar filtros</button></div>';
      $("[data-list-count]").textContent = res.length + (res.length === 1 ? " producto" : " productos");
      const left = res.length - st.shown;
      $("[data-more]").innerHTML = left > 0 ? '<p class="loadmore__info">Viendo ' + st.shown + " de " + res.length + '</p><div class="loadmore__bar"><span style="width:' + Math.round(100 * st.shown / res.length) + '%"></span></div><button class="btn btn--outline" type="button" data-loadmore>Ver más productos</button>' : "";
      const chips = [];
      if (st.sale) chips.push(["sale", "1", "En oferta"]);
      st.cats.forEach((k) => chips.push(["cat", k, C.getCategory(k).name]));
      st.brands.forEach((k) => chips.push(["brand", k, C.getBrand(k).name]));
      if (st.price) chips.push(["price", st.price, PRICES.find((x) => x[0] === st.price)[1]]);
      $("[data-active]").innerHTML = chips.length ? chips.map(([n, v, l]) => '<button class="chip chip--on" type="button" data-unset="' + n + '" data-value="' + esc(v) + '">' + esc(l) + ' <span aria-hidden="true">×</span><span class="sr-only">Quitar filtro</span></button>').join("") + '<button class="chip chip--clear" type="button" data-filters-clear>Limpiar todo</button>' : "";
      const fc = $("[data-fcount]"); fc.textContent = chips.length || ""; fc.hidden = !chips.length;
      const ap = $("[data-filters-apply]"); if (ap) ap.textContent = "Ver " + res.length + (res.length === 1 ? " producto" : " productos");
    };
    const readForm = () => {
      const fd = new FormData(form);
      st.sale = fd.has("sale"); st.brands = new Set(fd.getAll("brand")); st.cats = new Set(fd.getAll("cat")); st.price = fd.get("price") || "";
      draw();
    };
    form.addEventListener("change", readForm);
    const clear = () => { form.reset(); readForm(); };
    const openF = (on) => { $("#filters").classList.toggle("is-open", on); document.body.classList.toggle("filters-open", on); if (on) $("#filters button").focus(); };
    main.addEventListener("click", (e) => {
      if (e.target.closest("[data-filters-clear]")) clear();
      else if (e.target.closest("[data-filters-open]")) openF(true);
      else if (e.target.closest("[data-filters-close]")) openF(false);
      else if (e.target.closest("[data-loadmore]")) { st.shown += PAGE; draw(true); }
      else {
        const u = e.target.closest("[data-unset]"); if (!u) return;
        const inp = form.querySelector('[name="' + u.dataset.unset + '"][value="' + CSS.escape(u.dataset.value) + '"]');
        if (inp) { if (inp.type === "radio") form.querySelector('[name="price"][value=""]').checked = true; else inp.checked = false; }
        readForm();
      }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") openF(false); });
    const pr = form.querySelector('[name="price"][value=""]'); if (pr) pr.checked = true;
    $("[data-sort]").addEventListener("change", (e) => { st.sort = e.target.value; draw(); });
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
  const COMPLEMENTS = {
    proteinas: ["creatinas", "pre-entrenos", "termos-shakers"], creatinas: ["proteinas", "pre-entrenos"], "pre-entrenos": ["creatinas", "aminoacidos"],
    hipercaloricos: ["creatinas", "proteinas"], quemadores: ["proteinas", "pre-entrenos"], aminoacidos: ["proteinas", "glutaminas"],
    glutaminas: ["proteinas", "creatinas"], multivitaminicos: ["proteinas", "precursores-naturales"], snacks: ["proteinas", "termos-shakers"],
    "termos-shakers": ["proteinas", "creatinas"], "precursores-naturales": ["multivitaminicos", "proteinas"],
  };
  function stackFor(p) {
    const cats = COMPLEMENTS[p.category] || [];
    const out = [];
    cats.forEach((c) => {
      const pool = C.getByCategory(c).filter(C.inStock);
      const pick = pool.filter((x) => x.bestSeller).concat(pool.filter((x) => !x.bestSeller));
      out.push(...pick.slice(0, cats.length > 2 ? 3 : 4));
    });
    return out.slice(0, 10);
  }
  function relatedFor(p) {
    const base = C.priceInfo(p).min;
    return C.getByCategory(p.category).filter((x) => x.id !== p.id && C.inStock(x))
      .sort((x, y) => (Number(y.brand === p.brand) - Number(x.brand === p.brand)) || (Math.abs(C.priceInfo(x).min - base) - Math.abs(C.priceInfo(y).min - base)))
      .slice(0, 10);
  }

  function renderProduct() {
    const p = C.getProductBySlug(params.get("p"));
    if (!p) return notFound("Este producto no existe o ya no está disponible.");
    const cat = C.getCategory(p.category);
    const brand = C.getBrand(p.brand);
    setMeta(p.name, (brand ? brand.name + " · " : "") + p.name + ". " + (p.description || "").slice(0, 120));
    N.Recent.push(p.slug);

    const hasV = C.hasVariants(p);
    let variant = hasV ? (p.variants.find((v) => v.stock > 0) || p.variants[0]).name : "";

    const thumbs = (p.images || []).length > 1
      ? '<div class="gallery__thumbs">' + p.images.map((src, i) => '<button class="gallery__thumb" type="button" data-thumb="' + i + '" aria-label="Ver imagen ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : "") + '><img src="' + esc(url(src)) + '" alt="" loading="lazy"></button>').join("") + "</div>"
      : "";
    const variantsHTML = hasV
      ? '<div class="pdp__block"><span class="pdp__label" id="vlabel">' + esc(p.variantLabel || "Opción") + ': <strong data-vname></strong></span><div class="variants" role="group" aria-labelledby="vlabel">' +
        p.variants.map((v) => '<button class="variant" type="button" data-variant="' + esc(v.name) + '"' + (v.stock > 0 ? "" : ' disabled title="Agotado"') + ">" + esc(v.name) + "</button>").join("") + "</div></div>"
      : "";
    const trust = [
      ["shield", "Producto 100 % original", "Solo vendemos productos originales."],
      ["truck", "Envíos a todo Colombia", "Coordinamos el envío según tu ciudad."],
      ["chat", "Asesoría por WhatsApp", "Te ayudamos a elegir sabor y presentación."],
      ["card", "Paga como prefieras", S.paymentMethods.join(", ") + "."],
    ];
    const acc = (title, body, open) => '<details class="acc"' + (open ? " open" : "") + '><summary>' + esc(title) + '<span class="acc__icon" aria-hidden="true"></span></summary><div class="acc__body">' + body + "</div></details>";
    const info = C.priceInfo(p);

    main.innerHTML =
      '<div class="container pdp pdp--v2">' +
        '<nav class="breadcrumb breadcrumb--light" aria-label="Ruta"><a href="' + url("index.html") + '">Inicio</a> / ' + (cat ? '<a href="' + url("categoria.html?c=" + cat.slug) + '">' + esc(cat.name) + "</a> / " : "") + '<span aria-current="page">' + esc(p.name) + "</span></nav>" +
        '<div class="pdp__grid">' +
          '<div class="gallery"><div class="gallery__main" data-main>' + (C.isOnSale(p) ? '<span class="badge">' + (info.regular > info.min && info.min === info.max ? "−" + Math.round((1 - info.min / info.regular) * 100) + "%" : "¡Oferta!") + "</span>" : "") +
            N.productImage(p, 0, "gallery__img", { full: true, eager: true }) + '<span class="gallery__hint" aria-hidden="true">Pasa el mouse para ampliar</span></div>' + thumbs + "</div>" +
          '<div class="pdp__info">' +
            '<div class="pdp__top">' + (brand ? '<a class="pdp__brand" href="' + url("marca.html?m=" + brand.slug) + '">' + esc(brand.name) + "</a>" : "<span></span>") +
              '<button class="pdp__share" type="button" data-share>' + N.ICON.share + "<span>Compartir</span></button></div>" +
            '<h1 class="pdp__title">' + esc(p.name) + "</h1>" +
            '<div class="pdp__pricebox"><p class="pdp__price" data-price></p><p class="pdp__save" data-save></p></div>' +
            '<p class="pdp__stock" data-stock></p>' +
            variantsHTML +
            '<div class="pdp__block"><span class="pdp__label">Cantidad</span>' +
            '<div class="pdp__buy"><div class="qty"><button type="button" aria-label="Restar uno" data-q="-1">−</button><input type="number" min="1" max="99" value="1" aria-label="Cantidad" data-qinput><button type="button" aria-label="Sumar uno" data-q="1">+</button></div>' +
            '<button class="btn pdp__add" type="button" data-add>Agregar al carrito</button></div>' +
            '<a class="btn btn--outline btn--block pdp__wa" data-wa target="_blank" rel="noopener">' + N.ICON.chat + "Pedir por WhatsApp</a></div>" +
            '<ul class="trust">' + trust.map(([ic, t, d]) => '<li><span class="trust__icon">' + N.ICON[ic] + '</span><span><strong>' + esc(t) + "</strong><span>" + esc(d) + "</span></span></li>").join("") + "</ul>" +
            '<div class="accs">' +
              acc("Descripción", "<p>" + esc(p.description) + "</p>" + (cat ? '<p class="pdp__meta">Categoría: <a href="' + url("categoria.html?c=" + cat.slug) + '">' + esc(cat.name) + "</a>" + (brand ? ' · Marca: <a href="' + url("marca.html?m=" + brand.slug) + '">' + esc(brand.name) + "</a>" : "") + "</p>" : ""), true) +
              acc("Envíos", "<p>Hacemos envíos a todo Colombia. Al finalizar tu pedido por WhatsApp te confirmamos el costo y el tiempo de entrega según tu ciudad.</p>") +
              acc("Medios de pago", "<p>" + esc(S.paymentMethods.join(", ")) + ". " + esc(S.paymentNote) + "</p>") +
              acc("Uso responsable", "<p>Los suplementos no reemplazan una alimentación balanceada. Consulta con un profesional de la salud antes de consumirlos.</p>") +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
      productRail("Completa tu stack", stackFor(p), "Combínalo con") +
      productRail("También te puede interesar", relatedFor(p), cat ? cat.name : "", cat ? "categoria.html?c=" + cat.slug : "") +
      (N.Recent.products(p.slug).length ? productRail("Vistos recientemente", N.Recent.products(p.slug), "Tu historial") : "") +
      '<div class="buybar" data-buybar aria-hidden="true"><div class="container buybar__inner">' +
        '<span class="buybar__img">' + N.productImage(p) + '</span><span class="buybar__txt"><strong>' + esc(p.name) + '</strong><span data-bprice></span></span>' +
        '<button class="btn" type="button" data-add2 tabindex="-1">Agregar</button></div></div>';

    const qInput = $("[data-qinput]");
    const update = () => {
      const unitObj = hasV ? p.variants.find((v) => v.name === variant) : p;
      const ok = C.inStock(p, variant || undefined);
      const reg = unitObj.price, eff = C.unitPrice(p, variant);
      $("[data-price]").innerHTML = eff < reg ? '<span class="price-old"><span class="sr-only">Antes </span>' + money(reg) + '</span><span class="price-new"><span class="sr-only">Ahora </span>' + money(eff) + "</span>" : '<span class="price-new">' + money(eff) + "</span>";
      $("[data-save]").textContent = eff < reg ? "Ahorras " + money(reg - eff) : "";
      $("[data-bprice]").textContent = money(eff);
      const st = $("[data-stock]");
      st.innerHTML = ok ? '<span class="dot"></span>Disponible para envío' : "Agotado";
      st.classList.toggle("is-out", !ok);
      [$("[data-add]"), $("[data-add2]")].forEach((b) => { b.disabled = !ok; });
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
    const add = () => {
      N.Cart.add(p.id, variant, Math.max(1, Number(qInput.value) || 1));
      N.openCart();
      N.toast("Agregado al carrito: " + p.name + (variant ? " · " + variant : ""));
    };
    $("[data-add]").addEventListener("click", add);
    $("[data-add2]").addEventListener("click", add);
    $$("[data-thumb]").forEach((b) => b.addEventListener("click", () => {
      const img = $("[data-main] img"); if (img) img.src = url(p.images[Number(b.dataset.thumb)]);
      $$("[data-thumb]").forEach((x) => x.setAttribute("aria-current", String(x === b)));
    }));
    // Zoom al pasar el mouse (solo con puntero fino)
    const mainImg = $("[data-main]");
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      mainImg.classList.add("can-zoom");
      mainImg.addEventListener("mousemove", (e) => {
        const r = mainImg.getBoundingClientRect(); const img = $("img", mainImg); if (!img) return;
        img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%";
      });
    }
    // Compartir
    $("[data-share]").addEventListener("click", async () => {
      const data = { title: p.name, text: p.name + " en " + S.name, url: location.href };
      try { if (navigator.share) { await navigator.share(data); return; } await navigator.clipboard.writeText(location.href); N.toast("Enlace copiado"); }
      catch (e) { /* cancelado */ }
    });
    // Barra fija de compra cuando el botón principal sale de pantalla
    const bar = $("[data-buybar]");
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => {
        const show = !en.isIntersecting && en.boundingClientRect.top < 0;
        bar.classList.toggle("is-visible", show); bar.setAttribute("aria-hidden", String(!show));
        $("[data-add2]").tabIndex = show ? 0 : -1;
      }).observe($("[data-add]"));
    }
    update();
    initRails();

    // Datos estructurados (SEO)
    const abs = (u) => new URL(url(u), location.href).href;
    const ld = [{ "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, sku: String(p.id),
      image: (p.images || []).map(abs), brand: brand ? { "@type": "Brand", name: brand.name } : undefined, category: cat ? cat.name : undefined,
      offers: { "@type": "AggregateOffer", priceCurrency: "COP", lowPrice: info.min, highPrice: info.max, offerCount: hasV ? p.variants.length : 1, url: location.href,
        availability: C.inStock(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: abs("index.html") },
        cat ? { "@type": "ListItem", position: 2, name: cat.name, item: abs("categoria.html?c=" + cat.slug) } : null,
        { "@type": "ListItem", position: cat ? 3 : 2, name: p.name, item: location.href }].filter(Boolean) }];
    const sc = document.createElement("script"); sc.type = "application/ld+json"; sc.textContent = JSON.stringify(ld); document.head.appendChild(sc);
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
    novedades: () => renderListing({ title: "Novedades", subtitle: "Los suplementos que acaban de llegar a la tienda.", list: C.sortProducts(C.getNew()), crumbs: [{ label: "Novedades" }] }),
    combos: () => renderListing({ title: "Combos", subtitle: "Arma tu stack y ahorra con nuestros combos.", list: C.getCombos(), crumbs: [{ label: "Combos" }] }),
    buscar: renderSearch,
    producto: renderProduct,
    carrito: renderCartPage,
  };
  if (routes[page] && main) routes[page]();
})();
