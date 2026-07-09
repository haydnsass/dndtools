import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function normalizeName(name: string) {
    if (!name) return "";
    let clean = name.toLowerCase();
    if (clean.includes(',')) {
        const parts = clean.split(',');
        if (parts.length === 2 && parts[1].trim().startsWith('+')) {
            clean = `${parts[1].trim()} ${parts[0].trim()}`;
        }
    }
    return clean.replace(/\(.*?\)/g, '').trim();
}

function extractDescriptionRaw(entries: any[]): string[] {
    if (!entries) return ["Sem descrição disponível."];
    let paragraphs: string[] = [];
    
    for (const e of entries) {
        if (typeof e === 'string') {
            paragraphs.push(e);
        } else if (e.type === 'entries') {
            if (e.name) paragraphs.push(`**${e.name}**`);
            paragraphs = paragraphs.concat(extractDescriptionRaw(e.entries));
        } else if (e.type === 'list') {
            e.items.forEach((li: any) => {
                if (typeof li === 'string') paragraphs.push(`• ${li}`);
                else if (li.type === 'item') paragraphs.push(`• **${li.name}** ${li.entry}`);
            });
        } else if (e.type === 'table') {
            paragraphs.push("[Tabela Omitida]");
        }
    }
    return paragraphs;
}

function getPrice(item: any, sanePrices: Record<string, number>) {
    const norm = normalizeName(item.name);
    if (sanePrices[norm]) return `${sanePrices[norm]} gp`;
    for (const [key, value] of Object.entries(sanePrices)) {
        if (key.includes(norm) || norm.includes(key)) return `${value} gp (Aprox)`;
    }
    if (item.value) return `${item.value / 100} gp`;
    return "Negociável";
}

function mapDamageType(t: string) {
    const map: any = { 'B': 'Bludgeoning', 'P': 'Piercing', 'S': 'Slashing', 'F': 'Fire', 'C': 'Cold', 'L': 'Lightning', 'T': 'Thunder', 'A': 'Acid', 'O': 'Force', 'N': 'Necrotic', 'R': 'Radiant', 'Y': 'Psychic', 'I': 'Poison' };
    return map[t] || t;
}

function mapProperty(p: string) {
    const map: any = { 'FIN': 'Finesse', 'L': 'Light', 'H': 'Heavy', '2H': 'Two-Handed', 'V': 'Versatile', 'T': 'Thrown', 'A': 'Ammunition', 'LD': 'Loading', 'R': 'Reach', 'S': 'Special' };
    return map[p] || p;
}

