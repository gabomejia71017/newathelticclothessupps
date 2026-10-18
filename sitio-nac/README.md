# New Athletic Clothes — Tienda de suplementos (sitio estático)

Catálogo, carrito y pedido por WhatsApp. HTML + CSS + JavaScript puro: **no hay que compilar nada** ni instalar dependencias. Se sube tal cual a Vercel, Cloudflare Pages, Netlify o GitHub Pages.

> Todos los productos, marcas y fotos son **de ejemplo**. Reemplázalos por los tuyos antes de publicar.

---

## 1. Ver la página en tu computador

Abre una terminal en esta carpeta y ejecuta **una** de estas opciones:

```bash
npx serve .          # si tienes Node.js
python -m http.server 8080   # si tienes Python
```

Luego abre `http://localhost:3000` (serve) o `http://localhost:8080` (Python).
También puedes usar la extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*).

---

## 2. Qué archivo editar para cada cosa

| Quiero cambiar…                                   | Archivo |
|---------------------------------------------------|---------|
| WhatsApp, Instagram, TikTok, Facebook             | `config/site.js` → `whatsapp`, `social` |
| Mensajes de la barra superior                     | `config/site.js` → `marquee` |
| Textos o imágenes de los banners principales      | `config/site.js` → `hero` |
| Franjas "Clic aquí"                               | `config/site.js` → `heroStrips` |
| Banners verticales (filas de 3)                   | `config/site.js` → `bannerRows` |
| Categorías y marcas del menú                      | `config/site.js` → `categories`, `brands` |
| Medios de pago del footer                         | `config/site.js` → `paymentMethods` |
| Productos, precios, ofertas, sabores, stock       | `data/products.js` |
| Colores, tipografía, tamaños                      | `assets/css/styles.css` (variables en `:root`) |
| Textos legales                                    | `legal/*.html` |
| Logo                                              | `assets/brand/logo-blanco.png` y `logo-negro.png` |

### Agregar un producto
Copia un bloque `{ ... },` en `data/products.js` y cambia los datos:

```js
{ id: 31, slug: "mi-proteina-2lb", name: "Mi Proteína 2 LB", category: "proteinas", brand: "atlas-nutrition",
  description: "Descripción del producto.",
  images: ["products/mi-proteina-2lb-1.jpg", "products/mi-proteina-2lb-2.jpg"],
  price: 250000, salePrice: 229000, stock: 10,
  variantLabel: "Sabor",
  variants: [
    { name: "Chocolate", price: 250000, salePrice: 229000, stock: 6 },
    { name: "Vainilla",  price: 250000, stock: 0 }   // stock 0 = agotado
  ],
  isNew: true, bestSeller: false, combo: false, paymentLink: "" },
```

Reglas:
- `id` único y `slug` único (minúsculas, sin tildes ni espacios).
- `category` y `brand` deben existir en `config/site.js`.
- Precios **sin puntos** (`139000`). La página los muestra como `$139.000`.
- Si no hay `salePrice`, no sale la etiqueta "¡Oferta!".
- Si hay `variants`, se usa el precio/stock de cada variante y la tarjeta muestra el rango "desde – hasta".
- `isNew` → sección "Nuevos suplementos"; `bestSeller` → "Más vendidos"; `combo` → página Combos. Las ofertas se detectan solas.

