import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── 1. Load .env ────────────────────────────────────────────────────────────
const envPath = path.join(ROOT, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Missing .env.local with OPENAI_API_KEY');
  process.exit(1);
}
const OPENAI_KEY = fs.readFileSync(envPath, 'utf-8').match(/OPENAI_API_KEY=(.+)/)[1].trim();

// ─── 2. Load item-translations.ts ────────────────────────────────────────────
function loadItemTranslations() {
  const fp = path.join(ROOT, 'src', 'data', 'item-translations.ts');
  const raw = fs.readFileSync(fp, 'utf-8');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('};');
  let jsonStr = raw.substring(start, end + 1);
  jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1');
  return JSON.parse(jsonStr);
}
const ITEM_TRANSLATIONS = loadItemTranslations();

// ─── 3. Dictionaries ─────────────────────────────────────────────────────────
const PREFIX_MAP = {
  spell: 'magia', skill: 'perícia', item: 'item',
  condition: 'condição', book: 'livro', creature: 'criatura',
  damage: 'dano', dc: 'cd', dice: 'dado', action: 'ação',
  variantrule: 'regra variante', status: 'estado',
  language: 'idioma', race: 'raça', sense: 'sentido',
  hazard: 'perigo', deity: 'divindade',
  itemProperty: 'propriedade de item', quickref: 'referência rápida',
  feat: 'talento', background: 'antecedente',
  disease: 'doença', class: 'classe',
  // formatting – keep as-is
  i: 'i', italic: 'i', b: 'b', '/i': '/i', '/b': '/b',
  note: 'nota', filter: 'filtro', link: 'link', adventure: 'aventura',
  table: 'tabela', hit: 'acerto', atk: 'ataque',
  h: 'acerto', chance: 'chance',
  dice: 'dados',
  item: 'item', itemProperty: 'propriedade do item',
  skill: 'perícia',
};

const CONDITION_TRANSLATIONS = {
  Blinded: 'Cego', Charmed: 'Enfeitiçado', Deafened: 'Surdo',
  Exhaustion: 'Exaustão', Frightened: 'Amedrontado',
  Grappled: 'Agarrado', Incapacitated: 'Incapacitado',
  Invisible: 'Invisível', Paralyzed: 'Paralisado',
  Petrified: 'Petrificado', Poisoned: 'Envenenado',
  Prone: 'Caído', Restrained: 'Contido', Stunned: 'Atordoado',
  Unconscious: 'Inconsciente',
};

const SKILL_TRANSLATIONS = {
  Acrobatics: 'Acrobacia', 'Animal Handling': 'Adestrar Animais',
  Arcana: 'Conhecimento Arcano', Athletics: 'Atletismo',
  Deception: 'Enganação', History: 'História',
  Insight: 'Intuição', Intimidation: 'Intimidação',
  Investigation: 'Investigação', Medicine: 'Medicina',
  Nature: 'Natureza', Perception: 'Percepção',
  Performance: 'Atuação', Persuasion: 'Persuasão',
  Religion: 'Religião', 'Sleight of Hand': 'Prestidigitação',
  Stealth: 'Furtividade', Survival: 'Sobrevivência',
};

const LANGUAGE_TRANSLATIONS = {
  Common: 'Comum', Dwarvish: 'Anão', Elvish: 'Élfico',
  Giant: 'Gigante', Gnomish: 'Gnômico', Goblin: 'Goblin',
  Halfling: 'Halfling', Orc: 'Orc', Abyssal: 'Abissal',
  Celestial: 'Celestial', Draconic: 'Dracônico',
  Deep: 'Profundo', Infernal: 'Infernal', Primordial: 'Primordial',
  Sylvan: 'Sílvano', Undercommon: 'Subcomum',
};

