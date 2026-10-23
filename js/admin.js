
import { supabase } from './supabase.js';

const ADMIN_EMAIL = 'taniak_arina@hotmail.com';
const BUCKET = 'productos';

const $ = (selector) => document.querySelector(selector);

const form = $('#productForm');
const list = $('#productsList');
const message = $('#mensaje');
const saveButton = $('#saveBtn');

let products = [];

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function formatPrice(value) {
  return new Intl.NumberFormat('es-PY', {
    maximumFractionDigits: 0
  }).format(value) + ' Gs.';
}

async function verifyAdmin() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user ||
      data.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    await supabase.auth.signOut();
    location.replace('./login.html');
    return false;
  }

  return true;
}

function resetForm() {
  form.reset();
  $('#productId').value = '';
  $('#categoria').value = 'Rollers';
  $('#publicado').checked = true;
  $('#formTitle').textContent = 'Agregar producto';
  saveButton.textContent = 'Guardar producto';
  $('#cancelBtn').hidden = true;
  $('#imagenUrl').value = '';
}

function editProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  $('#productId').value = product.id;
  $('#nombre').value = product.nombre;
  $('#descripcion').value = product.descripcion || '';
  $('#precio').value = product.precio;
  $('#categoria').value = product.categoria || 'Rollers';
  $('#imagenUrl').value = product.imagen_url || '';
  $('#imagen').value = '';
  $('#publicado').checked = product.publicado;

  $('#formTitle').textContent = 'Editar producto';
  saveButton.textContent = 'Guardar cambios';
  $('#cancelBtn').hidden = false;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadProducts() {
  list.textContent = 'Cargando productos...';

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    list.textContent = 'No se pudieron cargar los productos: ' +
      error.message;
    return;
  }

  products = data || [];
  renderProducts();
}

function renderProducts() {
  const query = $('#filtro').value.trim().toLowerCase();

  const filtered = products.filter(product =>
    `${product.nombre} ${product.categoria || ''}`
      .toLowerCase().includes(query)
  );

  if (!filtered.length) {
    list.textContent = products.length
      ? 'No hay productos que coincidan con la búsqueda.'
      : 'Todavía no hay productos registrados.';
    return;
  }

  list.innerHTML = filtered.map(product => {
    const image = product.imagen_url
      ? `<img src="${escapeHTML(product.imagen_url)}"
          alt="${escapeHTML(product.nombre)}">`
      : '<div style="width:100px;height:100px;background:#eee;border-radius:10px"></div>';

    return `
      <article class="product">
        ${image}
        <div>
          <h3>${escapeHTML(product.nombre)}</h3>
          <p class="price">${formatPrice(product.precio)}</p>
          <p class="muted">${escapeHTML(product.categoria || 'Sin categoría')}</p>
          <p class="status">
            ${product.publicado ? 'Publicado' : 'Oculto del catálogo'}
          </p>
          <div class="actions">
            <button type="button" class="secondary"
              data-action="edit" data-id="${product.id}">
              Editar
            </button>
            <button type="button" class="neutral"
              data-action="toggle" data-id="${product.id}">
              ${product.publicado ? 'Despublicar' : 'Publicar'}
            </button>
            <button type="button" class="danger"
              data-action="delete" data-id="${product.id}">
              Eliminar
            </button>
          </div>
        </div>
      </article>`;
  }).join('');
}

async function uploadImage(file) {
  if (!file) return null;

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('La imagen debe ser JPG, PNG o WebP.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('La imagen no puede superar los 5 MB.');
  }

  const extension = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  }[file.type];

  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  saveButton.disabled = true;
  message.textContent = 'Guardando producto...';

  try {
    if (!(await verifyAdmin())) return;

    const id = $('#productId').value;
    const name = $('#nombre').value.trim();
    const price = Number($('#precio').value);
    const file = $('#imagen').files[0];

    if (!name) throw new Error('Ingresá el nombre del producto.');

    if (!Number.isSafeInteger(price) || price < 0) {
      throw new Error('Ingresá un precio entero válido en guaraníes.');
    }

    let imageUrl = $('#imagenUrl').value.trim();

    if (file) {
      imageUrl = await uploadImage(file);
    }

    const product = {
      nombre: name,
      descripcion: $('#descripcion').value.trim(),
      precio: price,
      categoria: $('#categoria').value.trim() || 'Rollers',
      imagen_url: imageUrl,
      publicado: $('#publicado').checked
    };

    const result = id
      ? await supabase.from('productos')
          .update(product).eq('id', Number(id))
      : await supabase.from('productos').insert(product);

    if (result.error) throw result.error;

    message.textContent = id
      ? 'Producto actualizado correctamente.'
      : 'Producto creado correctamente.';

    resetForm();
    await loadProducts();

  } catch (error) {
    message.textContent = 'No se pudo guardar: ' + error.message;
  } finally {
    saveButton.disabled = false;
  }
});

list.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const id = Number(button.dataset.id);
  const product = products.find(item => item.id === id);
  if (!product) return;

  try {
    button.disabled = true;

    if (!(await verifyAdmin())) return;

    if (button.dataset.action === 'edit') {
      editProduct(id);
      return;
    }

    if (button.dataset.action === 'toggle') {
      const { error } = await supabase
        .from('productos')
        .update({ publicado: !product.publicado })
        .eq('id', id);

      if (error) throw error;

      message.textContent = product.publicado
        ? 'Producto retirado del catálogo.'
        : 'Producto publicado en el catálogo.';

      await loadProducts();
    }

    if (button.dataset.action === 'delete') {
      if (!confirm(`¿Eliminar definitivamente "${product.nombre}"?`)) {
        return;
      }

      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      message.textContent = 'Producto eliminado.';
      await loadProducts();
    }
  } catch (error) {
    message.textContent = 'Error: ' + error.message;
  } finally {
    button.disabled = false;
  }
});

$('#cancelBtn').addEventListener('click', resetForm);
$('#filtro').addEventListener('input', renderProducts);

$('#logout').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    message.textContent = 'No se pudo cerrar sesión: ' + error.message;
    return;
  }

  location.replace('./login.html');
});

if (await verifyAdmin()) {
  await loadProducts();
}
