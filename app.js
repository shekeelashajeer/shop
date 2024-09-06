let iconCart = document.querySelector('.icon-cart');

let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct'); 
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let closeCart = document.querySelector('.close');  
let checkOutButton = document.querySelector('.checkOut'); 


let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart'); 
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

checkOutButton.addEventListener('click', () => {
    if (carts.length > 0) {
        let totalCost = calculateTotalCost();
       
        alert(`  Total cost is ₹${totalCost}.`);
        clearCart();  
    } else {
        alert('Your cart is empty!');
    }
});

const calculateTotalCost = () => {
    let totalCost = 0;
    carts.forEach(cart => {
        let positionProduct = listProducts.findIndex((product) => product.id == cart.product_id);
        let productInfo = listProducts[positionProduct];

        
        let productPrice = parseFloat(productInfo.price); 

        totalCost += productPrice * cart.quantity;
    });
    return totalCost;
};

    



const addDataToHTML = () => {
    listProductHTML.innerHTML = ''; 
    if (listProducts.length > 0) { 
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id; 
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>

                <div class="price"> ₹${product.price}</div>
                

                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id); 
    }
});


const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id === product_id);
    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
};



const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct]; 
            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    ₹${info.price}
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div 
                
                <div class="description">
                    <p>${info.description}</p>
                </div>
            `;
            listCartHTML.appendChild(newCart); 
        });
    }
    iconCartSpan.innerHTML = totalQuantity;
};


const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch(type) {
            case 'plus':
                carts[positionItemInCart].quantity += 1;
                break;
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.closest('.item').dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantity(product_id, type);
    }
});

const clearCart = () => {
    carts = []; 
    localStorage.removeItem('cart'); 
    addCartToHTML(); 
};



const initApp = () => {
    fetch('product.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHTML();
        if (localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    });
};

initApp();