const DAMAGE_TRANSLATIONS = {
  Acid: 'Ácido', Bludgeoning: 'Concussão', Cold: 'Frio',
  Fire: 'Fogo', Force: 'Força', Lightning: 'Relâmpago',
  Necrotic: 'Necrótico', Piercing: 'Perfuração', Poison: 'Veneno',
  Psychic: 'Psíquico', Radiant: 'Radiante', Slashing: 'Corte',
  Thunder: 'Trovão',
};

const CREATURE_TRANSLATIONS = {
  'ape': 'macaco', 'baboon': 'babuíno', 'badger': 'texugo',
  'bat': 'morcego', 'bear': 'urso', 'boar': 'javali',
  'cat': 'gato', 'crab': 'caranguejo', 'crocodile': 'crocodilo',
  'deer': 'cervo', 'dog': 'cachorro', 'dolphin': 'golfinho',
  'eagle': 'águia', 'elephant': 'elefante', 'frog': 'sapo',
  'goat': 'cabra', 'hawk': 'falcão', 'horse': 'cavalo',
  'lion': 'leão', 'lizard': 'lagarto', 'mastiff': 'mastim',
  'monkey': 'macaco', 'octopus': 'polvo', 'owl': 'coruja',
  'panther': 'pantera', 'pig': 'porco', 'rat': 'rato',
  'raven': 'corvo', 'scorpion': 'escorpião', 'shark': 'tubarão',
  'snake': 'cobra', 'spider': 'aranha', 'tiger': 'tigre',
  'vulture': 'urubu', 'wolf': 'lobo', 'owlbear': 'corujurso',
  'veteran': 'veterano', 'bandit': 'bandido', 'guard': 'guarda',
  'noble': 'nobre', 'knight': 'cavaleiro', 'mage': 'mago',
  'priest': 'sacerdote', 'assassin': 'assassino',
  'thug': 'capanga', 'cultist': 'cultista',
  'skeleton': 'esqueleto', 'zombie': 'zumbi',
  'ghost': 'fantasma', 'wraith': 'espectro',
  'goblin': 'goblin', 'hobgoblin': 'hobgoblin', 'bugbear': 'bugbear',
  'orc': 'orc', 'ogre': 'ogro', 'troll': 'troll',
  'giant': 'gigante', 'dragon': 'dragão',
  'earth elemental': 'elemental da terra',
  'fire elemental': 'elemental do fogo',
  'water elemental': 'elemental da água',
  'air elemental': 'elemental do ar',
};

const ACTION_TRANSLATIONS = {
  Attack: 'Atacar', 'Bonus Action': 'Ação Bônus',
  'Dash': 'Correr', 'Disengage': 'Desengajar',
  'Dodge': 'Esquivar', 'Help': 'Ajudar',
  'Hide': 'Esconder', 'Ready': 'Preparar',
  'Search': 'Procurar', 'Use an Object': 'Usar um Objeto',
  'Escape': 'Escapar', 'Grapple': 'Agarrar',
  'Improvised Action': 'Ação Improvisada',
  'Influence': 'Influenciar', 'Magic': 'Magia',
  'Shove': 'Empurrar', 'Study': 'Estudar',
  'Utilize': 'Utilizar',
};

const STATUS_TRANSLATIONS = {
  'exhaustion': 'exaustão',
  'inspired': 'inspirado',
};

const VARIANT_RULE_TRANSLATIONS = {
  'Advantage': 'Vantagem', 'Disadvantage': 'Desvantagem',
  'Bright Light': 'Luz Brilhante', 'Dim Light': 'Luz Fraca',
  'Darkness': 'Escuridão', 'Cover': 'Cobertura',
  'Half Cover': 'Cobertura Parcial',
  'Three-Quarters Cover': 'Cobertura Três Quartos',
  'Total Cover': 'Cobertura Total',
  'Initiative': 'Iniciativa', 'Critical Hit': 'Acerto Crítico',
  'Bonus Action': 'Ação Bônus',
  'Action': 'Ação', 'Reaction': 'Reação',
  'Free Action': 'Ação Livre',
  'Armor Class': 'Classe de Armadura',
  'Difficulty Class': 'Classe de Dificuldade',
  'Speed': 'Deslocamento',
  'Passive Perception': 'Percepção Passiva',
  'Concentration': 'Concentração',
  'Hit Points': 'Pontos de Vida',
  'Saving Throw': 'Teste de Resistência',
  'Skill': 'Perícia', 'Proficiency': 'Proficiência',
  'Expertise': 'Perícia Aprimorada',
  'Training': 'Treinamento',
  'Short Rest': 'Descanso Curto',
  'Long Rest': 'Descanso Longo',
};

