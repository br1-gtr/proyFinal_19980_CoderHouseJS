$(document).ready(function(){
    generaHTMLproductos();
    checkLocalStorage();
    divListaProductos.on('click', (e) => {
        if(e.target.id === 'btn-carrito'){
            agregarCarrito(e.target.parentElement); //Se pasan como parametro elementos totales del contenedor padre.
        }});
    $(".imgLike").on('click', function(){
        $(this).toggleClass("like");}
    );
    btnEliminarCarrito.on('click', () => { eliminarCarrito(); });
    btnComprarCarrito.on('click', () => { 
        comprarCarrito(); 
    });  
});//fin Ready