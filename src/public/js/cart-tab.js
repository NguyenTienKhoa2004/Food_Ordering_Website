let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let checkoutBtn = document.getElementById('checkout-btn');
let cart = [];


const addCartToHTML = () => {
    if (!listCartHTML || !iconCartSpan) return; 
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
           
            <div class="image">
                    <img src="${item.image}">
                </div>
                <div class="name">
                ${item.name}
                </div>
                <div class="totalPrice">$${item.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML(); // Render cart items
    }
   
});

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        
        // Optionally, you can validate cart here
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Cart is already in localStorage, just redirect
        window.location.href = '/order/formOrder';
    });
}

let listProducts = [];
iconCart.addEventListener("click", () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        event.preventDefault();
        let id = positionClick.closest('.item').dataset.id;
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == id);
        if(positionThisProductInCart >= 0) {
            if(positionClick.classList.contains('minus')) {
                if(cart[positionThisProductInCart].quantity > 1) {
                    cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity - 1;
                } else {
                    cart.splice(positionThisProductInCart, 1);
                }
            } else if(positionClick.classList.contains('plus')) {
                cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
            }
            
            addCartToHTML();
            addCartToMemory2();
        }
    }

})
const addCartToMemory2 = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
//This listener is for the "Order Now" buttons in the product list
if (listProductHTML) {
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('btn-order-now')||
        positionClick.classList.contains('btn-primary')){
            let id = positionClick.dataset.id;
            let name = positionClick.dataset.name;
            let image = positionClick.dataset.image;
            let price = parseFloat(positionClick.dataset.price);
            addToCart(id, name, image, price);
        }
    });
}
// This listener is for the "Order Now" buttons in the suggestion container
let suggestionContainer = document.querySelector('.suggestion-container');
if (suggestionContainer) {
    suggestionContainer.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('order-now-btn')){
            let id = positionClick.dataset.id;
            let name = positionClick.dataset.name;
            let image = positionClick.dataset.image;
            let price = parseFloat(positionClick.dataset.price);
            addToCart(id, name, image, price);
        }
    });
}

const addToCart = (product_id, name, image, price) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            name: name,
            image: image,
            price: price,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            name: name,
            image: image,
            price: price,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    console.log("Cart", cart);
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Event listener for the "Order Now" buttons in homepage
