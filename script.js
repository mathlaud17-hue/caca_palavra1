
const tabuleiro = document.getElementById("tabuleiro");
const entrada = document.getElementById("entrada");
const formulario = document.getElementById("formulario");
const enviar = document.getElementById("enviar");
const mensagem = document.getElementById("mensagem");
const categoriaEl = document.getElementById("categoria");
const iconeTema = document.getElementById("iconeTema");
const resultadoEl = document.getElementById("resultado");
const tituloResultado = document.getElementById("tituloResultado");
const textoResultado = document.getElementById("textoResultado");
const COOKIE_NAME = "palavra_do_dia_v1";
const MAX_TENTATIVAS = 6;

const CATEGORIAS = [
    {
        nome: "Animais",
        icone: "🐾",
        palavras: ["GATOS", "TIGRE", "COBRA", "RATOS", "PANDA", "ZEBRA", "POMBO", "URUBU"]
    },
    {
        nome: "Comida",
        icone: "🍎",
        palavras: ["MANGA", "MELAO", "PIZZA", "SUSHI", "CACAU", "TRIGO", "MASSA", "ARROZ"]
    },
    {
        nome: "Ciência",
        icone: "🔬",
        palavras: ["ATOMO", "LASER", "FEMUR", "GENES", "PLUTO", "RADIO", "VIRUS", "CELAS"]
    },
    {
        nome: "Esportes",
        icone: "🏅",
        palavras: ["GOLFE", "RUGBY", "SURFE", "PASSE", "JOGOS", "LUTAS", "CORRE", "TENIS"]
    }
];

const PALAVRAS_RESERVA = `
ABRIR ACASO ACHAR ACIMA ADEUS AGORA AGUAS AINDA AJUDA ALBUM ALMAS ALTAS AMIGO AMORA ANDAR ANTES
APITO APOIO AREIA ARMAS ARROZ ARTES ASSAR ASTRO ATLAS ATRAS AUDIO AVIAO BAIXO BANCO BANHO BARCO
BARRA BASES BATAS BEIJO BICHO BOLSA BOLSO BORDA BOTAO BRACO BRASA BRISA BROCA BRUXA CABER CABOS
CACAU CAIXA CALMA CAMPO CANAL CANTO CAPAZ CAPAS CARNE CARRO CARTA CASAL CASAS CASCO CAUSA CEDER
CENAS CERTO CHAMA CHAVE CHEFE CHUVA CINCO CINTA CLARA CLARO CLIMA COBRA COISA COLAR COMER COMUM
CONTA CORAL CORPO CORTE COURO CRAVO CRIME CRISE CULTO CURSO DANCA DEDOS DENTE DIETA DISCO DIZER
DOBRA DOIDO DOLAR DONOS DORES DORME DRAMA DUCHA DUNAS ECOAR EDITA EIXOS ELITE ENTRA ENVIO ERROS
ESTAR ETAPA EXAME EXATO EXTRA FALAR FALHA FALSO FALTA FASES FATAL FAVOR FELIZ FERRO FICAR FILHO
FILME FINAL FIRME FLOCO FLORA FOCAR FOLHA FONTE FORMA FORTE FOTOS FRACO FREIO FRUTA FUNDO FURIA
GATOS GENTE GESTO GIRAR GOLPE GOSTO GRAUS GRUPO HASTE HOTEL HUMOR IDEAL IGUAL ILHAS IMPOR INDIO
JANTA JOGAR JOGOS JOVEM JUIZO JURAR LADOS LAGOA LANCE LARGO LATIM LAVAR LEITE LENDA LENTO LEQUE
LETRA LEVAR LIGAR LIMAO LIMBO LIMPO LINDA LINHA LIVRE LIVRO LOCAL LUGAR LUNAR LUZES MACIO MAGIA
MAIOR MALHA MANGA MANHA MANIA MAPAS MARCA MARCO MARES MARTE MASSA MATAR MEDIR MEIAS MELAO MENOR
MENTE MESAS METAL METAS METRO MEXER MISTO MODAS MOEDA MOLHO MONTE MORAL MORRO MORTO MOTOR MUDAR
MUITO MUNDO MURAL MUSEU MUSGO NARIZ NASCE NAVAL NAVIO NEGAR NEGRO NENEM NERVO NEVES NINHO NOBRE
NOITE NORTE NOTAS NUVEM OBRAS ODIAR OLHAR OMBRO ONTEM ORDEM OSSOS OUVIR PAGAR PAGOS PALCO PALHA
PALMA PAPEL PAPOS PARAR PARES PARTE PASSA PASSE PASTA PATIO PAUSA PEDAL PEDRA PEGAR PEITO PEIXE
PENAS PENSO PERDA PERTO PESAR PESCA PESTE PIADA PIANO PILHA PINTO PIORA PIPAS PISTA PLANO PLENO
PLUMA POEMA POETA PONTO PORCA PORCO PORTA PORTO POSSE POSTO POTES PRADO PRATA PRATO PRAZO PREGO
PRETO PRIMO PROSA PROVA PRUMO PULAR PULSO PUNHO QUASE QUEDA QUILO QUINA RABOS RAMOS RAPAZ RAPTO
RASGO RASTO RAZAO REAIS REGRA REINO REMAR REMOS RENDA RESTO RETRO RIGOR RIMAS RISCO RITMO ROCHA
RODAS ROLHA ROMBO RONDA ROSAS ROSTO ROTAS ROUPA RURAL SABER SABIA SABOR SACOS SALAS SALDO SALMO
SALSA SALTO SALVA SANTO SAUDE SECAS SEIOS SELAR SENHA SENIL SENSO SERIO SERRA SERVE SETOR SEXTO
SIGLA SIGNO SINAL SITIO SOBRA SOBRE SOCIO SOLAR SOLDO SONHO SOPAS SORTE SUAVE SUBIR SUCOS SUJAR
SUMIR SUPER SURDO SURFE TABUA TACOS TALCO TAMPO TANGO TANTO TARDE TAXAS TECLA TEIMA TELAS TEMAS
TEMER TEMPO TENDA TENIS TERMO TERRA TESTE TEXTO TIGRE TIMAO TINTA TIRAR TITIO TOCAR TODAS TODOS
TOMAR TONEL TONTO TOPAR TORRE TORTA TOTAL TOURO TRACO TRAJE TRAMA TRATO TRECO TREVO TRIGO TRONO
TROCA TROCO TRUCO TUBOS TUMBA TUNEL TURMA TURNO UNHAS UNICO UNIDA UNIDO URUBU USADO USINA VAGAS
VALER VALOR VAPOR VARAL VAZIO VELHO VENDA VENTO VERAO VERBO VERDE VERME VERSO VESTE VETOR VIOLA
VIRAR VIRUS VISAR VISOR VISTA VITAL VIVER VOAR VOGAL VOLTA VOTAR XAMPU ZEBRA ZELAR ZONAS
`;