function matchCategory(item: any, category: string) {
    if (!category || category === 'any') return true;

    const t = item.type || '';
    const r = item.rarity || 'none';
    const isMundane = r === 'none' || r === 'Unknown';
    const isWondrous = item.wondrous === true || t === 'W';

    const isArma = t === 'M' || t === 'R' || item.weaponCategory;
    const isArmadura = ['HA', 'MA', 'LA', 'S'].includes(t);
    const isConsumivel = ['P', 'SC'].includes(t) || item.name.includes('Potion') || item.name.includes('Scroll');
    const isBugiganga = (['T', 'TG', 'INS'].includes(t) || (t === 'G' && isMundane)) && !item.name.includes('Pack') && !item.name.includes('Kit');
    const isSuprimento = t === 'G' && (item.name.includes('Pack') || item.name.includes('Kit') || item.name.includes('Ration'));

    if (category === 'armas') return isArma;
    if (category === 'armaduras') return isArmadura;
    if (category === 'consumiveis') return isConsumivel;
    if (category === 'bugigangas') return isBugiganga;
    if (category === 'suprimentos') return isSuprimento;
    if (category === 'maravilhosos') return isWondrous && !isConsumivel;

    return false;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const shopsConfig = body.shopsConfig || [];

        const itemsPath = path.join(process.cwd(), 'src', 'data', 'items.json');
        const baseItemsPath = path.join(process.cwd(), 'src', 'data', 'items-base.json');
        const sanePricesPath = path.join(process.cwd(), 'src', 'data', 'sane_prices.json');

        const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'));
        const baseItemsData = JSON.parse(fs.readFileSync(baseItemsPath, 'utf-8'));
        const sanePrices = JSON.parse(fs.readFileSync(sanePricesPath, 'utf-8'));
        
        const allItems = [
            ...(itemsData.item || []), 
            ...(baseItemsData.baseitem || []),
            ...(baseItemsData.item || [])
        ];

        const generatedShops = [];
        
        for (const shopDef of shopsConfig) {
            const shopItems: any[] = [];
            const selectedItemNames = new Set<string>(); // Keep track of unique items in this shop
            
            for (const rule of shopDef.rules) {
                let pool = allItems.filter((i: any) => {
                    if (i.name.includes("Variant")) return false;
                    if (selectedItemNames.has(i.name)) return false; // Prevent duplicates across rules
                    if (shopDef.dmgOnly && !['PHB', 'DMG', 'MM', 'XGE', 'TCE'].includes(i.source)) return false;
                    
                    const itemRarity = i.rarity || 'none';
                    if (rule.rarity !== 'any' && itemRarity !== rule.rarity) return false;
                    if (!matchCategory(i, rule.category)) return false;
                    return true;
                });

                if (pool.length > 0) {
                    for (let i = 0; i < rule.count; i++) {
                        if (pool.length === 0) break; // Break if no more unique items available

                        const randIndex = Math.floor(Math.random() * pool.length);
                        const rawItem = pool[randIndex];
                        
                        pool.splice(randIndex, 1); // Prevent duplicate in same rule
                        selectedItemNames.add(rawItem.name); // Prevent duplicate in subsequent rules
                        
                        let r = rawItem.rarity || 'Mundano';
                        if (r.toLowerCase() === 'none') r = 'Mundano';
                        
                        // Parse modifiers
                        let modifiers = [];
                        if (rawItem.bonusWeapon) modifiers.push(`Weapon Attacks & Damage ${rawItem.bonusWeapon}`);
                        if (rawItem.bonusAc) modifiers.push(`Armor Class ${rawItem.bonusAc}`);
                        if (rawItem.bonusSpellAttack) modifiers.push(`Spell Attacks ${rawItem.bonusSpellAttack}`);

                        // Parse properties
                        let properties = [];
                        if (rawItem.property) {
                            properties = rawItem.property.map((p: string) => mapProperty(p));
                        }

                        // Determine Subtitle/Category
                        let subCat = "Wondrous Item";
                        if (rawItem.weaponCategory) {
                            let typeName = rawItem.type === 'M' ? 'Melee' : (rawItem.type === 'R' ? 'Ranged' : '');
                            let catName = rawItem.weaponCategory.charAt(0).toUpperCase() + rawItem.weaponCategory.slice(1);
                            subCat = `${catName} ${typeName} Weapon`.replace(/\s+/g, ' ').trim();
                        }
                        else if (rawItem.type === 'HA') subCat = 'Heavy Armor';
                        else if (rawItem.type === 'MA') subCat = 'Medium Armor';
                        else if (rawItem.type === 'LA') subCat = 'Light Armor';
                        else if (rawItem.type === 'S') subCat = 'Shield';
                        else if (rawItem.type === 'P') subCat = 'Potion';
                        else if (rawItem.type === 'SC') subCat = 'Scroll';
                        else if (rawItem.type === 'RG') subCat = 'Ring';

                        let attuneString = "";
                        if (rawItem.reqAttune === true) attuneString = " (requires attunement)";
                        else if (typeof rawItem.reqAttune === 'string') attuneString = ` (requires attunement ${rawItem.reqAttune})`;

                        // Parse Armor Class
                        let armorClassStr = null;
                        if (rawItem.ac) {
                            let baseAc = `${rawItem.ac}`;
                            if (rawItem.type === 'LA') baseAc += ' + Dex modifier';
                            if (rawItem.type === 'MA') baseAc += ' + Dex modifier (max 2)';
                            
                            let stealthStr = rawItem.stealth ? ", Disadvantage on Stealth" : "";
                            let strReqStr = rawItem.strength ? `, Requires Str ${rawItem.strength}` : "";
                            
                            armorClassStr = `${baseAc}${stealthStr}${strReqStr}`;
                        }

                        shopItems.push({
                            id: Math.random().toString(36).substring(7),
                            name: rawItem.name,
                            rarity: r,
                            price: getPrice(rawItem, sanePrices),
                            
                            // Mechanical Stats
                            categorySubtitle: `${subCat}, ${r}${attuneString}`,
                            armorClass: armorClassStr,
                            damage: rawItem.dmg1 ? `${rawItem.dmg1}` : null,
                            damageType: rawItem.dmgType ? mapDamageType(rawItem.dmgType) : null,
                            weight: rawItem.weight ? `${rawItem.weight} lb.` : null,
                            modifiers: modifiers.length > 0 ? modifiers.join(", ") : null,
                            properties: properties.length > 0 ? properties.join(", ") : null,
                            
                            descriptionParagraphs: extractDescriptionRaw(rawItem.entries)
                        });
                    }
                }
            }

            generatedShops.push({
                id: shopDef.id,
                name: shopDef.name,
                merchantPersonality: shopDef.merchantPersonality || '',
                items: shopItems
            });
        }

        return NextResponse.json({ shops: generatedShops });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Falha ao gerar lojas.' }, { status: 500 });
    }
}