// ─── 4. Reference handling ───────────────────────────────────────────────────
const REF_RE = /\{@([a-z/]+(?:\s*[a-zA-Z/]*)) ([^}]+?)\}|\{@([a-z/]+)(?:\s+([^}]+?))?\}/g;
const REF_PARSE_RE = /\{@([a-z/]+(?:\s*[a-zA-Z/]*)) ([^}]+?)\}|\{@([a-z/]+)(?:\s+([^}]+?))?\}/;

function translateRef(prefix, rest) {
  const p = (prefix || '').trim().toLowerCase();
  const r = (rest || '').trim();

  if (p === 'i' || p === '/i' || p === 'b' || p === '/b' || p === 'italic') {
    const mp = PREFIX_MAP[p] || p;
    return mp === p ? `{@${p}${r ? ' ' + r : ''}}` : `{@${mp}${r ? ' ' + r : ''}}`;
  }

  const mappedPrefix = PREFIX_MAP[p] || p;

  if (p === 'skill') return `{@${mappedPrefix} ${SKILL_TRANSLATIONS[r] || r}}`;
  if (p === 'condition') return `{@${mappedPrefix} ${CONDITION_TRANSLATIONS[r] || r}}`;
  if (p === 'language') return `{@${mappedPrefix} ${LANGUAGE_TRANSLATIONS[r] || r}}`;
  if (p === 'damage') return `{@${mappedPrefix} ${DAMAGE_TRANSLATIONS[r] || r}}`;
  if (p === 'action') return `{@${mappedPrefix} ${ACTION_TRANSLATIONS[r] || r}}`;
  if (p === 'status') return `{@${mappedPrefix} ${STATUS_TRANSLATIONS[r.toLowerCase()] || r}}`;

  if (p === 'variantrule' || p === 'variant') {
    const parts = r.split('|').map(s => s.trim());
    parts[0] = VARIANT_RULE_TRANSLATIONS[parts[0]] || parts[0];
    return `{@${mappedPrefix} ${parts.join('|')}}`;
  }

  if (p === 'item') {
    const parts = r.split('|').map(s => s.trim());
    parts[0] = ITEM_TRANSLATIONS[parts[0]] || parts[0];
    return `{@${mappedPrefix} ${parts.join('|')}}`;
  }

  if (p === 'creature') {
    const translated = CREATURE_TRANSLATIONS[r.toLowerCase()] || r.toLowerCase();
    return `{@${mappedPrefix} ${translated}}`;
  }

  if (p === 'spell') {
    const parts = r.split('|').map(s => s.trim());
    return `{@${mappedPrefix} ${parts.join('|')}}`;
  }

  if (p === 'book') {
    const parts = r.split('|').map(s => s.trim());
    const bookMap = {
      "Player's Handbook": 'Manual do Jogador',
      "Dungeon Master's Guide": 'Guia do Mestre',
      "Monster Manual": 'Manual dos Monstros',
      "Xanathar's Guide to Everything": 'Guia de Xanathar para Todas as Coisas',
      "Tasha's Cauldron of Everything": 'Caldeirão de Tudo de Tasha',
      "Mordenkainen's Tome of Foes": 'Tomo de Adversários de Mordenkainen',
      "Volo's Guide to Monsters": 'Guia de Monstros de Volo',
    };
    parts[0] = bookMap[parts[0]] || parts[0];
    return `{@${mappedPrefix} ${parts.join('|')}}`;
  }

  return `{@${mappedPrefix} ${r}}`;
}