let dicionario = new Set();
let palavraSecreta = "";
let categoriaHoje;
let palpites = [];
let terminou = false;
let venceu = false;
let carregado = false;

let dataChave = dataISO();

let estado = {
    dia: "",
    tentativas: [],
    terminou: false,
    venceu: false,
    totalJogos: 0,
    vitorias: 0,
    sequenciaAtual: 0,
    melhorSequencia: 0,
    ultimoDiaConcluido: ""
};

function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

function dataISO(data = new Date()) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function indiceDiario(data, tamanho) {
    const inicio = new Date("2026-01-01T00:00:00Z");
    const atual = new Date(`${data}T00:00:00Z`);
    const dias = Math.floor((atual - inicio) / 86400000);

    return ((dias % tamanho) + tamanho) % tamanho;
}

/* Salva o progresso em cookie, sem usar localStorage. */
function salvarCookie() {
    const expira = new Date(
        Date.now() + 400 * 86400000
    ).toUTCString();

    document.cookie =
        `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(estado))}; expires=${expira}; path=/; SameSite=Lax`;
}

function lerCookie() {
    const prefixo = `${COOKIE_NAME}=`;

    const item = document.cookie
        .split("; ")
        .find(parte => parte.startsWith(prefixo));

    if (!item) return null;

    try {
        return JSON.parse(
            decodeURIComponent(item.slice(prefixo.length))
        );
    } catch {
        return null;
    }
}

function escolherDesafio() {
    const indiceCategoria = indiceDiario(
        dataChave,
        CATEGORIAS.length
    );

    categoriaHoje = CATEGORIAS[indiceCategoria];

    const indicePalavra = indiceDiario(
        dataChave,
        categoriaHoje.palavras.length
    );

    palavraSecreta = normalizar(
        categoriaHoje.palavras[indicePalavra]
    );

    document.getElementById("dataAtual").textContent =
        new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });

    categoriaEl.textContent = categoriaHoje.nome;
    iconeTema.textContent = categoriaHoje.icone;
}

function criarTabuleiro() {
    tabuleiro.innerHTML = "";

    for (let i = 0; i < MAX_TENTATIVAS; i++) {
        const linha = document.createElement("div");
        linha.className = "linha";

        for (let j = 0; j < 5; j++) {
            const celula = document.createElement("div");
            celula.className = "letra";
            linha.appendChild(celula);
        }

        tabuleiro.appendChild(linha);
    }
}

