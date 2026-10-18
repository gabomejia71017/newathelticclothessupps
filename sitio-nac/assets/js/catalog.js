/* =========================================================================
   CAPA DE DATOS (única puerta de entrada al catálogo)
   Todos los componentes leen productos SOLO a través de estas funciones.
   En una fase futura, puedes cambiar su interior para leer de una base de
   datos o API sin tocar el resto del sitio.
   ========================================================================= */
(function () {
  const all = () => (window.PRODUCTS || []);

  const normalize = (s) => String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .trim();

  // ---- Precios y stock ----
  const effective = (o) => (o.salePrice && o.salePrice < o.price ? o.salePrice : o.price);

  function hasVariants(p) { return Array.isArray(p.variants) && p.variants.length > 0; }

  function inStock(p, variantName) {
    if (hasVariants(p)) {
      if (variantName) {
        const v = p.variants.find((x) => x.name === variantName);
        return !!v && v.stock > 0;
      }
      return p.variants.some((v) => v.stock > 0);
    }
    return (p.stock || 0) > 0;
  }

  function isOnSale(p) {
    if (hasVariants(p)) return p.variants.some((v) => v.salePrice && v.salePrice < v.price);
    return !!(p.salePrice && p.salePrice < p.price);
  }

  /** Devuelve { min, max, regular } para mostrar precio o rango */
  function priceInfo(p) {
    if (hasVariants(p)) {
      const eff = p.variants.map(effective);
      const reg = p.variants.map((v) => v.price);
      return { min: Math.min(...eff), max: Math.max(...eff), regular: Math.max(...reg), onSale: isOnSale(p) };
    }
    const e = effective(p);
    return { min: e, max: e, regular: p.price, onSale: isOnSale(p) };
  }

  /** Precio unitario de un producto (y variante si aplica) */
  function unitPrice(p, variantName) {
    if (hasVariants(p)) {
      const v = p.variants.find((x) => x.name === variantName) || p.variants[0];
      return effective(v);
    }
    return effective(p);
  }

  // ---- Consultas ----
  const getProducts = () => all().slice();
  const getProductById = (id) => all().find((p) => p.id === Number(id));
  const getProductBySlug = (slug) => all().find((p) => p.slug === slug);
  const getByCategory = (slug) => all().filter((p) => p.category === slug);
  const getByBrand = (slug) => all().filter((p) => p.brand === slug);
  const getOffers = () => all().filter(isOnSale);
  const getNew = () => all().filter((p) => p.isNew);
  const getBestSellers = () => all().filter((p) => p.bestSeller);
  const getCombos = () => all().filter((p) => p.combo);

  function getRelated(p, n = 4) {
    return all().filter((x) => x.category === p.category && x.id !== p.id).slice(0, n);
  }

  function search(q, limit = 0) {
    const terms = normalize(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const site = window.SITE || {};
    const catName = (s) => (site.categories || []).find((c) => c.slug === s)?.name || "";
    const brandName = (s) => (site.brands || []).find((b) => b.slug === s)?.name || "";
    const res = all().filter((p) => {
      const hay = normalize([p.name, catName(p.category), brandName(p.brand), (p.variants || []).map((v) => v.name).join(" ")].join(" "));
      return terms.every((t) => hay.includes(t));
    });
    return limit ? res.slice(0, limit) : res;
  }

  function sortProducts(list, mode) {
    const l = list.slice();
    if (mode === "price-asc") l.sort((a, b) => priceInfo(a).min - priceInfo(b).min);
    if (mode === "price-desc") l.sort((a, b) => priceInfo(b).min - priceInfo(a).min);
    if (mode === "name") l.sort((a, b) => a.name.localeCompare(b.name, "es"));
    // los agotados siempre al final
    l.sort((a, b) => Number(!inStock(a)) - Number(!inStock(b)));
    return l;
  }

  // ---- Taxonomías ----
  const getCategory = (slug) => (window.SITE.categories || []).find((c) => c.slug === slug);
  const getBrand = (slug) => (window.SITE.brands || []).find((b) => b.slug === slug);

  window.Catalog = {
    normalize, hasVariants, inStock, isOnSale, priceInfo, unitPrice,
    getProducts, getProductById, getProductBySlug, getByCategory, getByBrand,
    getOffers, getNew, getBestSellers, getCombos, getRelated, search, sortProducts,
    getCategory, getBrand,
  };
})();
