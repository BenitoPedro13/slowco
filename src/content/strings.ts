// Public strings by ID, verbatim from docs/05-CONTENT.md. Only IDs in use are listed; add new
// ones from 05 as tasks need them. Gate `lançamento`: renders in previews, needs the client's
// approval before launch (05 §0, 08 #16).

export const strings = {
  // 05 §1 Global
  "G-NOME": "Slow Company",
  "G-WORDMARK": "SLOW",
  "G-PULAR": "Pular para o conteúdo",
  "G-TEMA": "Tema",
  "G-TEMA-PRETO": "Preto",
  "G-TEMA-BRANCO": "Branco",
  "G-TEMA-DROP": "Cor do drop",
  "G-INSTAGRAM": "@slow_tm",
  "G-INSTAGRAM-ARIA": "Slow Company no Instagram, @slow_tm (abre em nova aba)",
  // Appended (sr-only) to links that leave the site in a new tab: Instagram, WhatsApp.
  "G-NOVA-ABA": " (abre em nova aba)",
  "G-LEGAL-1": "SLOW CREATIVE STUDIO AND INDUSTRY APPAREL",
  "G-LEGAL-2": "FOR PROFESSIONAL USE ONLY. ALL RIGHTS RESERVED.",
  "G-NAV-DROPS": "DROPS",
  "G-NAV-ARQUIVO": "ARQUIVO",
  "G-NAV-CONTATO": "CONTATO",
  "G-NAV": "Navegação principal",
  "G-MENU": "MENU",
  "G-FECHAR": "FECHAR",
  "G-SACOLA": "SACOLA",
  "G-SACOLA-ARIA": "Sacola, {n} itens",
  "G-SACOLA-ARIA-1": "Sacola, 1 item",
  "G-SACOLA-ARIA-0": "Sacola vazia",

  // 05 §6 Bag
  "B-TITULO": "SACOLA",
  "B-VAZIA": "Sua sacola está vazia.",
  "B-VER-DROP": "VER O DROP ATUAL",
  "B-QTD": "Quantidade",
  "B-MAIS": "Aumentar quantidade",
  "B-MENOS": "Diminuir quantidade",
  "B-REMOVER": "Remover",
  "B-NOME": "Seu nome (opcional)",
  "B-NOTA":
    "O pedido é confirmado pelo WhatsApp: disponibilidade, pagamento e entrega são combinados na conversa.",
  "B-ENVIAR": "PEDIR NO WHATSAPP",
  "B-ADICIONADO": "{produto}, tamanho {tamanho}, adicionado à sacola. Sacola com {n} itens.",
  "B-ADICIONADO-1": "{produto}, tamanho {tamanho}, adicionado à sacola. Sacola com 1 item.",
  "B-REMOVIDO": "{produto} removido da sacola.",
  "B-SEM-NUMERO": "Os pedidos pelo site ainda não estão abertos.",
  "OG-HOME-ALT": "Slow Company: das ruas para o mundo",
  "OG-ARQUIVO-ALT": "Arquivo de drops da Slow Company",
  "OG-CONTATO-ALT": "Contato da Slow Company",
  "OG-SACOLA-ALT": "Sacola da Slow Company",
  "OG-DROP-ALT": "Drop da Slow Company",
  "OG-PRODUTO-ALT": "Peça da Slow Company",
  "OG-DROP": "DROP",
  "DEV-WHATSAPP": "Desenvolvimento: configure NEXT_PUBLIC_WHATSAPP_NUMBER no .env.local com o número da loja (55 + DDD + número, só dígitos) e reinicie pnpm dev.",
  "B-TAMANHO": "Tamanho {tamanho}",

  // 05 §5 Product
  "P-TAMANHO": "Tamanho",
  "P-TAM-ESGOTADO": "{tamanho}, esgotado",
  "P-ESCOLHA": "Escolha um tamanho.",
  "P-ADICIONAR": "ADICIONAR À SACOLA",
  "P-PEDIR-UMA": "PEDIR SÓ ESTA PEÇA",
  "P-EM-BREVE": "EM BREVE",
  "P-ESGOTADO": "ESGOTADO",
  "P-NAO-VENDA": "NOT FOR SALE",
  "P-DO-DROP": "Do drop",

  // 05 §3 Drop
  "D-EM-BREVE": "EM BREVE",
  "D-DISPONIVEL": "DISPONÍVEL AGORA",
  "D-ESGOTADO": "ESGOTADO",
  "D-PAUSAR": "PAUSAR CONTAGEM",
  "D-RETOMAR": "RETOMAR CONTAGEM",
  "D-CONTAGEM-ARIA": "Faltam {d} dias, {h} horas e {m} minutos",
  "D-LIMITADO": "PEÇAS LIMITADAS",
  "D-SEM-REPOSICAO": "SEM REPOSIÇÃO",

  // 05 §2 Home
  "H-H1": "Slow Company",
  "H-LINHA": "DAS RUAS PARA O MUNDO",
  "H-DROP-ATUAL": "DROP ATUAL",
  "H-AINDA": "AINDA DISPONÍVEL",
  "H-SLOW-MODE": "SEJA BEM-VINDO AO SLOW MODE",

  // 05 §4 Archive
  "A-TITULO": "ARQUIVO",
  "A-AINDA": "AINDA DISPONÍVEL",
  "A-VER-DROP": "VER O DROP",

  // 05 §7 Contact and 404
  "C-TITULO": "CONTATO",
  "C-WHATSAPP": "FALAR NO WHATSAPP",
  "C-ORIGEM": "De São Gonçalo pro mundo",
  "X-TITULO": "PÁGINA NÃO ENCONTRADA",
  "X-VOLTAR": "VOLTAR PARA O INÍCIO",

  // 05 §8 WhatsApp message (gate: lançamento + 08 #4, #5)
  "WA-ABERTURA": "Olá, Slow Company. Quero fazer um pedido pelo site:",
  "WA-ABERTURA-UMA": "Olá, Slow Company. Quero pedir esta peça pelo site:",
  "WA-ITEM": "- {produto} ({drop}) / tamanho {tamanho} / {quantidade} un.",
  "WA-ITEM-PRECO": " / {preco}",
  "WA-NOME": "Nome: {nome}",
  "WA-FECHO": "Pode confirmar a disponibilidade?",

  // 05 §1 Global, placeholder notice (08 #22)
  "G-EXEMPLO-CURTO": "DADOS DE EXEMPLO · CATÁLOGO FICTÍCIO",
  "G-EXEMPLO":
    "DADOS DE EXEMPLO: drops, peças, tamanhos e datas deste site são fictícios até o catálogo da Slow Company chegar.",

  "B-PREVIA": "MENSAGEM QUE SERÁ ABERTA NO WHATSAPP",
  "B-VER-SACOLA": "VER SACOLA",

  // Archive posters (B6).
  "A-DISPONIVEL": "DISPONÍVEL",
  "A-TODOS": "TODOS",
  "A-FILTRAR": "Filtrar drops",
  "A-CONTAGEM": "{n} peças ainda disponíveis",
  "A-SEM-RESULTADOS": "Nenhum drop neste filtro.",

  // Product editorial layout (B7); catalogue facts remain blocked.
  "P-GALERIA": "Fotos da peça",
  "P-AMPLIAR": "Ampliar foto {n}",
  "P-VER-FOTO": "Ver foto {n}",
  "P-FOTO-ANTERIOR": "ANTERIOR",
  "P-FOTO-PROXIMA": "PRÓXIMA",
  "P-DADOS-PENDENTES": "A CONFIRMAR COM A SLOW",
  "P-DADOS-CAMPOS": "PREÇO / MEDIDAS / TECIDO",
  "P-MESMO-DROP": "DO MESMO DROP",

  // Design moments (docs/tasks/TASK-M*.md)
  "M-PULAR-ENTRADA": "PULAR",
  "M-PAUSAR-GLOBO": "PAUSAR GLOBO",
  "M-GIRAR-GLOBO": "GIRAR GLOBO",
  "M-PAUSAR-FAIXA": "PAUSAR FAIXA",
  "M-RODAR-FAIXA": "RODAR FAIXA",
  "M-FAIXA": "SEJA BEM-VINDO AO SLOW MODE / DAS RUAS PARA O MUNDO /",

  // 04 §6 cursor label (decorative, aria-hidden)
  "CUR-VER": "VER",

  // 05 §10 Metadata
  "M-TITULO": "Slow Company",
  "M-TITULO-MODELO": "%s · Slow Company",
  "M-DESCRICAO":
    "Slow Company: streetwear de São Gonçalo, RJ. Drops, arquivo e pedidos pelo WhatsApp.",
} as const;

export const INSTAGRAM_URL = "https://www.instagram.com/slow_tm/";
