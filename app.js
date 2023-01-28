class ProductManager{
    constructor() {
        this.products = [];
    }

    static id = 0;

    addProduct = (title, description, price, thumbnail, code, stock)=> {
        
        const existeProducto = this.products.some((item)=>item.code === code)
        if (existeProducto) {
            console.log("Error: el producto con el código ingresado ya existe");
        } else if(code===null || code===""  || title === null || title === "" || description === null || description === "" || price === null || price === "" || thumbnail === null || thumbnail === "" || stock === null || stock === ""){
            console.log("Error: Faltan ingresar datos del producto");
        }else{
            const id = ProductManager.id
            this.products.push({  id , title, description, price, thumbnail, code, stock});
            ProductManager.id++;
        }
    }

    getProducts = ()=>{
        return this.products;
    }

    getProductById = (id)=>{
        
        if (this.products.some((item)=> item.id === id)) {
            return  this.products.find((item) => item.id === id);
        } else {
            return "Error: Not found";
        }  
        
    }
    
}

function main (){

    const productManager = new ProductManager();
    console.log("Elementos en el array (sin agregar): ", productManager.getProducts());
    console.log("-----------------------------------------------------------");
    productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123",25);
    console.log("Elementos en el array (producto agregado): ", productManager.getProducts());
    console.log("---------------------------Agrego repetido--------------------------------");
    productManager.addProduct("producto prueba", "Este es un producto prueba", 200 , "Sin imagen", "abc123",25);
    console.log("Elementos en el array (producto repetido): ", productManager.getProducts());
    console.log("------------------------Busqueda por id-----------------------------------");
    productManager.addProduct("producto prueba", "Este es un producto prueba", 400 , "Sin imagen", "miami",25);
    productManager.addProduct("producto prueba", "Este es un producto prueba", 500 , "Sin imagen", "pepito",25);
    console.log(productManager.getProductById(2));
    console.log("------------------------Muestro productos-----------------------------------");
    console.log(productManager.getProducts());
}

main();