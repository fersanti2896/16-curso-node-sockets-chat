
const form = document.querySelector('form');

form.addEventListener('submit', event => {
    event.preventDefault();

    const formData = {};

    for(let el of form.elements) {
        if( el.name.length > 0 ) {
            formData[el.name] = el.value;
        }
    }

    fetch('http://localhost:5796/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify( formData )
    })
        .then( resp => resp.json() )
        .then( ({ msg, token }) => {
            if( msg ) {
                return console.log(msg);
            }

            localStorage.setItem( 'token', token );
            window.location = 'chat.html';
        } )
        .catch( err => {
            console.log(err);
        } )
});

function handleCredentialResponse(response) {
    /* Google Token: ID_TOKEN */
    //    console.log('id_token', response.credential);
    const body = { id_token: response.credential };

    fetch('http://localhost:5796/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify( body )
    })
        .then( resp => resp.json() )
        .then( ({ token, usuario }) => {
            // console.log(token);
            localStorage.setItem( 'email', usuario.email );
            localStorage.setItem( 'token', token );

            window.location = 'chat.html';
        } )
        .catch( console.warn )
}

const button = document.getElementById('google_signout');
button.onclick = () => {
    console.log( google.accounts.id )
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke( localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    } );
}