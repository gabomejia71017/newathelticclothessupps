/* Genera sitemap.xml a partir de config/site.js y data/products.js
   Uso:  node scripts/generar-sitemap.js
   (Ejecútalo cada vez que agregues productos o cambies el dominio en config/site.js) */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "config/site.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(root, "data/products.js"), "utf8"), ctx);
const S = ctx.window.SITE, P = ctx.window.PRODUCTS;
const base = S.url.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);
const urls = [
  "", "ofertas.html", "combos.html", "carrito.html",
  "legal/terminos.html", "legal/datos.html", "legal/privacidad.html", "legal/devoluciones.html",
  ...S.categories.map((c) => "categoria.html?c=" + c.slug),
  ...S.brands.map((b) => "marca.html?m=" + b.slug),
  ...P.map((p) => "producto.html?p=" + p.slug),
];
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => "  <url><loc>" + (base + "/" + u).replace(/&/g, "&amp;") + "</loc><lastmod>" + today + "</lastmod></url>").join("\n") +
  "\n</urlset>\n";
fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
fs.writeFileSync(path.join(root, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: " + base + "/sitemap.xml\n");
console.log("sitemap.xml generado con " + urls.length + " URLs");
