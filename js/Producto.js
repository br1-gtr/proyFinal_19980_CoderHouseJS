class Producto {
    constructor( cod, nombre, modelo, precio, foto, stock ) {
        this.cod = cod;
        this.nombre = nombre;
        this.modelo = modelo;
        this.precio = precio;
        this.foto = foto;
        this.stock = stock;
    }
    modificarStock() { //Reduce stock en 1 luego  de validar si el stock es mayor a 0. Muestra msj de compra finalizada o msj de stock.
        if ( this.stock > 0 ){
            this.stock--;
            console.log(`Operación Finalizada! Compraste ${this.nombre} ${this.modelo} a un valor de $${this.precio}. \nEl codigo de producto seleccionado es ${this.codSeguimiento}.\nDisfruta de tu copmpra!!!`);    
        } else {
            console.log('No hay stock disponible, disculpe las molestias.');
        }
    }      
};