function parseAndTranslateRef(refString) {
  const m = refString.match(REF_PARSE_RE);
  if (!m) return refString;
  return translateRef(m[1] || m[3], m[2] || m[4]);
}

function translateRefsInText(text) {
  return text.replace(REF_RE, (match) => parseAndTranslateRef(match));
}

// ─── 5. Recursive entry walker ───────────────────────────────────────────────
function collectTexts(entries, collector, path = []) {
  if (!entries || !Array.isArray(entries)) return;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (typeof e === 'string') {
      collector.push({ path: [...path, i], text: e });
    } else if (e && typeof e === 'object') {
      if (e.name && typeof e.name === 'string') {
        collector.push({ path: [...path, i, '_name'], text: e.name });
      }
      if (e.caption && typeof e.caption === 'string') {
        collector.push({ path: [...path, i, '_caption'], text: e.caption });
      }
      if (e.colLabels && Array.isArray(e.colLabels)) {
        for (let j = 0; j < e.colLabels.length; j++) {
          collector.push({ path: [...path, i, '_colLabels', j], text: e.colLabels[j] });
        }
      }
      if (e.rows && Array.isArray(e.rows)) {
        for (let r = 0; r < e.rows.length; r++) {
          if (Array.isArray(e.rows[r])) {
            for (let c = 0; c < e.rows[r].length; c++) {
              if (typeof e.rows[r][c] === 'string') {
                collector.push({ path: [...path, i, '_rows', r, c], text: e.rows[r][c] });
              }
            }
          }
        }
      }
      if (e.entry && typeof e.entry === 'string') {
        collector.push({ path: [...path, i, '_entry'], text: e.entry });
      }
      if (e.items && Array.isArray(e.items)) {
        for (let j = 0; j < e.items.length; j++) {
          const item = e.items[j];
          if (typeof item === 'string') {
            collector.push({ path: [...path, i, '_items', j], text: item });
          } else if (item && typeof item === 'object') {
            if (item.name && typeof item.name === 'string') {
              collector.push({ path: [...path, i, '_items', j, '_name'], text: item.name });
            }
            if (item.entry && typeof item.entry === 'string') {
              collector.push({ path: [...path, i, '_items', j, '_entry'], text: item.entry });
            }
            if (item.entries && Array.isArray(item.entries)) {
              collectTexts(item.entries, collector, [...path, i, '_items', j, '_entries']);
            }
          }
        }
      }
      if (e.entries && Array.isArray(e.entries)) {
        collectTexts(e.entries, collector, [...path, i, '_entries']);
      }
    }
  }
}

