/**
 * ==========================================================================
 * SNEAKERS SHADAY - ADMIN.JS (CONEXIÓN OFICIAL SUPABASE AUTH & POSTGRESQL)
 * ==========================================================================
 */

// ==========================================================================
// 1. PEGA AQUÍ TUS CREDENCIALES DE SUPABASE
// ==========================================================================
const SUPABASE_URL = 'https://obzyazdmnzxtwjnxkhkk.supabase.co'; // Ej: https://xxxx.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ienlhemRtbnp4dHdqbnhraGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MzUzNTMsImV4cCI6MjEwNjMxMTM1M30.yEFpKmFw93CErHtQidD0zMbCbfiEgQ6m0HMWZqJ00QA"; // Clave larga anon

// Inicialización del cliente Supabase
const supabase = (window.supabase && SUPABASE_URL.startsWith("https://")) 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// ==========================================================================
// 2. BASE DE DATOS LOCAL OFICIAL DE LOS 30 SNEAKERS (RESPALDO Y SEED)
// ==========================================================================
const OFFICIAL_30_SNEAKERS = [
  { id: 'snk-001', nombre: 'Air Jordan 4 Retro Tour Yellow', marca: 'Jordan', precio: 950, tallas: [39,40,41,42,43], badge: 'Más Vendido', imagen_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80', descripcion: 'Silueta icónica con acabado en cuero sintético y amortiguación Air-Sole.' },
  { id: 'snk-002', nombre: 'Air Jordan 1 Retro Low OG Last Dance', marca: 'Jordan', precio: 780, tallas: [38,39,40,41,42], badge: 'Tendencia', imagen_url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=700&q=80', descripcion: 'Perfil bajo con mezcla de tonos negros, blancos y rojos legendarios.' },
  { id: 'snk-003', nombre: 'Nike Dunk Low Retro Panda', marca: 'Nike', precio: 650, tallas: [38,39,40,41,42,43], badge: 'Drop Exclusivo', imagen_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=80', descripcion: 'El par streetwear más popular en blanco y negro.' },
  { id: 'snk-004', nombre: 'Nike Air Bakin Varsity Royal', marca: 'Nike', precio: 890, tallas: [40,41,42,43], badge: 'Exclusivo', imagen_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80', descripcion: 'Líneas fluidas y cámara de aire visible en azul eléctrico.' },
  { id: 'snk-005', nombre: 'Adidas Forum Low Classic White', marca: 'Adidas', precio: 590, tallas: [38,39,40,41,42], badge: 'Clásico', imagen_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=700&q=80', descripcion: 'Inspirada en el basketball de los años 80.' },
  { id: 'snk-006', nombre: 'Adidas Yeezy Boost 350 V2 Onyx', marca: 'Adidas', precio: 1100, tallas: [39,40,41,42], badge: 'Premium', imagen_url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=700&q=80', descripcion: 'Tecnología Primeknit con entresuela BOOST ultracómoda.' },
  { id: 'snk-007', nombre: 'New Balance 550 White Green', marca: 'New Balance', precio: 720, tallas: [39,40,41,42,43], badge: 'Retro Trend', imagen_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=80', descripcion: 'El regreso de un clásico vintage de 1989 en verde bosque.' },
  { id: 'snk-008', nombre: 'Air Jordan 9 Retro Space Jam', marca: 'Jordan', precio: 1050, tallas: [40,41,42,43], badge: 'Colección', imagen_url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=700&q=80', descripcion: 'Edición conmemorativa con grabado multilingüe en la suela.' },
  { id: 'snk-009', nombre: 'Nike Air Force 1 07 Triple White', marca: 'Nike', precio: 620, tallas: [37,38,39,40,41,42,43,44], badge: 'Básico Esencial', imagen_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80', descripcion: 'El clásico blanco absoluto con cámara Nike Air encapsulada.' },
  { id: 'snk-010', nombre: 'Nike SB Dunk Low Pro Wheat', marca: 'Nike', precio: 790, tallas: [39,40,41,42], badge: 'Skate Culture', imagen_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80', descripcion: 'Gamuza marrón suave con suela de goma antiadherente.' },
  { id: 'snk-011', nombre: 'Air Jordan 1 High Travis Mocha Custom', marca: 'Jordan', precio: 1250, tallas: [40,41,42,43], badge: 'Ultra Hype', imagen_url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&q=80', descripcion: 'Swoosh invertido con tonos café mocha y gamuza prémium.' },
  { id: 'snk-012', nombre: 'Adidas Samba OG Cloud White', marca: 'Adidas', precio: 680, tallas: [38,39,40,41,42,43], badge: 'Top Ventas', imagen_url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=700&q=80', descripcion: 'Puntera en T de ante con suela de caramelo flexible.' },
  { id: 'snk-013', nombre: 'Adidas Gazelle Indoor Bold Blue', marca: 'Adidas', precio: 640, tallas: [38,39,40,41,42], badge: 'Vintage', imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80', descripcion: 'Gamuza azul vibrante con las tres franjas dentadas en contraste.' },
  { id: 'snk-014', nombre: 'New Balance 2002R Protection Pack Rain Cloud', marca: 'New Balance', precio: 890, tallas: [40,41,42,43], badge: 'Destacado', imagen_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=700&q=80', descripcion: 'Efecto deconstruido con amortiguación N-ergy prémium.' },
  { id: 'snk-015', nombre: 'New Balance 9060 Sea Salt Cherry', marca: 'New Balance', precio: 920, tallas: [38,39,40,41,42], badge: 'Futurista', imagen_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80', descripcion: 'Diseño esculpido audaz con tecnología ABZORB.' },
  { id: 'snk-016', nombre: 'Nike Air Max 1 86 Big Bubble', marca: 'Nike', precio: 820, tallas: [39,40,41,42,43], badge: 'Edición Especial', imagen_url: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=700&q=80', descripcion: 'Recreación exacta del lanzamiento original de 1986.' },
  { id: 'snk-017', nombre: 'Air Jordan 3 Retro White Cement', marca: 'Jordan', precio: 1150, tallas: [40,41,42,43,44], badge: 'Colección', imagen_url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=700&q=80', descripcion: 'Estampado Elephant Print original con cuero granulado.' },
  { id: 'snk-018', nombre: 'Air Jordan 11 Retro Jubilee 25th', marca: 'Jordan', precio: 1200, tallas: [40,41,42,43], badge: 'Edición Limitada', imagen_url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=80', descripcion: 'Charol negro brillante con placa media de fibra de carbono.' },
  { id: 'snk-019', nombre: 'Adidas Campus 00s Core Black', marca: 'Adidas', precio: 610, tallas: [37,38,39,40,41,42], badge: 'Streetwear', imagen_url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=700&q=80', descripcion: 'Estilo skate de los años 2000 con cordones extra anchos.' },
  { id: 'snk-020', nombre: 'Vans Old Skool Classic Black White', marca: 'Vans', precio: 450, tallas: [37,38,39,40,41,42,43], badge: 'Clásico Skater', imagen_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80', descripcion: 'Lona resistente con ante y suela waffle de goma duradera.' },
  { id: 'snk-021', nombre: 'Vans Sk8-Hi Pro Black White', marca: 'Vans', precio: 490, tallas: [38,39,40,41,42], badge: 'Caña Alta', imagen_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80', descripcion: 'Bota acolchada con refuerzo para mayor protección al tobillo.' },
  { id: 'snk-022', nombre: 'Converse Chuck 70 High Vintage Black', marca: 'Converse', precio: 480, tallas: [37,38,39,40,41,42,43], badge: 'Económico', imagen_url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=80', descripcion: 'Lona gruesa de 12 oz y plantilla acolchada OrthoLite.' },
  { id: 'snk-023', nombre: 'Puma Suede Classic XXI Negro', marca: 'Puma', precio: 470, tallas: [38,39,40,41,42], badge: 'Urbano Retro', imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80', descripcion: 'Gamuza auténtica con la raya Formstrip clásica desde 1968.' },
  { id: 'snk-024', nombre: 'Puma Slipstream Bball Heritage', marca: 'Puma', precio: 540, tallas: [39,40,41,42,43], badge: 'Novedad', imagen_url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=700&q=80', descripcion: 'Silueta clásica de básquetbol con inserciones de cuero.' },
  { id: 'snk-025', nombre: 'Air Jordan 1 Mid Chicago Toe', marca: 'Jordan', precio: 850, tallas: [39,40,41,42,43], badge: 'Popular', imagen_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80', descripcion: 'Colores icónicos Chicago Bulls en corte medio para uso diario.' },
  { id: 'snk-026', nombre: 'Nike Cortez Classic Leather White Red', marca: 'Nike', precio: 560, tallas: [38,39,40,41,42], badge: 'Vintage Run', imagen_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80', descripcion: 'Diseño liviano de perfil bajo con entresuela de cuña de EVA.' },
  { id: 'snk-027', nombre: 'ASICS GEL-Kayano 14 Metallic Silver', marca: 'ASICS', precio: 860, tallas: [39,40,41,42,43], badge: 'Tendencia Y2K', imagen_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=700&q=80', descripcion: 'Estética plateada running con tecnología de absorción GEL.' },
  { id: 'snk-028', nombre: 'New Balance 1906R Castlerock', marca: 'New Balance', precio: 880, tallas: [40,41,42,43], badge: 'Tech Runner', imagen_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=80', descripcion: 'Estructura técnica con soporte de arco N-lock.' },
  { id: 'snk-029', nombre: 'Adidas Superstar 82 Core White Black', marca: 'Adidas', precio: 580, tallas: [38,39,40,41,42,43], badge: 'Leyenda Urbana', imagen_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=700&q=80', descripcion: 'Puntera de concha clásica con tres franjas dentadas en negro.' },
  { id: 'snk-030', nombre: 'Air Jordan 5 Retro Fire Red Silver', marca: 'Jordan', precio: 1100, tallas: [40,41,42,43,44], badge: 'Colección', imagen_url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=700&q=80', descripcion: 'Lengüeta reflectante 3M con suela de dientes de tiburón.' }
];

// Estado global de datos
let dbProducts = [];
let dbPurchases = JSON.parse(localStorage.getItem("shaday_admin_purchases")) || [];
let dbSales = JSON.parse(localStorage.getItem("shaday_admin_sales")) || [];
let dbProviders = JSON.parse(localStorage.getItem("shaday_admin_providers")) || [
  { id: "prov-1", name: "Importaciones Falabella Chile", phone: "+56 9 8492 1102", city: "Santiago / Iquique", brands: "Nike, Jordan, Adidas" },
  { id: "prov-2", name: "Mayorista Kicks Miami", phone: "+1 305 782 9912", city: "Miami - USA", brands: "Jordan Retro, Yeezy" },
  { id: "prov-3", name: "Distribuidora Streetwear Santa Cruz", phone: "+591 75589123", city: "Santa Cruz de la Sierra", brands: "Vans, Converse, Puma" }
];

let dbUsers = JSON.parse(localStorage.getItem("shaday_users_list")) || [
  { id: "usr-admin-1", nombre: "Dueño de Tienda", email: "admin@shaday.com", rol: "admin" }
];

let selectedImageDataUrl = "";

// ==========================================================================
// 3. INICIALIZACIÓN Y VERIFICACIÓN DE SESIÓN EN LA NUBE
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  await verifyAdminSession();
  await loadProductsFromCloudOrLocal();
  setupNavigation();
  renderAllViews();
});

async function verifyAdminSession() {
  let sessionUser = JSON.parse(localStorage.getItem("shaday_current_user"));

  // Si Supabase está conectado, verificar sesión oficial en la nube
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      sessionUser = {
        id: session.user.id,
        nombre: session.user.user_metadata?.nombre || session.user.email.split("@")[0],
        email: session.user.email,
        rol: session.user.user_metadata?.rol || "admin"
      };
      localStorage.setItem("shaday_current_user", JSON.stringify(sessionUser));
    }
  }

  // Si no hay sesión válida de admin o vendedor, bloquear acceso
  if (!sessionUser || (sessionUser.rol !== "admin" && sessionUser.rol !== "vendedor")) {
    // Si es admin por defecto local, permitirle acceso
    const isMasterLocal = sessionUser && (sessionUser.email === "admin@shaday.com" || sessionUser.email === "jhasmani@shaday.com" || sessionUser.email === "ivan@shaday.com");
    if (!isMasterLocal) {
      document.getElementById("adminAuthLock").style.display = "flex";
      document.getElementById("adminMainLayout").style.display = "none";
      return;
    }
  }

  document.getElementById("adminUserName").textContent = sessionUser.nombre;
  document.getElementById("adminUserRole").textContent = sessionUser.rol === "admin" ? "Administrador" : "Vendedor";
}

// Cargar los 30 productos desde Supabase o inicializar la tabla
async function loadProductsFromCloudOrLocal() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('productos').select('*').order('precio', { ascending: false });
      if (!error && data && data.length > 0) {
        dbProducts = data;
        localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
        return;
      } else if (!error && (!data || data.length === 0)) {
        // Si la tabla de Supabase está vacía, subir automáticamente los 30 productos oficiales a la nube
        await supabase.from('productos').insert(OFFICIAL_30_SNEAKERS);
        dbProducts = [...OFFICIAL_30_SNEAKERS];
        localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
        return;
      }
    } catch (err) {
      console.warn("Aviso: usando base local de respaldo:", err);
    }
  }

  // Respaldo local garantizado: siempre 30 productos
  const stored = JSON.parse(localStorage.getItem("shaday_admin_products"));
  if (stored && stored.length >= 20) {
    dbProducts = stored;
  } else {
    dbProducts = [...OFFICIAL_30_SNEAKERS];
    localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
  }
}

// ==========================================================================
// 4. CREACIÓN DE NUEVOS ADMINISTRADORES EN SUPABASE AUTH
// ==========================================================================
window.handleSaveUser = async function(e) {
  e.preventDefault();
  const nombre = document.getElementById("uName").value.trim();
  const email = document.getElementById("uEmail").value.trim().toLowerCase();
  const rol = document.getElementById("uRole").value;
  const password = document.getElementById("uPassword").value;

  if (password.length < 6) {
    return alert("La contraseña debe tener mínimo 6 caracteres.");
  }

  // 1. Registro directo en Supabase Authentication en la nube
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            nombre: nombre,
            rol: rol // 'admin' o 'vendedor'
          }
        }
      });

      if (error) {
        alert("Error de Supabase: " + error.message);
        return;
      }

      alert(`¡Usuario creado con éxito en Supabase!\n\nNombre: ${nombre}\nCorreo: ${email}\nRol: ${rol.toUpperCase()}\n\nAhora puedes iniciar sesión con esta cuenta desde cualquier celular.`);
    } catch (err) {
      alert("Error de conexión al crear usuario en la nube: " + err.message);
    }
  } else {
    alert(`Aviso: Supabase no está conectado aún en las claves. El usuario se guardó localmente.`);
  }

  // 2. Guardar en lista de visualización
  const newUser = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    nombre: nombre,
    email: email,
    rol: rol,
    fecha: new Date().toLocaleDateString("es-BO")
  };

  dbUsers.push(newUser);
  localStorage.setItem("shaday_users_list", JSON.stringify(dbUsers));

  closeModal("modalUser");
  document.getElementById("userForm").reset();
  renderUsersTable();
};

window.deleteUser = function(idx) {
  if (confirm("¿Deseas revocar el acceso a este usuario en esta lista?")) {
    dbUsers.splice(idx, 1);
    localStorage.setItem("shaday_users_list", JSON.stringify(dbUsers));
    renderUsersTable();
  }
};

function renderUsersTable() {
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = dbUsers.map((u, idx) => `
    <tr>
      <td><strong>${u.nombre}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge-tag ${u.rol === 'admin' ? 'badge-danger' : 'badge-success'}">${u.rol.toUpperCase()}</span></td>
      <td><span class="badge-tag badge-success">Activo</span></td>
      <td style="text-align: right;">
        ${u.email !== "admin@shaday.com" ? `
          <button class="btn-icon-danger" onclick="deleteUser(${idx})" title="Quitar Usuario">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        ` : '<span style="font-size:0.75rem; color:var(--admin-text-muted);">Principal</span>'}
      </td>
    </tr>
  `).join("");
}

// ==========================================================================
// 5. PRODUCTOS: GUARDADO Y ELIMINACIÓN CON SUPABASE
// ==========================================================================
window.handleSaveProduct = async function(e) {
  e.preventDefault();
  const selectedSizes = [];
  document.querySelectorAll('input[name="pSizes"]:checked').forEach(cb => selectedSizes.push(Number(cb.value)));
  if (selectedSizes.length === 0) return alert("Por favor selecciona al menos una talla disponible");

  const newSneaker = {
    id: `snk-${Date.now().toString().slice(-4)}`,
    nombre: document.getElementById("pName").value.trim(),
    marca: document.getElementById("pBrand").value,
    precio: Number(document.getElementById("pPrice").value),
    tallas: selectedSizes,
    badge: document.getElementById("pBadge").value,
    imagen_url: selectedImageDataUrl || "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=80",
    descripcion: document.getElementById("pDesc").value.trim() || "Calzado urbano exclusivo de máxima comodidad y diseño."
  };

  // Guardar en la nube de Supabase si está activo
  if (supabase) {
    try {
      await supabase.from('productos').insert([newSneaker]);
    } catch (err) {
      console.warn("Error guardando en Supabase:", err);
    }
  }

  // Guardar localmente
  dbProducts.unshift(newSneaker);
  localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));

  alert(`¡${newSneaker.nombre} guardado! Ya se visualiza en la tienda pública.`);
  closeModal("modalProduct");
  document.getElementById("productForm").reset();
  removeSelectedImage();
  renderAllViews();
};

window.deleteProduct = async function(id) {
  if (confirm("¿Deseas eliminar este calzado del catálogo?")) {
    if (supabase) {
      try {
        await supabase.from('productos').delete().eq('id', id);
      } catch (err) {
        console.warn("Error eliminando en Supabase:", err);
      }
    }

    dbProducts = dbProducts.filter(p => p.id !== id);
    localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
    renderAllViews();
  }
};

// Renderizado responsivo de la tabla de productos (3 columnas exactas que no se cortan)
function renderProductsTable(query = "") {
  const tbody = document.getElementById("productsTableBody");
  const filtered = dbProducts.filter(p => p.nombre.toLowerCase().includes(query) || p.marca.toLowerCase().includes(query));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center" style="padding:30px; color:var(--admin-text-muted);">No se encontraron modelos</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const tallasStr = Array.isArray(p.tallas) ? p.tallas.join(", ") : p.tallas;
    return `
      <tr>
        <td style="width: 50px;">
          <img src="${p.imagen_url}" class="table-img" alt="${p.nombre}" />
        </td>
        <td class="prod-detail-cell">
          <div class="prod-mobile-name">${p.nombre}</div>
          <div class="prod-mobile-meta">
            <span class="badge-tag">${p.marca}</span>
            <span class="prod-mobile-price">${p.precio} Bs.</span>
            <span>Tallas: ${tallasStr}</span>
          </div>
        </td>
        <td style="text-align: right; width: 60px;">
          <button class="btn-icon-danger" onclick="deleteProduct('${p.id}')" title="Eliminar del Catálogo">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Subida de imagen
window.handleImagePreview = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImageDataUrl = e.target.result;
    document.getElementById("imagePreview").src = selectedImageDataUrl;
    document.getElementById("previewContainer").style.display = "inline-block";
  };
  reader.readAsDataURL(file);
};

window.handleUrlImagePreview = function(url) {
  if (url.trim().startsWith("http")) {
    selectedImageDataUrl = url.trim();
    document.getElementById("imagePreview").src = selectedImageDataUrl;
    document.getElementById("previewContainer").style.display = "inline-block";
  }
};

window.removeSelectedImage = function() {
  selectedImageDataUrl = "";
  document.getElementById("imagePreview").src = "";
  document.getElementById("previewContainer").style.display = "none";
  document.getElementById("pImageFile").value = "";
  document.getElementById("pImageUrl").value = "";
};

// ==========================================================================
// 6. COMPRAS, VENTAS Y PROVEEDORES
// ==========================================================================
window.calcPurchaseTotal = function() {
  const qty = Number(document.getElementById("purQty").value) || 0;
  const cost = Number(document.getElementById("purCost").value) || 0;
  document.getElementById("purchaseTotalPreview").textContent = `${(qty * cost).toLocaleString()} Bs.`;
};

window.handleSavePurchase = function(e) {
  e.preventDefault();
  const provider = dbProviders.find(p => p.id === document.getElementById("purProvider").value);
  const product = dbProducts.find(p => p.id === document.getElementById("purProduct").value);
  const qty = Number(document.getElementById("purQty").value);
  const cost = Number(document.getElementById("purCost").value);

  const purchase = {
    id: `COM-${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleDateString("es-BO"),
    provider: provider ? provider.name : "Proveedor",
    productName: product ? product.nombre : "Sneaker",
    invoice: document.getElementById("purInvoice").value || "S/N",
    qty: qty,
    total: qty * cost
  };

  dbPurchases.unshift(purchase);
  localStorage.setItem("shaday_admin_purchases", JSON.stringify(dbPurchases));

  alert("Compra de lote registrada.");
  closeModal("modalPurchase");
  renderAllViews();
};

function renderPurchasesTable() {
  const tbody = document.getElementById("purchasesTableBody");
  tbody.innerHTML = dbPurchases.length === 0 
    ? `<tr><td colspan="6" class="text-center" style="padding:16px; color:var(--admin-text-muted);">Sin compras registradas</td></tr>`
    : dbPurchases.map(p => `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${p.date}</td>
        <td>${p.provider}</td>
        <td><span class="badge-tag">${p.invoice}</span></td>
        <td>${p.qty} pares (${p.productName})</td>
        <td><strong>${p.total} Bs.</strong></td>
      </tr>
    `).join("");
}

window.updateSalePriceAuto = function() {
  const prod = dbProducts.find(p => p.id === document.getElementById("saleProduct").value);
  if (prod) document.getElementById("salePrice").value = prod.precio;
};

window.handleSaveSale = function(e) {
  e.preventDefault();
  const prod = dbProducts.find(p => p.id === document.getElementById("saleProduct").value);
  const sale = {
    id: `VTA-${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleDateString("es-BO"),
    customer: document.getElementById("saleCustomer").value.trim(),
    productName: prod ? prod.nombre : "Sneaker",
    size: document.getElementById("saleSize").value,
    method: document.getElementById("saleMethod").value,
    price: Number(document.getElementById("salePrice").value)
  };

  dbSales.unshift(sale);
  localStorage.setItem("shaday_admin_sales", JSON.stringify(dbSales));

  alert("Venta registrada exitosamente.");
  closeModal("modalSale");
  renderAllViews();
};

function renderSalesTable() {
  const tbody = document.getElementById("salesTableBody");
  tbody.innerHTML = dbSales.length === 0 
    ? `<tr><td colspan="6" class="text-center" style="padding:16px; color:var(--admin-text-muted);">Sin ventas registradas</td></tr>`
    : dbSales.map(s => `
      <tr>
        <td>${s.date}</td>
        <td><strong>${s.customer}</strong></td>
        <td>${s.productName}</td>
        <td>Talla ${s.size}</td>
        <td><span class="badge-tag badge-success">${s.method}</span></td>
        <td><strong>${s.price} Bs.</strong></td>
      </tr>
    `).join("");
}

function renderProvidersGrid() {
  document.getElementById("providersGrid").innerHTML = dbProviders.map(prov => `
    <div class="provider-card">
      <h4><i class="fa-solid fa-building"></i> ${prov.name}</h4>
      <p><i class="fa-brands fa-whatsapp"></i> ${prov.phone}</p>
      <p><i class="fa-solid fa-location-dot"></i> ${prov.city}</p>
      <p><i class="fa-solid fa-tags"></i> ${prov.brands}</p>
    </div>
  `).join("");
}

window.handleSaveProvider = function(e) {
  e.preventDefault();
  dbProviders.push({
    id: `prov-${Date.now().toString().slice(-4)}`,
    name: document.getElementById("provName").value.trim(),
    phone: document.getElementById("provPhone").value.trim(),
    city: document.getElementById("provCity").value.trim(),
    brands: document.getElementById("provBrands").value.trim() || "Variadas"
  });
  localStorage.setItem("shaday_admin_providers", JSON.stringify(dbProviders));
  alert("Proveedor registrado.");
  closeModal("modalProvider");
  renderAllViews();
};

// ==========================================================================
// 7. NAVEGACIÓN Y DASHBOARD
// ==========================================================================
window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("sidebarMobileOverlay");
  sidebar.classList.toggle("mobile-open");
  overlay.classList.toggle("active");
};

function setupNavigation() {
  const navItems = document.querySelectorAll(".admin-sidebar .nav-item");
  const panes = document.querySelectorAll(".tab-pane");
  const pageTitle = document.getElementById("pageTitle");

  const titles = {
    dashboard: "Resumen General",
    productos: "Catálogo de Productos",
    compras: "Ingreso de Compras",
    ventas: "Ventas Realizadas",
    proveedores: "Directorio de Proveedores",
    usuarios: "Personal & Vendedores"
  };

  navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      navItems.forEach(b => b.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`pane-${tab}`).classList.add("active");
      pageTitle.textContent = titles[tab];

      if (window.innerWidth <= 768) {
        toggleMobileSidebar();
      }
    });
  });

  document.getElementById("productSearchInput").addEventListener("input", (e) => {
    renderProductsTable(e.target.value.trim().toLowerCase());
  });
}

function renderAllViews() {
  renderDashboardKPIs();
  renderProductsTable();
  renderPurchasesTable();
  renderSalesTable();
  renderProvidersGrid();
  renderUsersTable();
  populateDropdowns();
}

function renderDashboardKPIs() {
  document.getElementById("kpiTotalProducts").textContent = dbProducts.length;
  document.getElementById("kpiLowStock").textContent = dbProducts.filter(p => p.tallas.length <= 2).length;
  const totalSales = dbSales.reduce((acc, s) => acc + Number(s.price), 0);
  document.getElementById("kpiTotalSales").textContent = `${totalSales.toLocaleString()} Bs.`;
  const totalPurchases = dbPurchases.reduce((acc, p) => acc + Number(p.total), 0);
  document.getElementById("kpiTotalPurchases").textContent = `${totalPurchases.toLocaleString()} Bs.`;

  const dashSalesList = document.getElementById("dashSalesList");
  dashSalesList.innerHTML = dbSales.length === 0 
    ? `<tr><td colspan="4" class="text-center" style="padding:16px; color:var(--admin-text-muted);">Sin ventas registradas</td></tr>`
    : dbSales.slice(-5).reverse().map(s => `
      <tr>
        <td>${s.date}</td>
        <td><strong>${s.productName}</strong></td>
        <td>Talla ${s.size}</td>
        <td><strong style="color:var(--admin-accent);">${s.price} Bs.</strong></td>
      </tr>
    `).join("");

  document.getElementById("dashStockList").innerHTML = dbProducts.slice(0, 5).map(p => `
    <tr>
      <td><strong>${p.nombre}</strong></td>
      <td>${p.marca}</td>
      <td>${p.tallas.length} tallas</td>
      <td><span class="badge-tag ${p.tallas.length <= 2 ? 'badge-danger' : 'badge-success'}">${p.tallas.length <= 2 ? 'Stock Crítico' : 'Disponible'}</span></td>
    </tr>
  `).join("");
}

function populateDropdowns() {
  document.getElementById("purProvider").innerHTML = dbProviders.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
  const opts = dbProducts.map(p => `<option value="${p.id}">${p.nombre} - ${p.precio} Bs.</option>`).join("");
  document.getElementById("purProduct").innerHTML = opts;
  document.getElementById("saleProduct").innerHTML = opts;
  updateSalePriceAuto();
}

window.openNewProductModal = () => document.getElementById("modalProduct").classList.add("active");
window.openNewPurchaseModal = () => { populateDropdowns(); document.getElementById("modalPurchase").classList.add("active"); };
window.openNewSaleModal = () => { populateDropdowns(); document.getElementById("modalSale").classList.add("active"); };
window.openNewProviderModal = () => document.getElementById("modalProvider").classList.add("active");
window.openNewUserModal = () => document.getElementById("modalUser").classList.add("active");
window.closeModal = (id) => document.getElementById(id).classList.remove("active");

window.logoutAdmin = async () => {
  if (confirm("¿Cerrar sesión del panel administrativo?")) {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("shaday_current_user");
    window.location.href = "index.html";
  }
};