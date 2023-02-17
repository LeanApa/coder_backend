import fs from 'fs';

export default class CartManager{
    constructor() {
        this.products = [];
        this.path = './archivo_cart'
    }

    static id = 0;


    addCart = async (products)=> {
        try {
            let carts = [];
            if (fs.existsSync(this.path)) {
                const response = await fs.promises.readFile(this.path,'utf-8');
                carts = JSON.parse(response);
                CartManager.id = carts[carts.length-1].id + 1;
            }
            const id = CartManager.id;
            this.products = products;
            carts.push({id, products});
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return (carts);
        } catch (error) {
            console.log('Error en la ejecución', error);
            return ('Error en la ejecución', error);
        }
      
    }
    
    addProduct = async (title, description, code, price, status = true, stock, category, thumbnails)=> {
        try {
            if (fs.existsSync(this.path)) {
                const response = await fs.promises.readFile(this.path,'utf-8');
                this.products = JSON.parse(response);
                ProductManager.id = this.products[this.products.length-1].id + 1;
            } 
            
            const existeProducto = this.products.some((item)=>item.code === code)
            if (existeProducto) {
                console.log("Error: el producto con el código ingresado ya existe");
                return ("Error: el producto con el código ingresado ya existe")
            }else if(code===null || code===""  || title === null || title === "" || description === null || description === "" || price === null || price === "" || thumbnails === null || thumbnails === "" || stock === null || stock === "" || category === null || category === ""){
                console.log("Error: Faltan ingresar datos del producto");
                return ("Error: Faltan ingresar datos del producto");
            }else{
                const id = ProductManager.id
                this.products.push({  id , title, description, code, price, status, stock, category, thumbnails});
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
                return ({message: "Producto aniadido"});
            } 
        } catch (error) {
            console.log('Error en la ejecución', error);
            return ('Error en la ejecución', error);
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
            const {title, description, code, price, status, stock, category, thumbnails} = producto;
            const arrayProductos = await this.getProducts();
            const arrayModificado = arrayProductos.map((item)=> {
                if(item.id!==id){
                    return item;
                }else{
                    const producto_nuevo ={
                        title: title ? title : item.title, 
                        description: description ? description : item.description,
                        code: code ? code : item.code, 
                        price: price ? price : item.price,
                        status: status ? status : item.status,
                        stock: stock ? stock : item.stock, 
                        category: category ? category : item.category,
                        thumbnails: thumbnails ? thumbnails : item.thumbnails, 
                    }
                    item = {id: item.id, ...producto_nuevo}
                    return item;
                }
    
            });     

            await fs.promises.writeFile(this.path, JSON.stringify(arrayModificado));
            return {Message: "Item updated"};
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
                return("Producto eliminado");
            }else{
                console.log("El producto que se quiere eliminar, no existe");
                return("El producto que se quiere eliminar, no existe");
            }
            
        } catch (error) {
            console.log('Error en la ejecución', error)
            return('Error en la ejecución', error);
        }    
        
    }


    
}