/* Compara as letras, tratando corretamente letras repetidas. */
function avaliarPalpite(palpite) {
    const resposta = palavraSecreta.split("");
    const letras = palpite.split("");
    const cores = Array(5).fill("errada");

    for (let i = 0; i < 5; i++) {
        if (letras[i] === resposta[i]) {
            cores[i] = "correta";
            resposta[i] = null;
            letras[i] = null;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (letras[i] === null) continue;

        const posicao = resposta.indexOf(letras[i]);

        if (posicao !== -1) {
            cores[i] = "presente";
            resposta[posicao] = null;
        }
    }

    return cores;
}

function desenharPalpites() {
    const linhas = tabuleiro.querySelectorAll(".linha");

    palpites.forEach((palpite, indice) => {
        const celulas = linhas[indice].querySelectorAll(".letra");
        const cores = avaliarPalpite(palpite);

        for (let i = 0; i < 5; i++) {
            celulas[i].textContent = palpite[i];
            celulas[i].classList.add(cores[i]);
        }
    });
}

function atualizarEstatisticas() {
    document.getElementById("totalJogos").textContent =
        estado.totalJogos;

    document.getElementById("vitorias").textContent =
        estado.vitorias;

    const porcentagem = estado.totalJogos
        ? Math.round(
            estado.vitorias / estado.totalJogos * 100
        )
        : 0;

    document.getElementById("percentualVitorias").textContent =
        `${porcentagem}%`;

    document.getElementById("sequenciaAtual").textContent =
        estado.sequenciaAtual;

    document.getElementById("melhorSequencia").textContent =
        estado.melhorSequencia;
}

function mostrarResultado() {
    resultadoEl.hidden = false;
    formulario.hidden = true;

    if (venceu) {
        tituloResultado.textContent = "Você conseguiu! 🎉";
        textoResultado.textContent =
            `Você descobriu a palavra em ${palpites.length} de ${MAX_TENTATIVAS} tentativas. A resposta era ${palavraSecreta}.`;
    } else {
        tituloResultado.textContent = "Fim do desafio";
        textoResultado.textContent =
            `A palavra de hoje era ${palavraSecreta}. Amanhã tem outro desafio!`;
    }

    document.getElementById("proximoDesafio").textContent =
        "Volte amanhã para jogar uma nova palavra.";

    atualizarEstatisticas();
}

function concluirPartida(acertou) {
    terminou = true;
    venceu = acertou;

    entrada.disabled = true;
    enviar.disabled = true;

    if (!estado.terminou) {
        estado.totalJogos++;

        if (acertou) {
            estado.vitorias++;

            const ontem = dataISO(
                new Date(Date.now() - 86400000)
            );

            if (estado.ultimoDiaConcluido === ontem) {
                estado.sequenciaAtual++;
            } else {
                estado.sequenciaAtual = 1;
            }

            estado.melhorSequencia = Math.max(
                estado.melhorSequencia,
                estado.sequenciaAtual
            );
        } else {
            estado.sequenciaAtual = 0;
        }

        estado.ultimoDiaConcluido = dataChave;
    }

    estado.dia = dataChave;
    estado.tentativas = [...palpites];
    estado.terminou = true;
    estado.venceu = acertou;

    salvarCookie();

    mensagem.textContent = acertou
        ? "Palavra descoberta!"
        : "As tentativas acabaram.";

    mostrarResultado();
}

function jogar(evento) {
    evento.preventDefault();

    if (terminou || !carregado) return;

    const palpite = normalizar(entrada.value);

    if (!/^[A-Z]{5}$/.test(palpite)) {
        mensagem.textContent =
            "Digite uma palavra com exatamente 5 letras.";
        entrada.focus();
        return;
    }

    if (!dicionario.has(palpite)) {
        mensagem.textContent =
            "Palavra não encontrada no dicionário. Você não perdeu a tentativa.";
        entrada.select();
        return;
    }

    if (palpites.includes(palpite)) {
        mensagem.textContent =
            "Você já usou essa palavra. Tente outra.";
        entrada.select();
        return;
    }

    const linhas = tabuleiro.querySelectorAll(".linha");
    const linha = linhas[palpites.length];
    const celulas = linha.querySelectorAll(".letra");
    const cores = avaliarPalpite(palpite);

    for (let i = 0; i < 5; i++) {
        celulas[i].textContent = palpite[i];
        celulas[i].classList.add(cores[i]);
    }

    palpites.push(palpite);

    estado.dia = dataChave;
    estado.tentativas = [...palpites];
    salvarCookie();

    entrada.value = "";

    if (palpite === palavraSecreta) {
        concluirPartida(true);
        return;
    }

    if (palpites.length >= MAX_TENTATIVAS) {
        concluirPartida(false);
        return;
    }

    mensagem.textContent =
        `Tentativa ${palpites.length} de ${MAX_TENTATIVAS}.`;

    entrada.focus();
}

function carregarEstado() {
    const salvo = lerCookie();

    if (salvo && typeof salvo === "object") {
        estado = { ...estado, ...salvo };
    }

    if (estado.dia === dataChave) {
        palpites = Array.isArray(estado.tentativas)
            ? estado.tentativas
            : [];

        terminou = Boolean(estado.terminou);
        venceu = Boolean(estado.venceu);
    } else {
        palpites = [];
        terminou = false;
        venceu = false;

        estado.dia = dataChave;
        estado.tentativas = [];
        estado.terminou = false;
        estado.venceu = false;

        salvarCookie();
    }

    criarTabuleiro();
    desenharPalpites();

    if (terminou) {
        entrada.disabled = true;
        enviar.disabled = true;
        mostrarResultado();

        mensagem.textContent = venceu
            ? "Você já venceu o desafio de hoje."
            : "Você já concluiu o desafio de hoje.";
    } else {
        formulario.hidden = false;
        resultadoEl.hidden = true;
        entrada.disabled = false;
        enviar.disabled = false;

        mensagem.textContent = palpites.length
            ? `Você já usou ${palpites.length} de ${MAX_TENTATIVAS} tentativas.`
            : "Boa sorte!";
    }

    atualizarEstatisticas();
}

async function carregarDicionario() {
    dicionario = new Set(
        PALAVRAS_RESERVA.trim().split(/\s+/).map(normalizar)
    );

    CATEGORIAS.forEach(categoria => {
        categoria.palavras.forEach(palavra => {
            dicionario.add(normalizar(palavra));
        });
    });

    try {
        mensagem.textContent = "Carregando o dicionário...";

        const resposta = await fetch(
            "https://raw.githubusercontent.com/pythonprobr/palavras/master/palavras.txt"
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o dicionário.");
        }

        const texto = await resposta.text();

        texto
            .split(/\r?\n/)
            .map(normalizar)
            .filter(palavra => /^[A-Z]{5}$/.test(palavra))
            .forEach(palavra => dicionario.add(palavra));

    } catch (erro) {
        console.warn("Dicionário online indisponível.", erro);
    }

    carregado = true;
    carregarEstado();
}

function montarCompartilhamento() {
    const quadrados = palpites.map(palpite => {
        return avaliarPalpite(palpite).map(cor => {
            if (cor === "correta") return "🟩";
            if (cor === "presente") return "🟨";
            return "⬛";
        }).join("");
    }).join("\n");

    const resultado = venceu
        ? palpites.length
        : "X";

    return `Palavra do Dia ${dataChave}
Tema: ${categoriaHoje.nome}
Resultado: ${resultado}/${MAX_TENTATIVAS}

${quadrados}

Jogue também!`;
}

async function copiarResultado() {
    if (!terminou) {
        mensagem.textContent =
            "Termine o desafio para compartilhar seu resultado.";
        return;
    }

    const texto = montarCompartilhamento();

    try {
        await navigator.clipboard.writeText(texto);
        mensagem.textContent = "Resultado copiado!";
    } catch {
        const area = document.createElement("textarea");
        area.value = texto;
        document.body.appendChild(area);
        area.select();

        const copiou = document.execCommand("copy");
        area.remove();

        mensagem.textContent = copiou
            ? "Resultado copiado!"
            : "Não foi possível copiar automaticamente.";
    }
}

async function compartilharResultado() {
    if (!terminou) {
        mensagem.textContent =
            "Termine o desafio para compartilhar seu resultado.";
        return;
    }

    const texto = montarCompartilhamento();

    if (navigator.share) {
        try {
            await navigator.share({
                title: "Palavra do Dia",
                text: texto
            });
            return;
        } catch (erro) {
            if (erro.name === "AbortError") return;
        }
    }

    copiarResultado();
}

formulario.addEventListener("submit", jogar);

document.getElementById("abrirEstatisticas")
    .addEventListener("click", () => {
        painelEstatisticas.hidden = false;
        atualizarEstatisticas();
    });

document.getElementById("fecharEstatisticas")
    .addEventListener("click", () => {
        painelEstatisticas.hidden = true;
    });

document.getElementById("compartilhar")
    .addEventListener("click", compartilharResultado);

document.getElementById("copiar")
    .addEventListener("click", copiarResultado);

escolherDesafio();
carregarDicionario();
