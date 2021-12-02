const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacion = document.querySelector('#paginacion')

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value
    
    if(terminoBusqueda === ""){
        mostrarAlerta('Porfavor ingresa un valor correcto')

        return;
    }

    buscarImagenes()
}

function mostrarAlerta(mensaje){
    
    const existeAlerta = document.querySelector('.bg-red-600')

    if(!existeAlerta){
        
        const alerta = document.createElement('p');

        alerta.classList.add('bg-red-600', 'border-red-400', 'text-white', 'px-4', 'py-3', 'rounded', 'mx-auto', 'mt-6',
        'text-center');

        alerta.innerHTML = `
        <strong class = "font-bold"> Error! </strong>
        <span class='block sm:inline'> ${mensaje} </span>
        `

        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);

        return;
    }

}

function buscarImagenes(){
    const termino = document.querySelector('#termino').value

    const key = '24619479-1d61de3319077435a05093d8a';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {

            totalPaginas = calcularPaginas(resultado.totalHits)
    
            mostrarImagenes(resultado.hits)
        })
}
 
function mostrarImagenes(imagenes){
   
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }

    imagenes.forEach(imagen => {
        
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
            <div class = "w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class = "bg-black">
                    <img class = 'w-full' src='${previewURL}'>

                    <div class = "p-4 text-white">
                        <p class='font-bold'> ${likes} <span class='font-light'> Me Gusta </span> </p>
                        <p class='font-bold'> ${views} <span class='font-light'> Vistas </span> </p>

                        <a class=" block bg-pink-600 text-white w-full font-bold text-center mt-5 p-1 rounded uppercase" href='${largeImageURL}' target='_blank' >
                        Ver Imagen
                        </a>
                    </div
                </div>
            </div>
        `
    });

    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild)
    }
    imprimirPaginador()
}

function calcularPaginas (total){
    return parseInt (Math.ceil( total / registrosPorPagina))
}

function *crearPaginador(total){
    for (let i = 1; i <= total; i++){
        yield i;
    }
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

   while(true){
        const {value,done} = iterador.next()
        if(done)return;

        const btn = document.createElement('a');
        btn.href = "#";
        btn.dataset.pagina = value;
        btn.textContent = value;
        btn.classList.add('siguiente', 'bg-gray-900', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4',
        'uppercase', 'rounded', 'text-white');

        btn.onclick = () =>{
            paginaActual = value;

            buscarImagenes()
        }

        paginacion.appendChild(btn)
   }
}