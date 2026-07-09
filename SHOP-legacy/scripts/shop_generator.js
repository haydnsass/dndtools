import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper para limpar nomes de itens para bater as chaves
function normalizeName(name) {
    if (!name) return "";
    let clean = name.toLowerCase();
    
    // 5etools costuma usar "Armor, +1", o Sane Prices usa "+1 Armor". Vamos tentar lidar com isso:
    if (clean.includes(',')) {
        const parts = clean.split(',');
        if (parts.length === 2 && parts[1].trim().startsWith('+')) {
            clean = `${parts[1].trim()} ${parts[0].trim()}`;
        }
    }
    
    // Remove parênteses e limpa
    clean = clean.replace(/\(.*?\)/g, '').trim();
    return clean;
}

function loadData() {
    const itemsPath = path.join(__dirname, '..', '..', '5etools-src', 'data', 'items.json');
    const sanePricesPath = path.join(__dirname, '..', 'data', 'sane_prices.json');

    const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'));
    const sanePrices = JSON.parse(fs.readFileSync(sanePricesPath, 'utf-8'));

    return { items: itemsData.item, sanePrices };
}

function extractDescription(entries) {
    if (!entries) return "Sem descrição disponível.";
    let desc = "";
    for (const e of entries) {
        if (typeof e === 'string') {
            desc += e + "\n";
        } else if (e.type === 'entries') {
            desc += extractDescription(e.entries) + "\n";
        }
    }
    return desc.trim();
}

function getPrice(item, sanePrices) {
    const norm = normalizeName(item.name);
    // Tenta encontrar no Sane Prices
    if (sanePrices[norm]) {
        return `${sanePrices[norm]} gp (Sane Price)`;
    }
    
    // Tenta busca parcial se não achar
    for (const [key, value] of Object.entries(sanePrices)) {
        if (key.includes(norm) || norm.includes(key)) {
            return `${value} gp (Sane Price - Aproximado)`;
        }
    }

    // Fallback para o valor original do 5etools se existir
    if (item.value) {
        return `${item.value / 100} gp (Livro Base)`;
    }

    return "Preço não listado (Negocie com o Mestre)";
}

function generateFlavor(itemName, rarity) {
    const adjectives = ["poeirento(a)", "impecável", "misterioso(a)", "brilhante", "antigo(a)"];
    const adv = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `*O mercador tira debaixo do balcão um(a) ${itemName} de aparência ${adv}. Ele diz que é de raridade ${rarity}...*`;
}

function generateShop(options = {}) {
    const { items, sanePrices } = loadData();
    const count = options.count || 5;

    let pool = items.filter(i => {
        // Ignora itens mágicos base que são apenas variações genéricas
        if (i.name.includes("Variant")) return false;
        if (options.rarity && i.rarity !== options.rarity) return false;
        return true;
    });

    if (pool.length === 0) {
        console.log("Nenhum item encontrado com esses filtros!");
        return;
    }

    // Sortear
    const shopItems = [];
    for (let i = 0; i < count; i++) {
        const randIndex = Math.floor(Math.random() * pool.length);
        shopItems.push(pool[randIndex]);
    }

    // Gerar Markdown
    let md = `# Loja de Itens Gerada\n\n`;
    md += `*Bem-vindo viajante! Temos coisas interessantes hoje...*\n\n`;

    shopItems.forEach(item => {
        const price = getPrice(item, sanePrices);
        const desc = extractDescription(item.entries);
        const rarity = item.rarity || 'Desconhecida';
        
        md += `## ${item.name} (${rarity})\n`;
        md += `**Preço:** ${price}\n\n`;
        md += `${generateFlavor(item.name, rarity)}\n\n`;
        md += `> ${desc.substring(0, 300)}... *(Ver 5etools para completo)*\n\n`;
        md += `---\n\n`;
    });

    const outDir = path.join(__dirname, '..', 'shops');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }
    const outFile = path.join(outDir, `Shop_${Date.now()}.md`);
    fs.writeFileSync(outFile, md);
    console.log(`Loja gerada com sucesso: ${outFile}`);
}

// Execução Básica
const args = process.argv.slice(2);
let count = 5;
let rarity = null;

args.forEach((arg, idx) => {
    if (arg === '--count') count = parseInt(args[idx + 1]);
    if (arg === '--rarity') rarity = args[idx + 1];
});

generateShop({ count, rarity });
