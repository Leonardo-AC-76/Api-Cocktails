let urlRandom = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
let urlIngredientes = 'https://www.thecocktaildb.com/images/ingredients/';
let ingredientes = [];

const DOM = {
    contenedor: document.getElementById("contenedor"),
    contenedor2: document.getElementById("contenedor2"),
    botonEnviar: document.getElementById("enviar"),
    span: document.querySelector(".espera")
};

(function(){
    DOM.botonEnviar.addEventListener("click", ObtenerCocktails);
})();

async function ObtenerCocktails(){
    DOM.botonEnviar.setAttribute("disabled" ,"");
    
    let hijosContenedor2 = DOM.contenedor2.children;

    if(hijosContenedor2.length > 1){
        Limpiar(hijosContenedor2);
    }

    DOM.span.classList.toggle("loader");
    let objeto;
    let promesa = await fetch(urlRandom)
         .then(res => res.json())
         .then(data => {
            cargarLayout(data.drinks[0]);
            return data.drinks[0]            
         })
         .then(obj => {
            ingredientes = recorrerIngredientes(obj);
            let span = document.getElementById("esperarFoto");
            cargarLayout2(ingredientes, span);
            cargarFoto(obj.strDrinkThumb);
            obtenerIngredientes(ingredientes);
                    
         })
         .catch(err =>{
            console.log(err);
         })        
}

async function obtenerIngredientes(ing){
    let blobImg;
    let fotos = document.querySelectorAll(".ingrediente");
    let spanes = document.querySelectorAll(".spanFotoIng");
    let cont = 0;

    ing.forEach(async i => {
        let imagen = document.createElement("img");
        imagen.classList.add("ingrediente");
        spanes[cont].classList.toggle("loaderOculto");
        fotos[cont].insertAdjacentElement("beforeend", imagen);
        let url = urlIngredientes +i+ "-small.png";
        cont++;

        let promesa1 = await fetch(url)
            .then(res => res.blob())
            .then(blob => {
                blobImg = blob;              
                let objectURL = URL.createObjectURL(blobImg);
                imagen.src = objectURL;
                
               
            })
            .catch(err =>{
                console.log(err);
            })          
    }) 
    
    DOM.botonEnviar.removeAttribute("disabled" ,"");
  
}
    
function cargarLayout(objeto){

    DOM.span.classList.toggle("loaderOculto");
    let divTitulo = document.createElement("div");
    contenedor2.insertAdjacentElement("beforeend", divTitulo);
    divTitulo.classList.add("contendorInstrucciones");
    let nombre = document.createElement("h3");
    divTitulo.insertAdjacentElement("beforeend", nombre);
    nombre.textContent = objeto.strDrink;
    let instrucciones = document.createElement("p");
    divTitulo.insertAdjacentElement("beforeend", instrucciones);
    instrucciones.textContent = objeto.strInstructions;
    let divFotos = document.createElement("div");
    divFotos.setAttribute("id", "contenedorFotos");
    contenedor2.insertAdjacentElement("beforeend", divFotos);
    divFotos.classList.add("contenedorFotos");
    let spanFotos = document.createElement("span");
    divFotos.insertAdjacentElement("beforeend", spanFotos);
    spanFotos.classList.add("loader");  
    spanFotos.setAttribute("id",  "esperarFoto");
}

function recorrerIngredientes(objeto){

    let cont = 1;
    

    for(let p in objeto){
        if(p.startsWith("strIngredient") && objeto[p] != null){
            ingredientes.push(objeto[p]);
        }
    }

    return ingredientes;
}

function cargarLayout2(ingredientes, span){

    let divFotos = document.getElementById("contenedorFotos");
    span.classList.toggle("loaderOculto");

    let divFoto = document.createElement("div");
    divFoto.setAttribute("id", "divFoto");
    divFotos.insertAdjacentElement("beforeend", divFoto);

    let spanFoto = document.createElement("span");
    spanFoto.setAttribute("id", "spanFoto");
    divFoto.insertAdjacentElement("beforeend", spanFoto);
    spanFoto.classList.add("loader"); 

    let divFotosIngredientes = document.createElement("div");
    divFotosIngredientes.setAttribute("id", "divFotosIngredientes");
    divFotos.insertAdjacentElement("beforeend", divFotosIngredientes);

    ingredientes.forEach(ing => {
        let divFotoIngrediente = document.createElement("div");
        divFotoIngrediente.classList.add("ingrediente");
        divFotosIngredientes.insertAdjacentElement("beforeend", divFotoIngrediente);
        
        let spanFotoIng = document.createElement("span");
        spanFotoIng.classList.add("loader", "spanFotoIng");
        divFotoIngrediente.insertAdjacentElement("beforeend", spanFotoIng);
    });
}

function cargarFoto(direccion){
    let divFoto = document.getElementById("divFoto");
    let foto = document.createElement("img");
    divFoto.insertAdjacentElement("beforeend", foto);
    let spanFoto = document.getElementById("spanFoto");
    spanFoto.classList.add("loaderOculto");
    foto.src = direccion;
}

function Limpiar(hijosContenedor2){
    
    while(hijosContenedor2.length > 1){

        let hijosContenedorInstrucciones = hijosContenedor2[1].children;
        let hijosContenedorFotos = hijosContenedor2[2].children;
        
        for(let e = 0; e <= hijosContenedorInstrucciones.length; e++){
            hijosContenedor2[1].removeChild(hijosContenedorInstrucciones[0]);
        }

        DOM.contenedor2.removeChild(hijosContenedor2[1]);

        let hijosDivFoto = hijosContenedorFotos[1].children;
        let hijosContenedorFotoIngredientes = hijosContenedorFotos[2].children;

        for(let e = 0; e <= hijosDivFoto.length; e++){
            hijosContenedorFotos[1].removeChild(hijosDivFoto[0]);
        }

        hijosContenedorFotos[1].remove();
        hijosContenedorFotos[0].remove();
        let cont = hijosContenedorFotoIngredientes.length;

        for(let e = 0; e < cont; e++){
            let hijosDivIngredientes = hijosContenedorFotoIngredientes[0].children;
            hijosDivIngredientes[1].remove();
            hijosDivIngredientes[0].remove();
            hijosContenedorFotoIngredientes[0].remove();
        }

        hijosContenedorFotos[0].remove();        
        hijosContenedor2[1].remove();
    }

    DOM.span.classList.toggle("loader");
    DOM.span.classList.toggle("loaderOculto");

    while(ingredientes.length > 0){
        ingredientes.pop(); 
    }
}