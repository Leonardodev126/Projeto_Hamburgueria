
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

            <div>
                <button>
                    Remover
                </button>
            </div>
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toFixed(2);
}

