
const menu = document.getElementById("menu"); // Menu principal da página onde estão a Main e os produtos
const cartBtn = document.getElementById("cart-btn"); // Botão do footer vermelho
const cartModal = document.getElementById("cart-modal"); // Botão do modal para aparecer na tela O Carrinho
const cartItemsContainer = document.getElementById("cart-items"); // Itens que vão se colocados dentro do carrinho no modal
const cartTotal = document.getElementById("cart-total") // Total do carrinho
const checkoutBtn = document.getElementById("checkout-btn"); // Botão verde da compra com sucesso
const closeModalBtn = document.getElementById("close-modal-btn"); // Botão de fechar o carrinho
const cartCounter = document.getElementById("cart-acount") // Botão do número total de compra no footer
const addressInput = document.getElementById("address"); // Input do modal para digitar o endereço
const addressWarn = document.getElementById("address-warn"); // Aviso de erro caso não digite o endereço
const spanItem = document.getElementById("date-span"); // Pega o span do horário de abertura da hamburgueria

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
    updateCartModal();
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function (event) {
    if (event.target === closeModalBtn) {
        cartModal.style.display = "none";
    }
});

menu.addEventListener("click", function (event) {
    // Pegando o botão de compra que está sendo clicado
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        // Adicionar no carrinho
        addToCart(name, price);
    }
});

// função para adicionar no carrinho
function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        // Se o item já existe, aumenta apenas a aquantidade + 1
        existingItem.quantity += 1;
    } else {
        // Adicionando um objeto com valores dentro do carrinho que é o array vazio chamado "cart"
        cart.push({
            name,
            price,
            quantity: 1
        });
    }
    updateCartModal();
}


// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
}

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const nameOfRemove = event.target.getAttribute("data-name");

        removeItemCart(nameOfRemove);
    }
});

// função para remover o item do carrinho
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        console.log(item);

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

// Verifica se está sendo digitado algo no input
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

// Verifica se foi enviado algo do input do formulário
checkoutBtn.addEventListener("click", function () {

    // Checa se o restaurante está fechado para fazer ou não o pedido
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }


    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500");
        return;
    }

    // enviar o pedido para API whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "31991499433";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    // Zerando o carrinho ao enviar o pedido via Whatsapp
    cart = [];
    updateCartModal();

});

// Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}