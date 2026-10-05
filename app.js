const DB_URL = 'data/product-site-master-v1.json';
const LAYOUT_URL = 'data/product-page-layout-revisions.json';
const POLICY_URL = 'data/project-runtime-policy-v2.json';

const state = {
  db: null,
  layout: null,
  policy: null,
  products: [],
  query: '',
  filter: 'all'
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>'\"]/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '\"': '&quot;'
}[char]));

const STATUS_LABELS = {
  confirmed: 'تأییدشده',
  current_site_confirmed: 'تأییدشده',
  confirmed_from_user_file: 'تأییدشده از فایل مرجع',
  confirmed_separate_configuration: 'پیکربندی مستقل تأییدشده',
  confirmed_family_needs_final_page_mapping: 'هویت خانواده تأییدشده',
  confirmed_rotary_claim_pending: 'هویت تأییدشده؛ جزئیات روتاری در بررسی',
  source_file_confirmed_with_accuracy_wording_conflict: 'مشخصات منبع ثبت شده؛ متن دقت نیازمند بازبینی',
  ready_for_review: 'آماده بررسی',
  review: 'نیازمند بررسی',
  pending: 'در انتظار تکمیل',
  visual_reconstruction: 'بازسازی بصری',
  mapped_source_available: 'منبع ثبت‌شده موجود',
  partial: 'ناقص'
};

const SPEC_LABELS = {
  laser_power: 'توان لیزر',
  tube_diameter: 'قطر لوله',
  cut_thickness: 'ضخامت برش',
  tube_length: 'طول لوله',
  max_axis_speed: 'حداکثر سرعت محورها',
  acceleration: 'شتاب',
  total_power: 'توان کل',
  machine_dimensions: 'ابعاد دستگاه',
  installation_space: 'فضای نصب',
  power_supply: 'برق ورودی',
  controller: 'کنترلر'
};

function faStatus(status) {
  return STATUS_LABELS[status] || status || 'نامشخص';
}

function isPublicProduct(product) {
  if (!product || !product.model) return false;
  const identity = String(product.identity_status || '');
  if (!identity || identity.includes('pending') || identity.startsWith('separate_record')) return false;
  return true;
}

function productFamily(product) {
  const text = `${product.model || ''} ${product.configuration_fa || ''}`.toLowerCase();
  if (text.includes('qg-') || text.includes('لوله')) return 'tube';
  if (text.includes('3015')) return '3015';
  if (text.includes('6020')) return '6020';
  return 'other';
}

function familyLabel(key) {
  return ({ all: 'همه', '3015': 'سری 3015', '6020': 'سری 6020', tube: 'لوله‌بر', other: 'سایر' })[key] || key;
}

function safeLocalPath(value) {
  if (!value || typeof value !== 'string') return null;
  const path = value.trim();
  if (!path || /^(https?:|\/\/|data:|javascript:)/i.test(path)) return null;
  if (path.includes('..')) return null;
  return path;
}

function localAssetList(value) {
  return Array.isArray(value) ? value.map(safeLocalPath).filter(Boolean) : [];
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`خواندن ${url} ناموفق بود (${response.status}).`);
  return response.json();
}

async function loadData() {
  const [db, layout, policy] = await Promise.all([
    fetchJson(DB_URL),
    fetchJson(LAYOUT_URL),
    fetchJson(POLICY_URL)
  ]);

  state.db = db;
  state.layout = layout;
  state.policy = policy;
  state.products = Object.entries(db.products || {})
    .filter(([, product]) => isPublicProduct(product))
    .map(([id, product]) => ({ id, ...product }))
    .sort((a, b) => a.id.localeCompare(b.id));

  renderCatalogControls();
  renderProducts();
  renderDebug();
  route();
}

function renderCatalogControls() {
  const families = ['all', ...new Set(state.products.map(productFamily))];
  $('#product-filters').innerHTML = families.map(key => `
    <button type="button" class="filter-button${key === state.filter ? ' active' : ''}" data-filter="${esc(key)}">
      ${esc(familyLabel(key))}
    </button>`).join('');

  $('#hero-product-count').textContent = String(state.products.length);
  $('#product-count').textContent = `${state.products.length} محصول در کاتالوگ فعلی`;
}

function cardVisual(product) {
  const family = productFamily(product);
  const short = family === 'tube' ? 'TUBE' : (product.model || 'LASER');
  return `
    <div class="product-visual product-visual-${esc(family)}" aria-hidden="true">
      <span>${esc(short)}</span>
    </div>`;
}

function renderProducts() {
  const query = state.query.trim().toLowerCase();
  const filtered = state.products.filter(product => {
    if (state.filter !== 'all' && productFamily(product) !== state.filter) return false;
    if (!query) return true;
    const haystack = [product.id, product.model, product.configuration_fa, product.title?.fa]
      .filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(query);
  });

  $('#catalog-empty').hidden = filtered.length > 0;
  $('#product-grid').innerHTML = filtered.map(product => `
    <article class="product-card">
      ${cardVisual(product)}
      <div class="product-card-body">
        <span class="eyebrow">${esc(product.model || product.id)}</span>
        <h3>${esc(product.title?.fa || product.configuration_fa || product.id)}</h3>
        <p>${esc(product.configuration_fa || '')}</p>
        <a class="product-link" href="#product=${encodeURIComponent(product.id)}">مشاهده جزئیات <span aria-hidden="true">←</span></a>
      </div>
    </article>`).join('');
}

