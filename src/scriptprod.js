// Optional dropdown toggle handler — attach only if the element exists to avoid runtime errors
const Btndropdown = document.getElementById('Btndropdown');
if (Btndropdown) {
    Btndropdown.onclick = () => {
        const dropdown = Btndropdown.closest('.dropdown') || document.querySelector('.dropdown');
        if (!dropdown) return;

        const content = dropdown.querySelector('.dropdown-content');
        const isOpen = dropdown.classList.toggle('open');
        if (content) content.style.display = isOpen ? 'block' : 'none';
        const icon = dropdown.querySelector('.troca-imagem') || document.querySelector('.troca-imagem');
        if (icon) {
            if (icon.tagName === 'IMG') {
                if (!icon.dataset.orig) icon.dataset.orig = icon.getAttribute('src');
                const alt = icon.getAttribute('data-alt');
                if (alt) {
                    icon.src = isOpen ? alt : icon.dataset.orig;
                } else {
                    icon.classList.toggle('rotated', isOpen);
                }
            } else {
                icon.classList.toggle('active', isOpen);
            }
        }
    };
}


import { api } from '../services/api.js';
// Reescrito: tentar buscar TODOS os produtos e renderizar prod_nome / prod_preco
const ITEMS_GRID_ID = 'items-grid';
const PRIMARY_ENDPOINT = 'produtos';    // endpoint esperado que retorna array
const FALLBACK_ENDPOINT = 'produtoid';  // endpoint que pode retornar um único objeto

async function fetchAllProducts() {
    try {
        const resp = await api.get(PRIMARY_ENDPOINT);
        const data = resp.data;
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && typeof data === 'object') return [data];
    } catch (err) {
        console.debug('fetchAllProducts: primary /produtos failed, trying fallback', err);
    }

    try {
        const resp2 = await api.get(FALLBACK_ENDPOINT);
        const d2 = resp2.data;
        if (Array.isArray(d2)) return d2;
        if (d2 && typeof d2 === 'object') return [d2];
    } catch (err2) {
        console.error('fetchAllProducts: fallback /produtoid failed', err2);
    }

    return [];
}

function formatPrice(value) {
    const n = Number(value);
    if (isNaN(n)) return String(value || '');
    return n.toFixed(2);
}

async function fetchUserByEmail(email) {
    if (!email) return null;
    try {
        const resp = await api.get(`cadastroemail/${encodeURIComponent(email)}`);
        const data = resp.data;
        if (Array.isArray(data)) return data[0] || null;
        if (data && typeof data === 'object') return data;
        return null;
    } catch (err) {
        console.error('Erro ao buscar usuário por email:', err);
        return null;
    }
}

async function fetchDescartesSum(cad_id) {
    if (!cad_id) return 0;
    try {
        const resp = await api.get(`lixo/lixid/${cad_id}`);
        const arr = resp.data;
        if (!Array.isArray(arr)) return 0;
        return arr.reduce((s, it) => s + (Number(it.lid_valor_moedas) || 0), 0);
    } catch (err) {
        console.error('Erro ao buscar descartes do usuário:', err);
        return 0;
    }
}

function populateUserUI(userData, totalMoedas) {
    if (!userData) return;
    // greeting
    const bem = document.getElementById('bemvindo');
    if (bem) bem.textContent = `Olá, ${userData.cad_nome.split(' ')[0]}!`;

    // profile image (header)
    const perfilImg = document.getElementById('perfil');
    if (perfilImg && userData.cad_foto_perfil) perfilImg.src = userData.cad_foto_perfil;

    // pontos displayed in product page
    const pointsEl = document.getElementById('points');
    if (pointsEl) pointsEl.textContent = String(totalMoedas || 0);

    const numberCosin = document.getElementById('number-cosin');
    if (numberCosin) numberCosin.textContent = String(totalMoedas || 0);

    // store full user object for other pages if needed
    try { localStorage.setItem('usuario_data', JSON.stringify(userData)); } catch (e) { }
}

async function loadUserAndPopulate() {
    const email = localStorage.getItem('usuario');
    if (!email) return;
    const user = await fetchUserByEmail(email);
    if (!user) return;
    const total = await fetchDescartesSum(user.cad_id);
    populateUserUI(user, total);
}

function renderProductCard(prod) {
    const grid = document.getElementById(ITEMS_GRID_ID);
    if (!grid) {
        console.warn('#items-grid não encontrado');
        return;
    }

    // limpar antes de inserir (removido para não limpar o grid por card)

    const card = document.createElement('div');
    card.className = 'itensdiv';

    // Imagem (opcional)
    const img = document.createElement('img');
    img.className = 'itemicone';
    img.src = prod.prod_foto || '/assets/fotomell.svg';
    img.alt = prod.prod_nome || 'produto';

    // Preço
    const valor = document.createElement('div');
    valor.className = 'valor-info';
    valor.innerHTML = `<h1 class="itemdescr">${formatPrice(prod.prod_preco)}</h1>`;

    // Nome
    const produto = document.createElement('div');
    produto.className = 'produto-info';
    produto.innerHTML = `<h2 class="itemdescr2">${prod.prod_nome}</h2>`;

    // Botão resgatar (sem ação por enquanto)
    const resgat = document.createElement('div');
    resgat.className = 'div-resgat';
    const a = document.createElement('a');
    a.className = 'but-resgat';
    a.href = '#';
    a.textContent = 'RESGATAR PRÊMIO';
    resgat.appendChild(a);

    card.appendChild(img);
    card.appendChild(valor);
    card.appendChild(produto);
    card.appendChild(resgat);

    grid.appendChild(card);
}

async function init() {
    const loading = document.getElementById('loadingScreen');
    const main = document.getElementById('main');
    try {
        if (main) main.style.display = 'none';
        if (loading) loading.style.display = 'flex';

        const grid = document.getElementById(ITEMS_GRID_ID);
        if (grid) grid.innerHTML = '';

        await loadUserAndPopulate();

        const products = await fetchAllProducts();
        if (!products || products.length === 0) {
            console.warn('Nenhum produto retornado de /produtoid');
            return;
        }
        products.forEach(p => renderProductCard(p));
    } finally {
        if (loading) loading.style.display = 'none';
        if (main) main.style.display = 'block';
    }
}

init();

export { fetchAllProducts, renderProductCard };
