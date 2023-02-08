import fs from 'fs';

class ProductManager{
    constructor() {
        this.products = [];
        this.path = './archivo_productos'
    }

    static id = 0;

    addProduct = async (title, description, price, thumbnail, code, stock)=> {
        try {
            if (fs.existsSync(this.path)) {
                const response = await fs.promises.readFile(this.path,'utf-8');
                this.products = JSON.parse(response);
                ProductManager.id = this.products[this.products.length-1].id + 1;
            } 
            
            const existeProducto = this.products.some((item)=>item.code === code)
            if (existeProducto) {
                console.log("Error: el producto con el código ingresado ya existe");
            }else if(code===null || code===""  || title === null || title === "" || description === null || description === "" || price === null || price === "" || thumbnail === null || thumbnail === "" || stock === null || stock === ""){
                console.log("Error: Faltan ingresar datos del producto");
            }else{
                const id = ProductManager.id
                this.products.push({  id , title, description, price, thumbnail, code, stock});
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            } 
        } catch (error) {
            console.log('Error en la ejecución', error)
        }
      
    }

    getProducts = async ()=>{
        try {
            if (fs.existsSync(this.path)) {
                const response = await fs.promises.readFile(this.path,'utf-8');
                this.products = JSON.parse(response);
                return JSON.parse(response);
            }else{
                return this.products;
            }
        } catch (error) {
            console.log('Error en la ejecución', error)
        }
        
    }

    getProductById = async (id)=>{
        try {
            const response = await fs.promises.readFile(this.path,'utf-8')
            const responseArray = JSON.parse(response);
            console.log('Error en la ejecución', responseArray);
            if (responseArray.some((item)=> item.id === id)) {
                return  responseArray.find((item) => item.id === id);
            } else {
                return {Error: "Item Not found"};
            } 
        } catch (error) {
            console.log('Error en la ejecución', error)
        }
        
        
    }

    updateProduct = async(id, producto) =>{
        try {
            const {title, description, price, thumbnail, code, stock} = producto;
            const arrayProductos = await this.getProducts();
            const arrayModificado = arrayProductos.map((item)=> {
                if(item.id!==id){
                    return item;
                }else{
                    const producto_nuevo ={
                        title: title ? title : item.title, 
                        description: description ? description : item.description, 
                        price: price ? price : item.price, 
                        thumbnail: thumbnail ? thumbnail : item.thumbnail, 
                        code: code ? code : item.code, 
                        stock: stock ? stock : item.stock
                    }
                    item = {id: item.id, ...producto_nuevo}
                    return item;
                }
    
            });     

            await fs.promises.writeFile(this.path, JSON.stringify(arrayModificado));
        } catch (error) {
            console.log('Error en la ejecución', error) 
        }
       


    }

    deleteProduct = async(id) =>{
        try {
            let arrayProductosFiltrado = [];
            const arrayProductos = await this.getProducts();
            if(arrayProductos.some((item)=>item.id===id)){
                arrayProductosFiltrado =  arrayProductos.filter((item)=>item.id!==id);
                await fs.promises.writeFile(this.path, JSON.stringify(arrayProductosFiltrado));
            }else{
                console.log("El producto que se quiere eliminar, no existe");
            }
            
        } catch (error) {
            console.log('Error en la ejecución', error)
        }    
        
    }


    
}

/* async function main (){

    const productManager = new ProductManager();
    console.log("--------------------------Generando Productos---------------------------------");

    await productManager.addProduct("producto prueba1", "Este es un producto prueba 1", 200, "Sin imagen", "abc123",25);
    await productManager.addProduct("producto prueba2", "Este es un producto prueba 2", 300, "Sin imagen", "abc124",25);
    await productManager.addProduct("producto prueba3", "Este es un producto prueba 3", 400, "Sin imagen", "abc125",25);
    await productManager.addProduct("producto prueba4", "Este es un producto prueba 4", 500, "Sin imagen", "abc126",25);
    await productManager.addProduct("producto prueba5", "Este es un producto prueba 5", 600, "Sin imagen", "abc127",25);
    await productManager.addProduct("producto prueba6", "Este es un producto prueba 6", 700, "Sin imagen", "abc128",25);
    await productManager.addProduct("producto prueba7", "Este es un producto prueba 7", 800, "Sin imagen", "abc129",25);
    await productManager.addProduct("producto prueba8", "Este es un producto prueba 8", 900, "Sin imagen", "abc130",25);
    await productManager.addProduct("producto prueba9", "Este es un producto prueba 9", 1000, "Sin imagen", "abc131",25);
    await productManager.addProduct("producto prueba10", "Este es un producto prueba 10", 1100, "Sin imagen", "abc132",25);
    
    console.log(await productManager.getProducts()); 
    
    
    console.log("Elementos en el array (sin agregar): ", await productManager.getProducts());
    console.log("-----------------------------------------------------------");
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123",25);
    console.log("Elementos en el array (producto agregado): ", await productManager.getProducts());
    console.log("---------------------------Agrego repetido--------------------------------");
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 200 , "Sin imagen", "abc123",25);
    console.log("Elementos en el array (producto repetido): ", await productManager.getProducts());
    console.log("------------------------Busqueda por id-----------------------------------");
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 400 , "Sin imagen", "miami",25);
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 500 , "Sin imagen", "pepito",25);
    console.log(await productManager.getProductById(2));
    console.log("------------------------Update product-----------------------------------");
    await productManager.updateProduct(2,{title: "cambio titulo", description: "Cambio", price: 1, thumbnail: "sin imagen", code:"pedro", stock:1})
    console.log(await productManager.getProductById(2));
    console.log("------------------------Delete product-----------------------------------");
    await productManager.deleteProduct(2);
    console.log(await productManager.getProductById(2));
    console.log("------------------------Muestro productos-----------------------------------");
    console.log(await productManager.getProducts());
}

main(); */

export default ProductManager;