function applyTranslations(entries, translationMap, pathPrefix = []) {
  if (!entries || !Array.isArray(entries)) return entries;
  for (let i = 0; i < entries.length; i++) {
    const base = [...pathPrefix, i];
    const e = entries[i];
    if (typeof e === 'string') {
      const key = JSON.stringify(base);
      if (translationMap[key]) {
        entries[i] = translationMap[key];
      }
    } else if (e && typeof e === 'object') {
      if (e.name && translationMap[JSON.stringify([...base, '_name'])]) {
        e.name = translationMap[JSON.stringify([...base, '_name'])];
      }
      if (e.caption && translationMap[JSON.stringify([...base, '_caption'])]) {
        e.caption = translationMap[JSON.stringify([...base, '_caption'])];
      }
      if (e.colLabels) {
        for (let j = 0; j < e.colLabels.length; j++) {
          const key = JSON.stringify([...base, '_colLabels', j]);
          if (translationMap[key]) e.colLabels[j] = translationMap[key];
        }
      }
      if (e.rows) {
        for (let r = 0; r < e.rows.length; r++) {
          if (Array.isArray(e.rows[r])) {
            for (let c = 0; c < e.rows[r].length; c++) {
              const key = JSON.stringify([...base, '_rows', r, c]);
              if (translationMap[key]) e.rows[r][c] = translationMap[key];
            }
          }
        }
      }
      if (e.entry && translationMap[JSON.stringify([...base, '_entry'])]) {
        e.entry = translationMap[JSON.stringify([...base, '_entry'])];
      }
      if (e.items) {
        for (let j = 0; j < e.items.length; j++) {
          const itemBase = [...base, '_items', j];
          const item = e.items[j];
          if (typeof item === 'string') {
            const key = JSON.stringify(itemBase);
            if (translationMap[key]) e.items[j] = translationMap[key];
          } else if (item && typeof item === 'object') {
            if (item.name && translationMap[JSON.stringify([...itemBase, '_name'])]) {
              item.name = translationMap[JSON.stringify([...itemBase, '_name'])];
            }
            if (item.entry && translationMap[JSON.stringify([...itemBase, '_entry'])]) {
              item.entry = translationMap[JSON.stringify([...itemBase, '_entry'])];
            }
            if (item.entries) {
              applyTranslations(item.entries, translationMap, [...itemBase, '_entries']);
            }
          }
        }
      }
      if (e.entries) {
        applyTranslations(e.entries, translationMap, [...base, '_entries']);
      }
    }
  }
  return entries;
}

// ─── 6. OpenAI translation ───────────────────────────────────────────────────
async function translateWithOpenAI(texts, itemContext) {
  if (texts.length === 0) return {};
  
  const BATCH_SIZE = 30;
  const result = {};
  
  for (let batchStart = 0; batchStart < texts.length; batchStart += BATCH_SIZE) {
    const batch = texts.slice(batchStart, batchStart + BATCH_SIZE);
    
    const numberedInput = batch.map((t, idx) => `[T${idx}] ${t.text}`).join('\n\n');
    
    const prompt = `Traduza os textos a seguir para português brasileiro (PT-BR) no contexto de RPG Dungeons & Dragons 5ª edição.

Contexto do item: ${itemContext}

Regras:
- Preserve COMPLETAMENTE quaisquer tags <<<REF_N>>> exatamente como estão
- Use termos técnicos oficiais do D&D 5e em PT-BR quando aplicável
- Mantenha nomes próprios sem tradução
- Responda APENAS com as traduções numeradas, uma por linha, no formato [TN] tradução

${numberedInput}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errText}`);
    }

    const json = await response.json();
    const content = json.choices[0].message.content;
    
    // Parse numbered translations
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/^\[T(\d+)\]\s*(.*)/);
      if (match) {
        const idx = parseInt(match[1]);
        const translation = match[2].trim();
        const globalIdx = batchStart + idx;
        if (globalIdx < texts.length) {
          result[JSON.stringify(texts[globalIdx].path)] = translation;
        }
      }
    }
    
    console.log(`  Batch ${Math.floor(batchStart / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)} translated`);
  }
  
  return result;
}

// ─── 7. Reference extraction & placeholding ───────────────────────────────────
function extractRefsAndPlacehold(text) {
  const refs = [];
  let placeholderId = 0;
  const result = text.replace(REF_RE, (match) => {
    const translated = parseAndTranslateRef(match);
    refs.push(translated);
    return `<<<REF_${placeholderId++}>>>`;
  });
  return { text: result, refs };
}

function restoreRefs(text, refs) {
  let result = text;
  for (let i = 0; i < refs.length; i++) {
    result = result.replace(`<<<REF_${i}>>>`, () => refs[i]);
  }
  return result;
}

function extractRefsFromTexts(texts) {
  const refsMap = {};
  const cleanMap = {};
  
  for (const t of texts) {
    const { text: clean, refs } = extractRefsAndPlacehold(t.text);
    const key = JSON.stringify(t.path);
    cleanMap[key] = clean;
    if (refs.length > 0) refsMap[key] = refs;
  }
  
  return { cleanMap, refsMap };
}

