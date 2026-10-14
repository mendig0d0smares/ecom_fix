let resposta = document.getElementById('resposta')
let btn_login = document.getElementById('btn_login')

btn_login.addEventListener('click', (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, senha: senha })
    })
    .then(res => res.json().then(dados => ({ ok: res.ok, dados })))
    .then(({ ok, dados }) => {
        resposta.innerHTML = `<p>${dados.message}</p>`

        if (ok) {
            // token com validade de 1,5 horas (90 minutos)
            sessionStorage.setItem('token', dados.token)
            sessionStorage.setItem('usuario', JSON.stringify(dados.usuario))
            document.querySelector('form').reset()
        }
    })
    .catch((err) => {
        console.error('Erro ao realizar o login', err)
        resposta.innerHTML = '<p>Erro ao tentar realizar o login.</p>'
    })
})
