//2 Desafio Entregable de Backend

const fs = require("fs").promises;

class ProductManager {
    //Variable estatica 
    static ultId = 0;


    //Array vacio. 
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    //Métodos: 

    async addProduct(nuevoObjeto) {
        let { title, description, price, img, code, stock } = nuevoObjeto;

        //Valicion que se agregaron todos los campos: 
        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        //Validacion que el código sea único: 
        if (this.products.some(item => item.code === code)) {
            console.log("El codigo debe ser unico");
            return;
        }

        //Nuevo objeto con todos estos datos: 

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        //Lo agrego al array: 

        this.products.push(newProduct);

        //Guardamos el array en el archivo: 

        await this.guardarArchivo(this.products);

    }

    getProducts() {
        console.log(this.products);
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado!");
                return buscado;
            }

        } catch (error) {
            console.log("Error al leer el archivo ", error);
        }

    }
    //Nuevos metodos desafio 2: 

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;

        } catch (error) {
            console.log("Error al leer un archivo", error);
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }

    //Actualizamos algun producto:
    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                //Puedo usar el método de array splice para reemplazar el objeto en la posicion del index: 
                arrayProductos.splice(index, 1, productoActualizado);
                await this.guardarArchivo(arrayProductos);
            } else {
                console.log("no se encontró el producto");
            }

        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

      //Borramos algun producto:
      async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
                console.log(`producto ${id} eliminado`)
            } else {
                console.log("no se encontró el producto");
            }

        } catch (error) {
            console.log("Error al encontrar el producto", error);
        }
    }
    

}



//Testing: 

//1) Se creará una instancia de la clase “ProductManager”

const manager = new ProductManager("./products.json");

//2) Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

manager.getProducts();

//3) Se llamará al método “addProduct” :


const lentejas = {
    title: "lentejas",
    description: "las mas ricos",
    price: 100,
    img: "sin imagen",
    code: "abc123",
    stock: 30
}

manager.addProduct(lentejas);


//4) El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

const pescado = {
    title: "pescado",
    description: "los mas frescos",
    price: 1300,
    img: "sin imagen",
    code: "abc124",
    stock: 30
}


manager.addProduct(pescado);



const aceite = {
    title: "aceite",
    description: "esta carisimo",
    price: 15000,
    img: "sin imagen",
    code: "abc125",
    //stock: 30,
}

//Repetimos el codigo: 

//manager.addProduct(aceite);
//Las validaciones funcionan. 

//5)Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

manager.getProducts();



//6)Se llamará al método “getProductById” y se verificara que devuelva el producto con el id especificado, de lo contrario arrojara un error.

async function testeamosBusquedaPorId() {
    const buscado = await manager.getProductById(2);
    console.log(buscado);
}

testeamosBusquedaPorId();

//Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no elimine el id y que sí se haya hecho la actualización.

const salsa = {
    id: 1,
    title: "salsa tomate",
    description: "los mas ricos",
    price: 150,
    img: "Sin imagen",
    code: "abc123",
    stock: 30
};

async function testeamosActualizar() {
    await manager.updateProduct(1, salsa);
}

testeamosActualizar();

//Se llamará al método “deleteProduct” y se intentará borrar un producto.

async function borrarProducto() {
    await manager.deleteProduct(1);
}

//borrarProducto();
