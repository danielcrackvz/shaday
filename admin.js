/**
 * ==========================================================================
 * SNEAKERS SHADAY - LÓGICA DEL PANEL ADMINISTRATIVO (30 PRODUCTOS & RESPONSIVE)
 * ==========================================================================
 */

// 1. Verificación de sesión segura
let sessionUser = JSON.parse(localStorage.getItem("shaday_current_user"));
if (!sessionUser || (sessionUser.rol !== "admin" && sessionUser.rol !== "vendedor")) {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("adminAuthLock").style.display = "flex";
    document.getElementById("adminMainLayout").style.display = "none";
  });
}

// 2. Estado Global sincronizado con la tienda
let dbProducts = [];
let dbPurchases = JSON.parse(localStorage.getItem("shaday_admin_purchases")) || [];
let dbSales = JSON.parse(localStorage.getItem("shaday_admin_sales")) || [];
let dbProviders = JSON.parse(localStorage.getItem("shaday_admin_providers")) || [
  { id: "prov-1", name: "Importaciones Falabella Chile", phone: "+56 9 8492 1102", city: "Santiago / Iquique", brands: "Nike, Jordan, Adidas" },
  { id: "prov-2", name: "Mayorista Kicks Miami", phone: "+1 305 782 9912", city: "Miami - USA", brands: "Jordan Retro, Yeezy" },
  { id: "prov-3", name: "Distribuidora Streetwear Santa Cruz", phone: "+591 75589123", city: "Santa Cruz de la Sierra", brands: "Vans, Converse, Puma" }
];

let dbUsers = JSON.parse(localStorage.getItem("shaday_users_list")) || [
  { id: "usr-admin-1", nombre: "Dueño de Tienda (Admin)", email: "admin@shaday.com", rol: "admin", fecha: "01/10/2026" },
  { id: "usr-vend-1", nombre: "Jhasmani Vendedor", email: "jhasmani@shaday.com", rol: "vendedor", fecha: "02/10/2026" }
];

let selectedImageDataUrl = "";

document.addEventListener("DOMContentLoaded", () => {
  if (sessionUser && (sessionUser.rol === "admin" || sessionUser.rol === "vendedor")) {
    document.getElementById("adminUserName").textContent = sessionUser.nombre;
    document.getElementById("adminUserRole").textContent = sessionUser.rol === "admin" ? "Dueño de Tienda (Admin)" : "Vendedor";
    
    loadProductsDatabase();
    setupNavigation();
    renderAllViews();
  }
});

// Carga los 30 productos garantizados
function loadProductsDatabase() {
  const stored = JSON.parse(localStorage.getItem("shaday_admin_products"));
  if (stored && stored.length > 0) {
    dbProducts = stored;
  } else {
    // Si no estaban inicializados, se rescatan del array oficial
    dbProducts = (typeof OFFICIAL_30_SNEAKERS !== 'undefined') ? [...OFFICIAL_30_SNEAKERS] : [];
    localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
  }
}

function saveProductsToStorage() {
  localStorage.setItem("shaday_admin_products", JSON.stringify(dbProducts));
}

// Menú Móvil
window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("sidebarMobileOverlay");
  sidebar.classList.toggle("mobile-open");
  overlay.classList.toggle("active");
};

