const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav-menu_visible");

  //para que sea aacesible con tab y luego enter
  if (navMenu.classList.contains("nav-menu_visible")) {
    navToggle.setAttribute("aria-label", "Cerrar menú");
  } else {
    navToggle.setAttribute("aria-label", "Abrir menú");
  }});

//!---------------------------------------------------------------------------

const btnAbrirCarrito = document.getElementById('mostrarCarrito')
const cambioClaseCarrito = document.querySelector('.contenedorCarrito')
btnAbrirCarrito.addEventListener('click', (e)=>{
  e.preventDefault()
  cambioClaseCarrito.classList.add('mostrarCarrito')
  contenedorProductos.classList.add('productosModificados')
})

const btnCerrarCarrito = document.getElementById('botonSalirJs')
const btnCerrarCarritoInferiror = document.getElementById('cerrarCarrito2')

btnCerrarCarrito.addEventListener('click', (e) =>{
  e.preventDefault()
  cambioClaseCarrito.classList.remove('mostrarCarrito')
  contenedorProductos.classList.remove('productosModificados')
})

btnCerrarCarritoInferiror.addEventListener('click', (e) =>{
  e.preventDefault()
  cambioClaseCarrito.classList.remove('mostrarCarrito')
  contenedorProductos.classList.remove('productosModificados')
})



let productos = [
    {id: 1, nombre: "Matambre Arrollado", precio: 1270, img: "/img/matambre.png"},
    {id: 2, nombre: "Matambres Especiales", precio: 1350, img: "/img/matambre.png"},
    {id: 3, nombre: "Pastron", precio: 1500, img: "/img/matambre.png"},
    {id: 4, nombre: "Arrollado de Pollo", precio: 1000, img: "/img/matambre.png"},
    {id: 5, nombre: "Arrollado de Pollo Provenzal", precio: 1000, img: "/img/matambre.png"},
    {id: 6, nombre: "Fiambre de Pavita y Pollo", precio: 1030, img: "/img/matambre.png"},
    {id: 7, nombre: "Panceta Doble Tiernizada", precio: 770, img: "/img/matambre.png"},
    {id: 8, nombre: "Panceta con Cuero", precio: 1420, img: "/img/matambre.png"},
    {id: 9, nombre: "Panceta Arrollada", precio: 1420, img: "/img/matambre.png"},
    {id: 10, nombre: "Jamon Cocido etiqueta negra", precio: 850, img: "/img/matambre.png"},
    {id: 11, nombre: "Queso de Cerdo", precio: 550, img: "/img/matambre.png"},
]


const contenedorProductos = document.getElementById('contenedorProductos')
let carrito = []
const contadorCarrito = document.getElementById('iconoCarrito')
const vaciarCarrito = document.getElementById('vaciarCarrito')
const totalCarrito = document.getElementById('totalCarrito')
// DOMcontentLoaded es para que cada vez que se carge el documente se ejecute la funcion
document.addEventListener('DOMContentLoaded', () =>{
  carrito = JSON.parse(localStorage.getItem('carrito')) || []
  mostrarCarrito()
})

vaciarCarrito.addEventListener('click', () =>{
  carrito.length = []
  mostrarCarrito()
})


const hacerFetch = async () => {
  const response = await fetch('/script/productos.json')
  const productos = await response.json()
  renderizarProductos(productos)
}
hacerFetch()



//              !!! IMPORTANTE
//use el fetch solo para imprimirlos y deje el resto de mis funciones con el array original



function renderizarProductos(arrayDeProductos){

arrayDeProductos.forEach((producto) =>{
  const {id, nombre, precio, img} = producto

    let cajaContenedorProducto = document.createElement('div')
    cajaContenedorProducto.className = 'cajaContenedorProducto'
    cajaContenedorProducto.innerHTML= `
    <h6>${nombre}</h6>
    <img src=${img} alt="" class="imagen-caja">
    <p>precio:</p>
    <p>$ ${precio}</p>
    <div class="style-carrito">
    <button onclick="agregarProducto(${id})" class="botonAgregarACarrito">
    <p>Agregar al Carrito</p>
    </button>
    </div>
  
    `
    contenedorProductos.append(cajaContenedorProducto)
  
})
}


function agregarProducto(id){

  // el some dice si existe el carrito
  const produExiste = carrito.some(produ => produ.id === id)
  if(produExiste){
    const produ = carrito.map (produ => {
      if(produ.id === id){
        produ.cantidad ++
      }
    })
  } else {
    const productoAgregado = productos.find((prod) => prod.id === id)
    carrito.push(productoAgregado)
    productoAgregado.cantidad = 1
  }
  
  mostrarCarrito()
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Producto Agregado',
    showConfirmButton: false,
    timer: 1500,
    width: '13em',
    color: '#edc778',
  })
}

const contenedorCarrito = document.querySelector('.claseCarrito')
const mostrarCarrito = () => {

  contenedorCarrito.innerHTML='' 
  carrito.forEach((produ) => {
    const{ id, nombre, precio, cantidad} = produ
    let pretotal = cantidad * precio
    contenedorCarrito.innerHTML +=`

    <div class="itemCarrito">
    <p class="productoCarrito">${nombre}</p>
    <p class="bloqueCarrito">$${precio}</p>
    <div class="bloqueCarrito sumaYResta">
        <button id="restaCarrito(${id})">-</button>
        <input type="text" value="${cantidad}" class="input" readonly="readonly" id=${id}Input>
        <button id="sumaCarrito(${id})">+</button>
    </div>
    <p class="bloqueCarrito">$${pretotal}</p>
    <div class="bloqueSalir">
      <button onclick="eliminarProducto(${id})"><i class="fa-sharp fa-solid fa-trash"></i></button>
    </div>
    </div>
    `

    const sumarProducto = document.getElementById(`sumaCarrito(${id})`)
    const restarProducto = document.getElementById(`restaCarrito(${id})`)
    sumarProducto.addEventListener('click', () =>  sumarACarrito(produ))
    restarProducto.addEventListener('click', () => restarACarrito(produ))
  })
  if (carrito.length === 0){
    contenedorCarrito.innerHTML =`
    <p class="avisoCarritoVacio">¡Aún no agregaste ningun producto!</p>
    `
  }
  contadorCarrito.textContent = carrito.length
  // uso acumulador reduce
  totalCarrito.innerText = "TOTAL:  " + carrito.reduce((acumulador, produ) => acumulador + produ.precio * produ.cantidad, 0)
  GuardarStorage()
}

function sumarACarrito(e){
  e.cantidad ++
  mostrarCarrito()
}

function restarACarrito(e){
  if(e.cantidad == 1){
    eliminarProducto(e.id)
    mostrarCarrito()
  } else{
    e.cantidad --
    mostrarCarrito()
  }
}

function eliminarProducto(id){
  const produId = id
  carrito = carrito.filter((produ) => produ.id !== produId)
  mostrarCarrito()
}

function GuardarStorage(){
  localStorage.setItem("carrito", JSON.stringify(carrito))
}

