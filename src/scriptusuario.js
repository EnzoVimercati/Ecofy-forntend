import { api } from '../services/api.js';
let codusuario = null;

const Btndropdown = document.getElementById('Btndropdown');

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
}


window.onload = () => {
    const usuario = localStorage.getItem("usuario");
    
    if (usuario) {
        getFornecedorCodfor(usuario);
    }
    
    setTimeout(() => {
        document.getElementById('main').style.display = 'block';
        console.log("Página carregada com sucesso");
    }, 1000);

    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        console.log("Tela de loading ocultada");
    }, 1000);
};

async function getFornecedorCodfor(usuario) {
    try {
        const response = await api.get('cadastroemail/' + usuario);
        const userData = response.data[0];
        
        if (!userData) {
            alert('Usuário não encontrado');
            return;
        }
        
        document.getElementById('nome-perfil').textContent = userData.cad_nome;
        document.getElementById('função-perfil').textContent = userData.cad_funcao;
        document.getElementById('bemvindo').textContent = `Olá, ${userData.cad_nome.split(' ')[0]}!`;

        const infoList = document.querySelector('#Infor-pessoais ul');
        infoList.innerHTML = `
            <li><img src="/assets/star_filled.svg" alt="" class="icones-painel">Id funcionário(a): ${userData.cad_id}</li>
            <li><img src="/assets/call_end.svg" alt="" class="icones-painel">${userData.cad_telefone}</li>
            <li><img src="/assets/mail.svg" alt="" class="icones-painel">${userData.cad_email}</li>
            <li><img src="/assets/location_on.svg" alt="" class="icones-painel">${userData.cad_endereco}</li>
        `;

        codusuario = userData.cad_id;

        if (userData.cad_foto_perfil) {
            document.getElementById('Iconegrande').src = userData.cad_foto_perfil;
            document.getElementById('perfil').src = userData.cad_foto_perfil;
        }

        getDescartesCodfor(userData.cad_id);

    } catch (error) {
        console.error('Erro ao buscar dados do fornecedor:', error);
        alert('Erro ao buscar dados do usuário');
    }
}

async function getDescartesCodfor(cad_id) {
    try {
        const descartesResponse = await api.get(`lixo/lixid/${cad_id}`);
        const descartes = descartesResponse.data;

        descartes.sort((a, b) => new Date(b.lid_data) - new Date(a.lid_data));

        const tabelaDescartes = document.querySelector('#parteinferiorpainel table');
        
        let tabelaHTML = `
            <tr><th>Descartes Recentes</th><th class="space">Data</th><th>Pontos</th></tr>
        `;

        let totalMoedas = 0;

        descartes.forEach(item => {
            const dataFormatada = item.lid_data
                ? new Date(item.lid_data).toLocaleString('pt-BR')
                : '-';

            tabelaHTML += `
                <tr>
                    <td>${item.lid_nome}</td>
                    <td class="space">${dataFormatada}</td>
                    <td>${item.lid_valor_moedas}</td>
                </tr>
            `;

            totalMoedas += Number(item.lid_valor_moedas) || 0;
        });

        tabelaDescartes.innerHTML = tabelaHTML;

        // Atualiza total de moedas
        document.getElementById('number-cosin').textContent = totalMoedas;

        console.log(`Total de moedas somadas: ${totalMoedas}`);
        
    } catch (error) {
        console.error('Erro ao buscar descartes:', error);
    }
}

document.addEventListener('keydown', async (event) => {
    if (event.key === ']') {
        try {
            await api.post('lixopost', {
                lid_nome: 'Placa mãe',
                lid_quantidade_descartada: 10,
                lid_valor_moedas: 50,
                lid_categoria: 'Pc',
                lid_peso: 5.0,
                lix_id: codusuario,
                cad_id: codusuario
            });
            console.log('Inserido: Placa mãe');
            window.location.reload();
        } catch (err) {
            console.error('Erro ao inserir Placa mãe:', err);
        }
    }

    if (event.key === '[') {
        try {
            await api.post('lixopost', {
                lid_nome: 'HD',
                lid_quantidade_descartada: 10,
                lid_valor_moedas: 50,
                lid_categoria: 'PC',
                lid_peso: 5.0,
                lix_id: codusuario,
                cad_id: codusuario
            });
            console.log('Inserido: HD');
            window.location.reload();
        } catch (err) {
            console.error('Erro ao inserir HD:', err);
        }
    }
});
