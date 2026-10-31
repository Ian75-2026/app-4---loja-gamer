class Produto {
    constructor(id, nome, preco, emoji) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.emoji = emoji;
    }
}

// Um item dentro do carrinho: qual produto e quantas unidades
class ItemCarrinho {
    constructor(produto) {
        this.produto = produto;
        this.quantidade = 1;
    }

    subtotal() {
        return this.produto.preco * this.quantidade;
    }
}

// O carrinho guarda uma lista de ItemCarrinho
class Carrinho {
    constructor() {
        this.itens = [];
    }

    // Procura no carrinho o item daquele produto (ou devolve undefined)
    buscarItem(produto) {
        return this.itens.find(function (item) {
            return item.produto.id === produto.id;
        });
    }
}

adicionar(produto) {
        const itemExistente = this.buscarItem(produto);
        if (itemExistente) {
            itemExistente.quantidade++;      // já estava: soma 1
        } else {
            this.itens.push(new ItemCarrinho(produto)); // não estava: cria o item
        }
    }

    diminuir(produto) {
        const item = this.buscarItem(produto);
        if (!item) {
            return;
        }
        item.quantidade--;
        if (item.quantidade === 0) {
            // Remove do array todos os itens que forem desse produto
            this.itens = this.itens.filter(function (i) {
                return i.produto.id !== produto.id;
            });
        }
    }

    esvaziar() {
        this.itens = [];
    }

    quantidadeTotal() {
        let soma = 0;
        for (const item of this.itens) {
            soma = soma + item.quantidade;
        }
        return soma;
    }
}

total() {
        let soma = 0;
        for (const item of this.itens) {
            soma = soma + item.subtotal();
        }
        return soma;
    }
}

// ====================== DADOS ======================

const produtos = [
    new Produto(1, "Controle sem fio", 249.9, "🎮"),
    new Produto(2, "Headset", 189.9, "🎧"),
    new Produto(3, "Mouse gamer", 119.9, "🖱️"),
    new Produto(4, "Teclado mecânico", 299.9, "⌨️"),
    new Produto(5, "Cadeira gamer", 899.0, "💺"),
    new Produto(6, "Pelúcia do Pikachu", 79.9, "⚡")
];

const carrinho = new Carrinho();

// ====================== FUNÇÕES DE APOIO ======================
// Transforma 249.9 em "R$ 249,90"
function formatarDinheiro(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ====================== TELA ======================

const vitrine = document.getElementById("vitrine");
const listaCarrinho = document.getElementById("lista-carrinho");
const textoVazio = document.getElementById("carrinho-vazio");
const textoTotal = document.getElementById("total");
const contadorItens = document.getElementById("contador-itens");
const botaoLimpar = document.getElementById("botao-limpar");

// A vitrine é desenhada uma vez só, quando a página abre
function renderizarVitrine() {
    for (const produto of produtos) {
        const cartao = document.createElement("div");
        cartao.classList.add("produto");

        const emoji = document.createElement("div");
        emoji.classList.add("emoji");
        emoji.textContent = produto.emoji;

        const nome = document.createElement("h3");
        nome.textContent = produto.nome;

        const preco = document.createElement("p");
        preco.classList.add("preco");
        preco.textContent = formatarDinheiro(produto.preco);

        const botao = document.createElement("button");
        botao.textContent = "Adicionar";
        botao.addEventListener("click", function () {
            carrinho.adicionar(produto);
            renderizarCarrinho();
        });

        cartao.append(emoji, nome, preco, botao);
        vitrine.appendChild(cartao);
    }
}
// O carrinho é redesenhado sempre que algo muda
function renderizarCarrinho() {
    listaCarrinho.innerHTML = "";

    for (const item of carrinho.itens) {
        const li = document.createElement("li");
        li.classList.add("item-carrinho");

        const botaoMenos = document.createElement("button");
        botaoMenos.textContent = "-";
        botaoMenos.classList.add("botao-qtd");
        botaoMenos.addEventListener("click", function () {
            carrinho.diminuir(item.produto);
            renderizarCarrinho();
        });

        const nome = document.createElement("span");
        nome.classList.add("nome");
        nome.textContent = `${item.quantidade}x ${item.produto.nome}`;

        const botaoMais = document.createElement("button");
        botaoMais.textContent = "+";
        botaoMais.classList.add("botao-qtd");
        botaoMais.addEventListener("click", function () {
            carrinho.adicionar(item.produto);
            renderizarCarrinho();
        });

        const subtotal = document.createElement("span");
        subtotal.classList.add("subtotal");
        subtotal.textContent = formatarDinheiro(item.subtotal());

        li.append(botaoMenos, nome, botaoMais, subtotal);
        listaCarrinho.appendChild(li);
    }
    textoTotal.textContent = formatarDinheiro(carrinho.total());
    contadorItens.textContent = carrinho.quantidadeTotal();
    textoVazio.style.display = carrinho.itens.length === 0 ? "block" : "none";
}

botaoLimpar.addEventListener("click", function () {
    carrinho.esvaziar();
    renderizarCarrinho();
});

// Começa o app
renderizarVitrine();
renderizarCarrinho();