function renderVerifiedSpecs(product) {
  const specs = product.verified_specs && typeof product.verified_specs === 'object'
    ? Object.entries(product.verified_specs).filter(([, value]) => value !== null && value !== '')
    : [];

  const baseRows = [
    ['مدل', product.model],
    ['پیکربندی', product.configuration_fa]
  ].filter(([, value]) => value);

  const rows = [...baseRows, ...specs.map(([key, value]) => [SPEC_LABELS[key] || key, value])];

  return rows.map(([label, value]) => `
    <div class="spec-row">
      <span>${esc(label)}</span>
      <strong>${esc(value)}</strong>
    </div>`).join('');
}

function viewer360(product) {
  const frames = localAssetList(product.assets?.view_360?.frames);
  if (frames.length < 2) {
    return `
      <div class="asset-placeholder asset-placeholder-main">
        <div class="placeholder-icon" aria-hidden="true">360°</div>
        <strong>نمای 360 درجه</strong>
        <p>جای این بخش آماده است؛ فریم‌ها بعد از تطبیق قطعی با همین محصول فعال می‌شوند.</p>
      </div>`;
  }

  return `
    <div class="viewer-360" data-frames='${esc(JSON.stringify(frames))}'>
      <img src="${esc(frames[0])}" alt="نمای 360 درجه ${esc(product.title?.fa || product.model || '')}" draggable="false">
      <div class="viewer-hint">برای چرخاندن، بکشید</div>
    </div>`;
}

function assetSection({ id, title, description, kind, asset }) {
  const file = safeLocalPath(asset?.file || asset?.src || asset?.url);
  const status = asset?.status || 'pending';
  let body = '';

  if (file && kind === 'image') {
    body = `<img class="large-asset-image" src="${esc(file)}" alt="${esc(title)}" loading="lazy" decoding="async">`;
  } else if (file && kind === 'model') {
    body = `<div class="model-file-ready"><strong>فایل سه‌بعدی ثبت شده است</strong><p>رابط تعاملی مدل پس از اتصال Loader محلی فعال می‌شود.</p></div>`;
  } else {
    body = `
      <div class="asset-placeholder">
        <div class="placeholder-icon" aria-hidden="true">${kind === 'model' ? '3D' : '＋'}</div>
        <strong>این بخش آماده اتصال فایل است</strong>
        <p>${esc(description)}</p>
      </div>`;
  }

  return `
    <section class="detail-section" id="${esc(id)}">
      <div class="detail-section-head">
        <div>
          <span class="eyebrow">PRODUCT ASSET</span>
          <h3>${esc(title)}</h3>
        </div>
        <span class="asset-state">${status === 'pending' ? 'در حال تکمیل' : esc(faStatus(status))}</span>
      </div>
      ${body}
    </section>`;
}

function sampleWorksSection(product) {
  const items = localAssetList(product.media?.sample_works || product.assets?.sample_works?.files);
  const body = items.length
    ? `<div class="works-grid">${items.map(src => `<img src="${esc(src)}" alt="نمونه کار ${esc(product.model || '')}" loading="lazy" decoding="async">`).join('')}</div>`
    : `<div class="asset-placeholder"><div class="placeholder-icon" aria-hidden="true">✓</div><strong>نمونه‌کار تأییدشده هنوز متصل نشده است</strong><p>این بخش جایگزین گالری تکراری است و فقط تصاویر واقعی و تأییدشده را نمایش می‌دهد.</p></div>`;

  return `
    <section class="detail-section" id="sample-works">
      <div class="detail-section-head"><div><span class="eyebrow">REAL WORK</span><h3>نمونه‌کارهای این دستگاه</h3></div></div>
      ${body}
    </section>`;
}

function renderDetail(id) {
  const product = state.products.find(item => item.id === id);
  if (!product) {
    $('#detail-root').innerHTML = '<div class="error">این محصول در کاتالوگ قابل نمایش نیست.</div>';
    return;
  }

  document.title = `${product.title?.fa || product.model || id} | سهند لیزر`;
  const assets = product.assets || {};

  $('#detail-root').innerHTML = `
    <div class="detail-hero">
      <div class="visual-box">${viewer360(product)}</div>
      <aside class="info-box">
        <span class="eyebrow">${esc(product.id)} · ${esc(product.model || '')}</span>
        <h2>${esc(product.title?.fa || product.model || product.id)}</h2>
        <p class="product-subtitle">${esc(product.configuration_fa || '')}</p>
        <div class="spec-list">${renderVerifiedSpecs(product)}</div>
        ${!product.verified_specs ? '<p class="quiet-note">مشخصات فنی تکمیلی فقط پس از تأیید داده‌ها اضافه می‌شود.</p>' : ''}
      </aside>
    </div>

    <div class="detail-stack">
      ${assetSection({ id: 'technical-drawing', title: 'نقشه فنی و ابعادی', description: 'نقشه در اندازه بزرگ و مستقل نمایش داده خواهد شد.', kind: 'image', asset: assets.technical_drawing })}
      ${assetSection({ id: 'exploded-view', title: 'نمای انفجاری', description: 'نمای انفجاری پس از تأیید اجزا به همین محصول متصل می‌شود.', kind: 'image', asset: assets.exploded_view })}
      ${assetSection({ id: 'interactive-3d', title: 'مدل سه‌بعدی تعاملی', description: 'فقط مدل بصری مربوط به همین محصول نمایش داده می‌شود؛ مدل بصری معادل CAD ساخت نیست.', kind: 'model', asset: assets.three_d })}
      ${sampleWorksSection(product)}
    </div>`;

  init360Viewers();
}

