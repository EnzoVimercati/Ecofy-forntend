import { api } from '../services/api.js';



const inpemail = document.getElementById('email');
const BtnLogin = document.getElementById('BtnLogin');
const password = document.getElementById('password');
let cod;


const swalCustom = Swal.mixin({
    customClass: {
        container: 'swal-container',
        popup: 'swal-popup',
        header: 'swal-header',
        title: 'swal-title',
        closeButton: 'swal-close',
        icon: 'swal-icon',
        content: 'swal-content',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
    },
    buttonsStyling: false,
    iconHtml: '<img src="/assets/robo-triste.svg" style="width: 80px;">'
});

async function getFornecedorCodfor(cad_email) {
    try {
        const response = await api.get('cadastroemail/' + cad_email);
        const userData = response.data[0];
        
        if (!userData) {
            alert('Usuário não encontrado');
            return;
        }

      console.log(userData);
          if (password.value === userData.cad_senha) {
             localStorage.setItem("usuario", userData.cad_email);
        window.location.href = '../html/PaginaDoUsuario.html';
    } else {
        swalCustom.fire({
        icon: "question",
        title: "Oops...",
        text: "Senha incorreta!",
    });
    }
    } catch (error) {
     swalCustom.fire({
        icon: "question",
        title: "Oops...",
        text: "Usuário não encontrado!",
    });
    }
}


BtnLogin.onclick = async () => {
    cod = email.value;
   getFornecedorCodfor(cod);
    Verificarsenha();
}




document.getElementById('btnVoltarMenu').onclick = () => {
    window.location.href = '../index.html';
};


