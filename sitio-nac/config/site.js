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

  /* Banners principales (hero). Si pones "image" (y opcional "imageMobile"),
     se muestra tu foto. Si lo dejas vacío, se muestra el diseño tipográfico. */
  hero: [
    {
      image: "",          // ej: "banners/hero-1.jpg"  (1920x800 recomendado)
      imageMobile: "",    // ej: "banners/hero-1-movil.jpg" (900x1100)
      kicker: "NEW ATHLETIC CLOTHES",
      title: "SUPLEMENTACIÓN",
      subtitle: "CON ACTITUD",
      theme: "dark",
      href: "categoria.html?c=proteinas",
      alt: "Suplementación con actitud — New Athletic Clothes",
    },
    {
      image: "",
      imageMobile: "",
      kicker: "ENTRENA • RECUPERA • REPITE",
      title: "TU MEJOR VERSIÓN",
      subtitle: "EMPIEZA HOY",
      theme: "light",
      href: "ofertas.html",
      alt: "Tu mejor versión empieza hoy",
    },
  ],

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
    { slug: "healthy-america", name: "Healthy America" },
    { slug: "healthy-sports", name: "Healthy Sports" },
    { slug: "imn", name: "IMN" },
    { slug: "iron-nutrition", name: "Iron Nutrition" },
    { slug: "musclemeds", name: "MuscleMeds" },
    { slug: "muscletech", name: "MuscleTech" },
    { slug: "nutramerican", name: "Nutramerican" },
    { slug: "optimum-nutrition", name: "Optimum Nutrition" },
    { slug: "proscience", name: "Proscience" },
    { slug: "rhinox", name: "Rhinox" },
    { slug: "supra", name: "Supra" },
    { slug: "tnt", name: "TNT" },
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