// Navegación entre pestañas
function setupNavigation() {
  const navItems = document.querySelectorAll(".admin-sidebar .nav-item");
  const panes = document.querySelectorAll(".tab-pane");
  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");

  const titles = {
    dashboard: { title: "Resumen General", sub: "Métricas y control de stock de Sneakers Shaday" },
    productos: { title: "Catálogo de Productos", sub: "Inventario de calzados, tallas y precios" },
    compras: { title: "Ingreso de Compras", sub: "Control de compras por lotes a distribuidores" },
    ventas: { title: "Ventas Realizadas", sub: "Historial de pedidos cobrados por QR y efectivo" },
    proveedores: { title: "Directorio de Proveedores", sub: "Importadores mayoristas de calzado urbano" },
    usuarios: { title: "Personal & Vendedores", sub: "Gestión de cuentas y roles de la tienda" }
  };

  navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      navItems.forEach(b => b.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`pane-${tab}`).classList.add("active");

      pageTitle.textContent = titles[tab].title;
      pageSubtitle.textContent = titles[tab].sub;

      // Cierra el sidebar en celular al seleccionar una opción
      if (window.innerWidth <= 900) {
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

  document.getElementById("dashStockList").innerHTML = dbProducts.slice(0, 6).map(p => `
    <tr>
      <td><strong>${p.nombre}</strong></td>
      <td>${p.marca}</td>
      <td>${p.tallas.length} tallas</td>
      <td><span class="badge-tag ${p.tallas.length <= 2 ? 'badge-danger' : 'badge-success'}">${p.tallas.length <= 2 ? 'Stock Crítico' : 'Disponible'}</span></td>
    </tr>
  `).join("");
}

function renderProductsTable(query = "") {
  const tbody = document.getElementById("productsTableBody");
  const filtered = dbProducts.filter(p => p.nombre.toLowerCase().includes(query) || p.marca.toLowerCase().includes(query));
  
  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td><img src="${p.imagen_url}" class="table-img" /></td>
      <td><strong>${p.nombre}</strong></td>
      <td><span class="badge-tag">${p.marca}</span></td>
      <td><strong>${p.precio} Bs.</strong></td>
      <td>${p.tallas.map(t => `<span class="badge-tag" style="margin-right:2px;">${t}</span>`).join("")}</td>
      <td><span class="badge-tag badge-success">${p.badge || 'Stock'}</span></td>
      <td>
        <button class="btn-icon-danger" onclick="deleteProduct('${p.id}')" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
      </td>
    </tr>
  `).join("");
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

window.handleSaveProduct = function(e) {
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
    descripcion: document.getElementById("pDesc").value.trim() || "Calzado urbano de alta durabilidad."
  };

  dbProducts.unshift(newSneaker);
  saveProductsToStorage();
  
  alert(`¡${newSneaker.nombre} guardado! Ya se visualiza en la tienda pública.`);
  closeModal("modalProduct");
  document.getElementById("productForm").reset();
  removeSelectedImage();
  renderAllViews();
};

window.deleteProduct = function(id) {
  if (confirm("¿Deseas eliminar este modelo del catálogo?")) {
    dbProducts = dbProducts.filter(p => p.id !== id);
    saveProductsToStorage();
    renderAllViews();
  }
};

// Compras
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
  
  alert("Compra registrada correctamente e ingresada al balance.");
  closeModal("modalPurchase");
  renderAllViews();
};

function renderPurchasesTable() {
  const tbody = document.getElementById("purchasesTableBody");
  tbody.innerHTML = dbPurchases.length === 0 
    ? `<tr><td colspan="7" class="text-center" style="padding:20px; color:var(--admin-text-muted);">Sin compras registradas</td></tr>`
    : dbPurchases.map(p => `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${p.date}</td>
        <td>${p.provider}</td>
        <td><span class="badge-tag">${p.invoice}</span></td>
        <td>${p.qty} pares (${p.productName})</td>
        <td><strong>${p.total} Bs.</strong></td>
        <td><span class="badge-tag badge-success">Ingresado</span></td>
      </tr>
    `).join("");
}

// Ventas
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
  
  alert("Venta registrada con éxito.");
  closeModal("modalSale");
  renderAllViews();
};

function renderSalesTable() {
  const tbody = document.getElementById("salesTableBody");
  tbody.innerHTML = dbSales.length === 0
    ? `<tr><td colspan="6" class="text-center" style="padding:20px; color:var(--admin-text-muted);">Sin ventas registradas</td></tr>`
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

// Proveedores
function renderProvidersGrid() {
  document.getElementById("providersGrid").innerHTML = dbProviders.map(prov => `
    <div class="provider-card">
      <h4><i class="fa-solid fa-building"></i> ${prov.name}</h4>
      <p><i class="fa-brands fa-whatsapp"></i> <strong>Contacto:</strong> ${prov.phone}</p>
      <p><i class="fa-solid fa-location-dot"></i> <strong>Origen:</strong> ${prov.city}</p>
      <p><i class="fa-solid fa-tags"></i> <strong>Marcas:</strong> ${prov.brands}</p>
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

// Usuarios
function renderUsersTable() {
  document.getElementById("usersTableBody").innerHTML = dbUsers.map((u, idx) => `
    <tr>
      <td><strong>${u.nombre}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge-tag ${u.rol === 'admin' ? 'badge-danger' : 'badge-success'}">${u.rol.toUpperCase()}</span></td>
      <td>${u.fecha || 'Activo'}</td>
      <td><span class="badge-tag badge-success">Habilitado</span></td>
      <td>
        ${u.email !== "admin@shaday.com" ? `
          <button class="btn-icon-danger" onclick="deleteUser(${idx})" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
        ` : '<span style="font-size:0.75rem; color:var(--admin-text-muted);">Dueño Principal</span>'}
      </td>
    </tr>
  `).join("");
}

window.handleSaveUser = function(e) {
  e.preventDefault();
  const email = document.getElementById("uEmail").value.trim().toLowerCase();
  if (dbUsers.some(u => u.email === email)) return alert("El correo ya está registrado");

  dbUsers.push({
    id: `usr-${Date.now().toString().slice(-4)}`,
    nombre: document.getElementById("uName").value.trim(),
    email: email,
    rol: document.getElementById("uRole").value,
    password: document.getElementById("uPassword").value,
    fecha: new Date().toLocaleDateString("es-BO")
  });

  localStorage.setItem("shaday_users_list", JSON.stringify(dbUsers));
  alert("Usuario creado con éxito.");
  closeModal("modalUser");
  renderUsersTable();
};

window.deleteUser = function(idx) {
  if (confirm("¿Revocar acceso a este usuario?")) {
    dbUsers.splice(idx, 1);
    localStorage.setItem("shaday_users_list", JSON.stringify(dbUsers));
    renderUsersTable();
  }
};

function populateDropdowns() {
  document.getElementById("purProvider").innerHTML = dbProviders.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
  const opts = dbProducts.map(p => `<option value="${p.id}">${p.nombre} - ${p.precio} Bs.</option>`).join("");
  document.getElementById("purProduct").innerHTML = opts;
  document.getElementById("saleProduct").innerHTML = opts;
  updateSalePriceAuto();
}

// Modales
window.openNewProductModal = () => document.getElementById("modalProduct").classList.add("active");
window.openNewPurchaseModal = () => { populateDropdowns(); document.getElementById("modalPurchase").classList.add("active"); };
window.openNewSaleModal = () => { populateDropdowns(); document.getElementById("modalSale").classList.add("active"); };
window.openNewProviderModal = () => document.getElementById("modalProvider").classList.add("active");
window.openNewUserModal = () => document.getElementById("modalUser").classList.add("active");
window.closeModal = (id) => document.getElementById(id).classList.remove("active");

window.logoutAdmin = () => {
  if (confirm("¿Cerrar sesión del panel administrativo?")) {
    localStorage.removeItem("shaday_current_user");
    window.location.href = "index.html";
  }
};