function init360Viewers() {
  $$('.viewer-360').forEach(viewer => {
    if (viewer.dataset.ready === '1') return;
    let frames;
    try { frames = JSON.parse(viewer.dataset.frames || '[]'); } catch { frames = []; }
    if (frames.length < 2) return;

    const image = $('img', viewer);
    let frame = 0;
    let startX = 0;
    let startFrame = 0;
    let dragging = false;
    const sensitivity = 14;

    const setFrame = next => {
      frame = ((next % frames.length) + frames.length) % frames.length;
      image.src = frames[frame];
    };

    const pointerX = event => event.clientX;
    viewer.addEventListener('pointerdown', event => {
      dragging = true;
      startX = pointerX(event);
      startFrame = frame;
      viewer.setPointerCapture?.(event.pointerId);
      viewer.classList.add('dragging');
    });
    viewer.addEventListener('pointermove', event => {
      if (!dragging) return;
      const delta = pointerX(event) - startX;
      setFrame(startFrame - Math.round(delta / sensitivity));
    });
    const end = event => {
      if (!dragging) return;
      dragging = false;
      viewer.releasePointerCapture?.(event.pointerId);
      viewer.classList.remove('dragging');
    };
    viewer.addEventListener('pointerup', end);
    viewer.addEventListener('pointercancel', end);
    viewer.dataset.ready = '1';
  });
}

function renderDebug() {
  const params = new URLSearchParams(location.search);
  if (params.get('debug') !== '1') return;

  const panel = $('#debug-panel');
  panel.hidden = false;
  const all = Object.entries(state.db?.products || {});
  const pendingIdentity = all.filter(([, product]) => !isPublicProduct(product)).map(([id]) => id);
  const pending360 = state.products.filter(product => localAssetList(product.assets?.view_360?.frames).length < 2).map(product => product.id);
  const externalRuntimeMedia = state.products.filter(product => /^https?:/i.test(product.media?.main_image || '')).map(product => product.id);

  const report = {
    database: state.db?.source_master || null,
    public_products: state.products.length,
    hidden_until_identity_complete: pendingIdentity,
    products_without_local_360: pending360,
    legacy_external_media_ignored_at_runtime: externalRuntimeMedia,
    runtime_pipeline: state.policy?.active_pipeline || [],
    old_multi_agent_pipeline_enabled: Boolean(state.policy?.process_rules?.mandatory_multi_agent_pipeline)
  };

  $('#debug-output').textContent = JSON.stringify(report, null, 2);
}

function showCatalog() {
  $('#product-detail').hidden = true;
  document.title = 'سهند لیزر | تجهیزات لیزر صنعتی';
}

function route() {
  const hash = location.hash.replace(/^#/, '');
  if (hash.startsWith('product=')) {
    const id = decodeURIComponent(hash.slice('product='.length));
    $('#product-detail').hidden = false;
    renderDetail(id);
    requestAnimationFrame(() => $('#product-detail').scrollIntoView({ behavior: 'smooth', block: 'start' }));
  } else {
    showCatalog();
  }
}

$('#product-search').addEventListener('input', event => {
  state.query = event.target.value;
  renderProducts();
});

$('#product-filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  state.filter = button.dataset.filter || 'all';
  $$('.filter-button', $('#product-filters')).forEach(item => item.classList.toggle('active', item === button));
  renderProducts();
});

$('#back-to-products').addEventListener('click', () => {
  location.hash = 'products';
  requestAnimationFrame(() => $('#products').scrollIntoView({ behavior: 'smooth' }));
});

$('#menu-button').addEventListener('click', () => {
  const button = $('#menu-button');
  const nav = $('#main-nav');
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

$('#main-nav').addEventListener('click', event => {
  if (!event.target.closest('a')) return;
  $('#menu-button').setAttribute('aria-expanded', 'false');
  $('#main-nav').classList.remove('open');
});

window.addEventListener('hashchange', route);

loadData().catch(error => {
  console.error(error);
  $('#product-grid').innerHTML = `<div class="error">${esc(error.message)}</div>`;
  $('#product-count').textContent = 'خطا در خواندن دیتابیس';
  $('#hero-product-count').textContent = '—';
});