### Fotos y banners
- **Productos:** `products/` — cuadradas, 1000×1000 px, fondo blanco, JPG/WEBP de menos de 200 KB.
- **Hero:** `banners/` — escritorio 1920×800 px, celular 900×1100 px.
- **Franjas:** 1920×400 px. **Banners verticales:** 800×1000 px (4:5).
- Nombres sin tildes ni espacios. Comprime en [squoosh.app](https://squoosh.app) antes de subir.
- Si dejas `image: ""`, se muestra el diseño tipográfico en blanco y negro.

### Después de agregar productos o cambiar el dominio
Actualiza el sitemap (opcional, mejora el SEO):
```bash
node scripts/generar-sitemap.js
```

---

## 3. Publicar

### ⚠️ Importante sobre Vercel
El plan gratuito de Vercel (**Hobby**) es solo para uso **personal y no comercial**; una tienda que anuncia la venta de productos se considera uso comercial. Para una tienda necesitas **Vercel Pro** (≈ US$20/mes). Alternativa gratuita que sí permite uso comercial: **Cloudflare Pages**. Este sitio funciona igual en los dos.

### Opción A — Vercel
1. Crea una cuenta en [vercel.com](https://vercel.com) (con plan Pro para uso comercial).
2. Sube esta carpeta a un repositorio de GitHub (puedes usar GitHub Desktop: *Add existing repository* → *Publish*).
3. En Vercel: **Add New → Project → Import** tu repositorio.
4. Framework Preset: **Other**. Build Command: *vacío*. Output Directory: *vacío* (o `.`).
5. **Deploy**. Cada vez que hagas *push* a GitHub, Vercel publica los cambios solo.

Sin GitHub: instala la CLI y desde esta carpeta ejecuta `npx vercel` (y luego `npx vercel --prod`).

### Opción B — Cloudflare Pages (gratis)
1. Crea una cuenta en [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages**.
2. Elige **Upload assets** y arrastra esta carpeta (o conecta tu repositorio de GitHub).
3. Build command: *vacío*. Output directory: `/`.
4. Publica. Te da una dirección `tu-proyecto.pages.dev`.

### Conectar tu dominio
- **Vercel:** Project → Settings → Domains → agrega `tudominio.com` y crea en tu proveedor de dominio los registros que Vercel indique (un `A` y/o `CNAME`).
- **Cloudflare Pages:** Project → Custom domains → Set up a domain y sigue los pasos.
- Luego cambia `url` en `config/site.js`, ejecuta `node scripts/generar-sitemap.js` y en los `.html` reemplaza `https://nac-suplementos.vercel.app` por tu dominio (búsqueda y reemplazo en VS Code: Ctrl+Shift+H).

### Checklist antes de publicar
- [ ] Reemplazar productos, marcas y fotos de ejemplo.
- [ ] Quitar "(ejemplo)" de los nombres.
- [ ] Revisar textos legales con un abogado y completar los campos entre corchetes.
- [ ] Probar el pedido por WhatsApp desde el celular.
- [ ] Cambiar el dominio en `config/site.js` y regenerar el sitemap.
- [ ] Registrar el sitio en Google Search Console y enviar `sitemap.xml`.

---

## 4. Estructura

```
index.html            Inicio
categoria.html?c=…    Categoría
marca.html?m=…        Marca
producto.html?p=…     Detalle de producto
ofertas.html  combos.html  buscar.html?q=…  carrito.html
legal/                Términos, datos, privacidad, devoluciones
config/site.js        Configuración editable
data/products.js      Catálogo
assets/js/catalog.js  Capa de datos (única lectura de productos)
assets/js/app.js      Header, footer, carrito, búsqueda, tarjetas
assets/js/pages.js    Lógica de cada página
assets/css/styles.css Estilos
products/  banners/   Tus fotos
```

---

## 5. Datos personales en esta fase
- El sitio **no guarda datos en ningún servidor**. El carrito vive en el navegador del cliente (localStorage).
- Nombre, ciudad y notas solo viajan dentro del mensaje de WhatsApp que el cliente decide enviar. Desde ese momento tú eres responsable de esos datos (Ley 1581 de 2012): no los compartas, guárdalos solo lo necesario y atiende solicitudes de actualización o supresión.
- No hay analítica ni píxeles de seguimiento. Si los agregas, actualiza la política de datos y agrega aviso de cookies.

---

## 6. Siguientes fases (no implementadas)
La arquitectura ya está separada para crecer sin rehacer el diseño:

1. **Base de datos / panel admin:** cambiar el interior de `assets/js/catalog.js` para leer de una API (por ejemplo Supabase o un CMS como Decap/Sanity). Los componentes no cambian porque solo usan `Catalog.getProducts()`, `getProductBySlug()`, etc.
2. **Pasarela de pagos (Wompi, Mercado Pago, Bold):** el campo `paymentLink` de cada producto ya está reservado para enlaces de pago; para checkout completo se necesita una función de servidor (Vercel Functions o Cloudflare Workers) que firme la transacción.
3. **Login / Mi Cuenta:** activar `features.showAccount` en `config/site.js` cuando exista autenticación.
4. **Migración a Next.js** si el catálogo crece mucho y quieres páginas de producto pre-generadas para SEO.

Al guardar datos en un servidor deberás: registrar la base de datos ante la SIC (RNBD) si aplica, pedir autorización expresa en los formularios, usar HTTPS (ya incluido en Vercel/Cloudflare) y actualizar la política de datos.
