const checkLocalStorage = () => { //Trae Datos del LocalStorage si existen
    productosLocalStorage = JSON.parse(localStorage.getItem('Carrito'));
    if(productosLocalStorage !== null){
        for(producto of productosLocalStorage){
            carrito.push(producto);
            actualizarCarrito(producto);
        }
    }
}
const generaHTMLproductos = () => {
    for( let producto of arrayProductos ){ //Creacion productos de forma dinamica
        divListaProductos.append(`
        <div class="card text-white bg-dark mb-3">
            <div class="card-body position-relative">
                <i class="fas fa-heart imgLike position-absolute"></i>
                <img src="${producto.foto}" class="card-img-top" alt="..." id="img-producto"> 
                <hr>
                <p class="card-text"><b id="nombre-producto">${producto.nombre}</b></p>
                <h4 class="card-text"><b id="modelo-producto">${producto.modelo}</b></h4>
                <p class="card-text">Precio: $<b id="precio-producto">${producto.precio}</b>.-</p>
                <p class="card-text">Stock Disponible: <b id="stock-producto">${producto.stock}</b> u.</p>
                <p class="card-text">COD P: <b id="cod-producto">${producto.cod}</b></p>
                <div class="d-flex justify-content-center align-items-center div-btn-comprar" id="btn-carrito">
                    <button type="button" class="btn d-flex justify-content-center align-items-center w-100 btn-z-index btn-agregar-carrito" ><img src="assets/icons/carrito.png" class="logo" alt=""><p class="p-btn">Añadir al Carrito</p></button>
                <div>
            </div>
        </div>
        `);
    };

}
const agregarCarrito = (productoSeleccionado) => {
    //Creo un nuevo objeto con los datos del contenedor del click del evento
    let producto = {
        cod: parseInt(productoSeleccionado.querySelector("#cod-producto").textContent),
        nombre: productoSeleccionado.querySelector("#nombre-producto").textContent,
        modelo: productoSeleccionado.querySelector("#modelo-producto").textContent,
        precio: parseInt(productoSeleccionado.querySelector("#precio-producto").textContent),
        foto: productoSeleccionado.querySelector("#img-producto").getAttribute("src"),
        stock: parseInt(productoSeleccionado.querySelector("#stock-producto").textContent),
    }
    carrito.push(producto);
    actualizarCarrito(producto); //actualiza HTML de carrito
    let carritoStorage = JSON.stringify(carrito);
    localStorage.setItem('Carrito', carritoStorage); // Envia al LS el carrito completo y actualizado(sobreescribe el anterior ya que usa la misma Key).
};
const actualizarCarrito = (producto) => { //Crea el HTML correspondiente al carrito, se llama dentro de "agregarCarrito()", pasando como parametro el parentElement del target original del click
    if(carrito.length > 0 ){
        $("#sinProductos").hide(); // unica manera en que funciona quitar datos en segundo intento, asi recupera la referencia, no funciona con varible sinProductos -.-
    }
    
    divListaCarrito.append(`
        <tr style="display: none;" id="codCarr${idCarr}">
            <td><img src=${producto.foto} alt="" class="img-fluid img-carrito"></td>
            <td>${producto.nombre} ${producto.modelo}</td>
            <td>$ ${producto.precio}</td>
        </tr>
    `);
    
    if(idCarr % 2 == 0){ //Dependiendo de la condicion de par/impar del id punta el background de un color u otro.
        $(`#codCarr${idCarr}`).show("slow").css("background-color","#ffe6ae").animate({opacity: "0.8"}, "slow");
    }else{
        $(`#codCarr${idCarr}`).show("slow").css("background-color","#fff6e1").animate({opacity: "0.9"}, "slow")
    }
    idCarr++;
    actualizarTotalCarrito(producto);
};
const actualizarTotalCarrito = (producto) => { //Se actualiza valor total de compra y se actualiza HTML.
    totalCarrito += parseInt(producto.precio);
    divTotalCarrito.html(totalCarrito);
};
const reiniciarDiv = () => { //Funcion para reiniciar table de carrito al estar vacio.
    divListaCarrito.html(`
    <tr id="sinProductos">
        <td><img src="" alt="" class="img-fluid img-carrito"></td>
        <td>Sin productos en carrito</td>
        <td>$ 0</td>
    </tr>
    `);
};
const eliminarCarrito = () => { //Vacia el carrito de compras, reinicia las variables y limpia el localStorage.
    reiniciarDiv();
    totalCarrito = 0;
    divTotalCarrito.html(totalCarrito);
    carrito = [];
    localStorage.clear();
    codLocalStorage = localStorage.length;
};
const comprarCarrito = () => {
        generaHTMLCompraCarrito();
        $("#msjDolar").hide();
        $("#convertirImporte").on('click', () => { 
            obtenerCotizacionDolar(totalCarrito);
            $("#msjDolar").show('slow');
        }); 
};
const obtenerCotizacionDolar = (importe) => { //Se obtiene cotizacion actual de dolar median API de criptoya
    fetch('https://criptoya.com/api/dolar')
    .then(rta => rta.json())
    .then(dato => { 
        let cotDolar = dato.oficial;
        let valorEnDolares = Math.round( importe / cotDolar );
        $("#totalDolares").html(valorEnDolares);
    });
};
const generaHTMLCompraCarrito = () => { //Crea el HTML del cartel emergente con datos de compra(o msj de carrito vacio)
    if (totalCarrito === 0){//Si el carrito está vacio:
        $('#contenedorPrincipal').append(`
            <div class="row divCompra position-absolute h-100 w-100" id="msj1">
                <div class="col-8 divCompraCartel position-fixed p-5">
                    <button type="button" class="btn btn-cerrar d-flex justify-content-center align-items-center" id="btn-cerrar"><span>X</span></button>
                    <h2><i class="far fa-frown-open"></i>El Carrito de compras se encuentra vacío...</h2>
                </div>
            </div>`);
        $("#btn-cerrar").on('click', () => { $('#msj1').remove(); });
    } else {//Si el carrito tiene productos:
        $('#contenedorPrincipal').append(`
            <div class="row divCompra position-absolute h-100 w-100" id="msj2">
                <div class="col-8 divCompraCartel position-fixed p-5">
                    <button type="button" class="btn btn-cerrar d-flex justify-content-center align-items-center" id="btn-cerrar2"><span>X</span></button>
                    <h2><i class="fas fa-shopping-cart"></i>Carrito de Compras</h2>
                    <span>El importe total del carrito es: $</span><span id="totalPesos">${totalCarrito}</span>
                    <br>
                    <button type="button" class="btn p-btn btn-eliminar-carrito" id="convertirImporte"><i class="fas fa-money-bill-wave"></i> Convertir a Dolar</button>
                    <span id="msjDolar">El importe con conversion a dorlar oficial es: U$D <span id="totalDolares">0</span></span>
                    <hr>
                    <button type="button" class="btn p-btn btn-comprar-carrito" id="compraFinal"><i class="far fa-credit-card"></i> Finalizar Compra</button>
                </div>
            </div>`);
        $('#btn-cerrar2').on('click', () => { $('#msj2').remove(); });
        $('#compraFinal').on('click', () => { finalizarCompra(); });  
    };
};

const finalizarCompra = () => { //Reinicio con eliminarCarrito() y cierre del cartel emergente.
    eliminarCarrito();
    $('#msj2').remove();
}