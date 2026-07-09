import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { promptType, shopName, itemName, itemRarity, itemType, merchantPersonality, inventorySummary } = body;

    const merchantContext = merchantPersonality 
      ? `Sua personalidade: ${merchantPersonality}.` 
      : `Sua personalidade: Um comerciante misterioso e calculista de um cenário de fantasia sombria.`;

    let prompt = "";

    if (promptType === 'greeting') {
      prompt = `
Você é um mestre de RPG (Dungeon Master) no mundo de D&D chamado "Fallen" (um cenário de dark fantasy). 
${merchantContext}
${inventorySummary ? `\nContexto da Loja: Esta loja vende principalmente ${inventorySummary}. Adapte a aura e a imponência do vendedor a esse nível de mercadoria.` : ''}

Sua loja se chama "${shopName || 'Loja Misteriosa'}".
Aventureiros acabaram de entrar no seu estabelecimento. 
Sua tarefa é criar a cena de introdução deste NPC seguindo **ESTRITAMENTE** as regras abaixo:

**Regra 1 (Aparência Direta):** PRIMEIRO, descreva as características físicas do vendedor de forma DIRETA e OBJETIVA, sem floreios exagerados e com vocabulário simples. Apenas mostre como ele é fisicamente (com base na personalidade passada).
**Regra 2 (Aproximação Narrativa no Presente):** DEPOIS, descreva ele chegando até os aventureiros. Toda a narração DEVE ser feita no tempo PRESENTE (ex: "ele se move até vocês", "ele bate na mesa").
**Regra 3 (Nome Obrigatório e Fala):** O **NOME DO NPC É EXTREMAMENTE IMPORTANTE**. A narrativa DEVE incluir o nome dele. Imediatamente após a aproximação, ele deve dizer uma frase de saudação forte e condizente com sua persona.

**DIRETRIZ DE ESTILO:** Utilize palavras menos "pomposas" e uma linguagem mais direta. Mantenha a narrativa no tempo PRESENTE. Escreva tudo em 1 único parágrafo fluido. A parte narrativa deve estar em terceira pessoa, e a fala do personagem entre aspas.`;

    } else {
      if (!itemName || !itemRarity || !itemType) {
        return NextResponse.json({ error: 'Missing required item details.' }, { status: 400 });
      }

      prompt = `
Você é um mestre de RPG (Dungeon Master) no mundo de D&D chamado "Fallen" (um cenário de dark fantasy). 
${merchantContext}

Você acabou de narrar a introdução deste NPC. Agora, um dos jogadores demonstrou interesse no seguinte item:
- Item: ${itemName}
- Tipo: ${itemType}
- Raridade: ${itemRarity}

Sua tarefa é narrar a cena do vendedor interagindo com a peça seguindo estas regras:
1. PRIMEIRO, descreva fisicamente o vendedor indo buscar ou manuseando o item no tempo PRESENTE (ex: "ele pega a espada"). Em seguida, descreva a aparência da peça de forma direta e sem linguagem pomposa. A descrição visual do item deve condizer com sua raridade (mundanos têm arranhões, raros têm detalhes exóticos). Não mencione atributos numéricos do jogo.
2. DEPOIS, o vendedor deve dizer uma fala direta de vendas para o jogador, mantendo estritamente sua persona.

**DIRETRIZ DE ESTILO:** Utilize palavras menos "pomposas" e uma linguagem mais direta. Mantenha a narrativa no tempo PRESENTE. O NOME do NPC deve aparecer na cena. Escreva em 1 parágrafo bem amarrado. A parte narrativa em terceira pessoa, e a fala do personagem entre aspas.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um mestre contador de histórias focado em dark fantasy." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 350,
    });

    const flavorText = response.choices[0]?.message?.content?.trim();

    return NextResponse.json({ flavorText });

  } catch (error) {
    console.error('Error generating flavor text:', error);
    return NextResponse.json({ error: 'Falha ao consultar os oráculos de Fallen.' }, { status: 500 });
  }
}
