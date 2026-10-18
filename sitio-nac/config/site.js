/* =========================================================================
   CONFIGURACIÓN GENERAL DEL SITIO — New Athletic Clothes
   Edita aquí: nombre, WhatsApp, redes, marquesina, hero, menús, categorías y marcas.
   No necesitas tocar el resto del código para cambiar estos datos.
   ========================================================================= */
window.SITE = {
  name: "New Athletic Clothes",
  shortName: "New Athletic",
  tagline: "Suplementación y estilo para quienes entrenan en serio",
  // Cambia esto por tu dominio real cuando lo conectes (se usa en SEO y sitemap)
  url: "https://nac-suplementos.vercel.app",

  // WhatsApp: solo números, con indicativo de país (57 = Colombia)
  whatsapp: "573241068362",
  whatsappDisplay: "+57 324 106 8362",
  whatsappGreeting: "Hola New Athletic, vengo de la web",

  social: {
    instagram: "https://www.instagram.com/nathletic.c/",
    instagramHandle: "@nathletic.c",
    facebook: "",   // deja vacío para ocultar el ícono
    tiktok: "",     // ej: "https://www.tiktok.com/@tuusuario"
  },

  // Mensajes de la barra superior (marquesina)
  marquee: [
    "ENVÍOS A TODO COLOMBIA",
    "¡GRACIAS POR ELEGIRNOS!",
    "PRODUCTOS ORIGINALES",
    "NEW ATHLETIC CLOTHES",
  ],

  // Funciones que se activarán en fases futuras
  features: {
    showAccount: false,     // "Mi Cuenta" (requiere login — fase futura)
    onlinePayments: false,  // pasarela de pagos (fase futura)
  },

  /* CARRUSEL PRINCIPAL (pasa solo cada 6 segundos).
     Cada diapositiva puede tener:
     - image / imageMobile: tu foto de fondo (opcional; 1920x700 y 900x1100)
     - products: slugs de productos cuyas fotos se muestran a la derecha (en tarjetas)
     - floating: fotos SIN FONDO (PNG) para mostrar los tarros flotando; si existe, reemplaza a products
     - theme: "dark" (negro) o "light" (blanco)
     - href: página a la que lleva al tocar la diapositiva
     - cta: botones opcionales, ej: [{ label: "Ver ofertas", href: "ofertas.html" }] */
  hero: [
    {
      kicker: "NEW ATHLETIC CLOTHES",
      title: "SUPLEMENTACIÓN",
      subtitle: "CON ACTITUD",
      text: "Proteínas, creatinas y pre-entrenos 100 % originales con envío a todo Colombia.",
      theme: "dark",
      products: ["iso-100-5lb", "nitro-tech-whey-gold-5lb", "100-whey-gold-standard-5lb"],
      // Fotos SIN FONDO (PNG transparente) para el efecto de tarros flotando
      floating: ["products/sin-fondo/iso-100-5lb.png", "products/sin-fondo/nitro-tech-whey-gold-5lb.png", "products/sin-fondo/100-whey-gold-standard-5lb.png"],
      href: "categoria.html?c=proteinas",
      image: "", imageMobile: "",
    },
    {
      kicker: "ENTRENA • RECUPERA • REPITE",
      title: "TU MEJOR VERSIÓN",
      subtitle: "EMPIEZA HOY",
      text: "Creatina para más fuerza en cada repetición. Elige la tuya.",
      theme: "light",
      products: ["creatina-platinum-muscletech", "tnt-mega-mass-gainer-10lb"],
      href: "categoria.html?c=creatinas",
      image: "", imageMobile: "",
    },
    {
      kicker: "PRECIO ESPECIAL",
      title: "OFERTAS",
      subtitle: "DE LA SEMANA",
      text: "Descuentos en tus marcas favoritas por tiempo limitado.",
      theme: "dark",
      products: ["tnt-mega-mass-gainer-10lb", "nitro-tech-whey-gold-5lb", "iso-100-5lb"],
      floating: ["products/sin-fondo/nitro-tech-whey-gold-5lb.png", "products/sin-fondo/100-whey-gold-standard-5lb.png"],
      href: "ofertas.html",
      image: "", imageMobile: "",
    },
  ],

  // Sección "Compra por objetivo"
  goals: [
    { title: "Ganar masa", text: "Hipercalóricos y proteínas", href: "categoria.html?c=hipercaloricos", icon: "up" },
    { title: "Más fuerza", text: "Creatinas para rendir más", href: "categoria.html?c=creatinas", icon: "bolt" },
    { title: "Definir", text: "Proteínas limpias y quemadores", href: "categoria.html?c=quemadores", icon: "fire" },
    { title: "Bienestar", text: "Vitaminas y minerales", href: "categoria.html?c=multivitaminicos", icon: "heart" },
  ],

  // Sección "Así de fácil compras"
  steps: [
    { title: "Elige tus productos", text: "Agrégalos al carrito con el sabor y la cantidad que quieras." },
    { title: "Pide por WhatsApp", text: "Finaliza el pedido y te llega el resumen a nuestro chat." },
    { title: "Recíbelo en casa", text: "Coordinamos el pago y te lo enviamos a cualquier ciudad." },
  ],

  // Barra de beneficios debajo del hero.
  // icon: truck | shield | chat | instagram | card ; link: "whatsapp", "instagram", una página o "" (sin enlace)
  benefits: [
    { icon: "truck", title: "Envíos a todo Colombia", text: "Despacho rápido a tu ciudad", link: "" },
    { icon: "shield", title: "100 % originales", text: "Marcas y sellos verificados", link: "" },
    { icon: "chat", title: "Asesoría gratis", text: "Escríbenos por WhatsApp", link: "whatsapp" },
    { icon: "instagram", title: "@nathletic.c", text: "Síguenos en Instagram", link: "instagram" },
  ],

  // (Ya no se usan en el inicio; se reemplazaron por la barra de beneficios)
  // Franjas con botón "Clic aquí" debajo del hero
  heroStrips: [
    {
      text: "¿DUDAS CON TU SUPLEMENTO? TE ASESORAMOS POR WHATSAPP",
      button: "Clic aquí",
      type: "whatsapp",
      image: "", // opcional: "banners/franja-1.jpg" (1920x400)
    },
    {
      text: "SÍGUENOS EN INSTAGRAM @NATHLETIC.C",
      button: "Clic aquí",
      type: "instagram",
      image: "",
    },
  ],

  // Filas de 3 banners verticales (proporción 4:5, recomendado 800x1000)
  bannerRows: [
    [
      { title: "PROTEÍNAS", text: "Recuperación y masa muscular", href: "categoria.html?c=proteinas", image: "" },
      { title: "CREATINAS", text: "Fuerza en cada repetición", href: "categoria.html?c=creatinas", image: "" },
      { title: "PRE-ENTRENOS", text: "Energía para darlo todo", href: "categoria.html?c=pre-entrenos", image: "" },
    ],
    [
      { title: "COMBOS", text: "Arma tu stack y ahorra", href: "combos.html", image: "" },
      { title: "MULTIVITAMÍNICOS", text: "Lo básico, bien hecho", href: "categoria.html?c=multivitaminicos", image: "" },
      { title: "SHAKERS", text: "Lleva tu batido a todas partes", href: "categoria.html?c=termos-shakers", image: "" },
    ],
  ],

  // Cuántos productos mostrar en cada sección del inicio
  home: {
    bestSellersLimit: 20,
    offersLimit: 12,
    newLimit: 0, // 0 = sin límite
  },

  // Categorías (slug = lo que va en la URL; no uses tildes ni espacios en el slug)
  categories: [
    { slug: "proteinas", name: "Proteínas limpias" },
    { slug: "hipercaloricos", name: "Hipercalóricos" },
    { slug: "pre-entrenos", name: "Pre-entrenos" },
    { slug: "quemadores", name: "Quemadores" },
    { slug: "aminoacidos", name: "Aminoácidos" },
    { slug: "creatinas", name: "Creatinas" },
    { slug: "glutaminas", name: "Glutaminas" },
    { slug: "multivitaminicos", name: "Multivitamínicos" },
    { slug: "snacks", name: "Snacks" },
    { slug: "termos-shakers", name: "Termos / Shakers" },
    { slug: "precursores-naturales", name: "Precursores naturales" },
  ],

  // Marcas (edítalas según lo que vendes)
  brands: [
    { slug: "alpha-bull", name: "Alpha Bull" },
    { slug: "bsn", name: "BSN" },
    { slug: "cellucor", name: "Cellucor" },
    { slug: "doctor-stronger", name: "Doctor Stronger" },
    { slug: "dymatize", name: "Dymatize" },
    { slug: "fitmafia", name: "FitMafia" },
    { slug: "gmn", name: "GMN" },
    { slug: "healthy-america", name: "Healthy America" },
    { slug: "healthy-sports", name: "Healthy Sports" },
    { slug: "imn", name: "IMN" },
    { slug: "isopure", name: "Isopure" },
    { slug: "line-up", name: "Line Up" },
    { slug: "musclemeds", name: "MuscleMeds" },
    { slug: "muscletech", name: "MuscleTech" },
    { slug: "natural-systems", name: "Natural Systems" },
    { slug: "neopharma", name: "Neopharma" },
    { slug: "nuspro", name: "Nuspro" },
    { slug: "nutramerican", name: "Nutramerican" },
    { slug: "nutrex", name: "Nutrex" },
    { slug: "optimum-nutrition", name: "Optimum Nutrition" },
    { slug: "proscience", name: "Proscience" },
    { slug: "rhinox", name: "Rhinox" },
    { slug: "smart-nutrition", name: "Smart Nutrition" },
    { slug: "smartmuscle", name: "Smartmuscle" },
    { slug: "supra", name: "Supra" },
    { slug: "universal", name: "Universal" },
    { slug: "vitanas", name: "Vitanas" },
    { slug: "otras", name: "Otras marcas" },
  ],

  // Medios de pago que aparecen en el footer (texto editable)
  paymentMethods: ["Transferencia", "Nequi", "Daviplata", "Bre-B", "Tarjeta débito/crédito", "Contraentrega*"],
  paymentNote: "*Sujeto a cobertura. Coordinamos el pago contigo por WhatsApp.",

  // Enlaces legales del footer
  legal: [
    { href: "legal/datos.html", label: "Política de tratamiento de datos" },
    { href: "legal/privacidad.html", label: "Aviso de privacidad" },
    { href: "legal/terminos.html", label: "Términos y condiciones" },
    { href: "legal/devoluciones.html", label: "Cambios y devoluciones" },
  ],

  footerLine: "NEW ATHLETIC CLOTHES | ENTRENA CON ACTITUD",
};