function restoreRefsInMap(translationMap, refsMap) {
  const result = {};
  for (const [key, translated] of Object.entries(translationMap)) {
    const refs = refsMap[key];
    if (refs && refs.length > 0) {
      let text = translated;
      for (let i = 0; i < refs.length; i++) {
        const translatedRef = translateReference(refs[i], null, null, null, null);
        text = text.replace(`<<<REF_${i}>>>`, () => translatedRef);
      }
      result[key] = text;
    } else {
      result[key] = translated;
    }
  }
  return result;
}

// ─── 8. Process a single item ─────────────────────────────────────────────────
async function processItem(item, itemName, context) {
  const entryField = item.entries || item.additionalEntries;
  if (!entryField || !Array.isArray(entryField)) return;
  
  const collector = [];
  collectTexts(entryField, collector);
  
  if (collector.length === 0) return;
  
  try {
    const { cleanMap, refsMap } = extractRefsFromTexts(collector);
    
    const textsForTranslation = collector.map(t => ({
      ...t,
      text: cleanMap[JSON.stringify(t.path)] || t.text,
    }));
    
    const rawTranslations = await translateWithOpenAI(textsForTranslation, context);
    
    const fullTranslations = restoreRefsInMap(rawTranslations, refsMap);
    
    applyTranslations(entryField, fullTranslations);
  } catch (err) {
    console.error(`  [ERROR] ${itemName}: ${err.message}`);
  }
}

// ─── 9. Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== D&D 5e Item Description Translator ===\n');
  
  // Load files
  const itemsBasePath = path.join(ROOT, 'src', 'data', 'items-base.json');
  const itemsPath = path.join(ROOT, 'src', 'data', 'items.json');
  
  const itemsBase = JSON.parse(fs.readFileSync(itemsBasePath, 'utf-8'));
  const itemsFull = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'));
  
  console.log(`Items Base: ${itemsBase.baseitem.length} items`);
  console.log(`Items Full: ${itemsFull.item.length} items\n`);
  
  // ── 9a. Translate base items ──
  console.log('=== Translating Base Items ===');
  for (let i = 0; i < itemsBase.baseitem.length; i++) {
    const item = itemsBase.baseitem[i];
    const context = `${item.name} (${item.type || 'equipment'}, base item)`;
    console.log(`[${i + 1}/${itemsBase.baseitem.length}] ${item.name}`);
    await processItem(item, item.name, context);
  }
  
  // ── 9b. Translate common items ──
  console.log('\n=== Translating Common Items ===');
  const commonItems = itemsFull.item.filter(it => it.rarity === 'common');
  console.log(`Found ${commonItems.length} common items\n`);
  
  for (let i = 0; i < commonItems.length; i++) {
    const item = commonItems[i];
    const context = `${item.name} (${item.type || 'magic item'}, common)`;
    console.log(`[${i + 1}/${commonItems.length}] ${item.name}`);
    await processItem(item, item.name, context);
  }
  
  // ── 9c. Save ──
  console.log('\n=== Saving translated files ===');
  
  const backup = (fp) => {
    const bak = fp.replace(/\.json$/, '.bak3.json');
    if (!fs.existsSync(bak)) {
      fs.copyFileSync(fp, bak);
      console.log(`  Backup: ${path.basename(bak)}`);
    }
  };
  
  backup(itemsBasePath);
  backup(itemsPath);
  
  fs.writeFileSync(itemsBasePath, JSON.stringify(itemsBase, null, '\t'), 'utf-8');
  fs.writeFileSync(itemsPath, JSON.stringify(itemsFull, null, '\t'), 'utf-8');
  
  console.log('  items-base.json saved');
  console.log('  items.json saved');
  
  console.log('\n=== Done! ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
