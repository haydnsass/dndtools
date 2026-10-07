'use client';

import { useState } from 'react';

// --- TYPES ---
type ShopRule = {
  id: string;
  count: number;
  rarity: string;
  category: string;
  classFilter: string;
};

type ShopDef = {
  id: string;
  name: string;
  merchantPersonality?: string;
  dmgOnly: boolean;
  rules: ShopRule[];
};

type ShopItem = {
  id: string;
  name: string;
  rarity: string;
  price: string;
  
  categorySubtitle: string;
  armorClass: string | null;
  damage: string | null;
  damageType: string | null;
  weight: string | null;
  modifiers: string | null;
  properties: string | null;
  
  descriptionParagraphs: string[];
};

type GeneratedShop = {
  id: string;
  name: string;
  merchantPersonality?: string;
  items: ShopItem[];
};

// --- CONSTANTS ---
const CATEGORIES = [
  { id: 'any', label: '🎲 Qualquer' },
  { id: 'armas', label: '⚔️ Armas' },
  { id: 'armaduras', label: '🛡️ Armaduras' },
  { id: 'consumiveis', label: '🧪 Consumíveis' },
  { id: 'bugigangas', label: '🧭 Bugigangas' },
  { id: 'suprimentos', label: '🎒 Suprimentos' },
  { id: 'maravilhosos', label: '✨ Maravilhosos' },
];

const RARITIES = [
  { id: 'any', label: 'Qualquer' },
  { id: 'none', label: 'Mundano' },
  { id: 'common', label: 'Comum' },
  { id: 'uncommon', label: 'Incomum' },
  { id: 'rare', label: 'Raro' },
  { id: 'very rare', label: 'Muito Raro' },
  { id: 'legendary', label: 'Lendário' },
];

// --- UTILS ---
const SHOP_PREFIXES = ["Atelier", "Empório", "Forja", "Bazar", "Covil", "Mercado", "Tenda", "Taverna", "Armorial", "Relicário", "Santuário", "Câmara", "Caverna", "Refúgio", "Posto", "Barraca", "Salão", "Abadia"];
const SHOP_SUFFIXES = ["do Rum", "das Lâminas", "de Sangue", "do Corvo", "dos Sussurros", "da Meia-Noite", "Esquecido", "de Ferro", "Amaldiçoado", "dos Ossos", "do Dragão", "das Sombras", "de Prata", "do Abismo", "das Cinzas", "dos Renegados", "do Crânio", "das Marés"];

const generateShopName = () => {
  const pre = SHOP_PREFIXES[Math.floor(Math.random() * SHOP_PREFIXES.length)];
  const suf = SHOP_SUFFIXES[Math.floor(Math.random() * SHOP_SUFFIXES.length)];
  return `${pre} ${suf}`;
};

const getBadgeColor = (r: string) => {
  switch (r.toLowerCase()) {
    case 'mundano': case 'none': case 'unknown': return 'bg-neutral-600 text-neutral-200 border-neutral-500';
    case 'common': return 'bg-zinc-600 text-zinc-200 border-zinc-500';
    case 'uncommon': return 'bg-green-900/60 text-green-300 border-green-700/50';
    case 'rare': return 'bg-blue-900/60 text-blue-300 border-blue-700/50';
    case 'very rare': return 'bg-purple-900/60 text-purple-300 border-purple-700/50';
    case 'legendary': return 'bg-orange-900/60 text-orange-300 border-orange-600/50';
    case 'artifact': return 'bg-red-900/60 text-red-300 border-red-700/50';
    default: return 'bg-neutral-700/60 text-neutral-300 border-neutral-600/50';
  }
};

const BadgePill = ({ rarity, label }: { rarity: string, label?: string }) => (
  <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${getBadgeColor(rarity)}`}>
    {label || rarity}
  </span>
);

// --- COMPONENTS ---
function CustomRaritySelect({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = RARITIES.find(r => r.id === value) || RARITIES[0];

  return (
    <div className="relative w-full">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl h-12 px-3 text-left flex items-center justify-between text-neutral-200 focus:border-amber-500 outline-none"
      >
        <span className="flex items-center">
          {selected.id === 'any' ? <span className="text-sm">🎲 Qualquer</span> : <BadgePill rarity={selected.id} label={selected.label} />}
        </span>
        <span className="text-[10px] text-neutral-500 shrink-0 ml-2">▼</span>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 w-full min-w-[140px] bg-neutral-900 border border-neutral-700 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden max-h-60 overflow-y-auto">
          {RARITIES.map(r => (
            <button 
              key={r.id} 
              onClick={() => { onChange(r.id); setOpen(false); }}
              className="w-full flex items-center p-3 hover:bg-neutral-800 text-left transition-colors"
            >
              {r.id === 'any' ? <span className="text-sm text-neutral-200">🎲 Qualquer</span> : <BadgePill rarity={r.id} label={r.label} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomCategorySelect({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = CATEGORIES.find(c => c.id === value) || CATEGORIES[0];

  return (
    <div className="relative w-full">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl h-12 px-3 text-left flex items-center justify-between text-neutral-200 focus:border-amber-500 outline-none"
      >
        <span className="text-sm truncate">{selected.label}</span>
        <span className="text-[10px] text-neutral-500 shrink-0 ml-2">▼</span>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 w-full min-w-[160px] right-0 bg-neutral-900 border border-neutral-700 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden">
          {CATEGORIES.map(c => (
            <button 
              key={c.id} 
              onClick={() => { onChange(c.id); setOpen(false); }}
              className="w-full flex items-center p-3 hover:bg-neutral-800 text-left text-sm text-neutral-200 transition-colors whitespace-nowrap"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// THE EXPANDABLE ITEM CARD
function ExpandableItemCard({ item, merchantPersonality }: { item: ShopItem, merchantPersonality?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [flavorText, setFlavorText] = useState<string | null>(null);
  const [flavorLoading, setFlavorLoading] = useState(false);
  const baseType = item.categorySubtitle.split(',')[0].trim();

  const fetchFlavor = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlavorLoading(true);
    try {
      const res = await fetch('/api/generate-flavor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptType: 'item',
          itemName: item.name,
          itemRarity: item.rarity,
          itemType: item.categorySubtitle,
          merchantPersonality: merchantPersonality || ''
        }),
      });
      const data = await res.json();
      if (data.flavorText) setFlavorText(data.flavorText);
      else setFlavorText("O mercador apenas resmunga, indisposto a comentar sobre esta peça.");
    } catch {
      setFlavorText("O vendedor afasta o item bruscamente. 'Não toque', ele diz.");
    }
    setFlavorLoading(false);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-neutral-600">
      
      {/* RETRACTED HEADER */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-800/80 transition-colors outline-none"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg md:text-xl font-bold text-neutral-200 leading-none">
            {item.name}
          </h3>
          <div className="flex gap-2 items-center flex-wrap mt-1 md:mt-0">
            <BadgePill rarity={item.rarity} />
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border bg-neutral-800 text-neutral-400 border-neutral-700">
              {baseType}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs md:text-sm font-black uppercase px-3 py-1 rounded-lg shadow-sm whitespace-nowrap">
             {item.price}
          </span>
          <span className="text-neutral-500 font-black text-xl w-6 text-center">
             {expanded ? '−' : '+'}
          </span>
        </div>
      </button>

      {/* EXPANDED CONTENT */}
      {expanded && (
        <div className="p-4 bg-neutral-950 border-t border-neutral-800">
            <div className="bg-[#fdf3e2] rounded-md shadow-lg border-2 border-[#d6b785] p-5 md:p-6 text-[#1a1410] font-sans relative">
              
              <div className="absolute top-4 right-4 bg-amber-500 text-amber-950 font-black px-4 py-1 rounded-sm border border-amber-600 shadow-md transform rotate-2 z-10 pointer-events-none whitespace-nowrap">
                {item.price}
              </div>

              <div className="border-b-[3px] border-[#58180D] pb-2 mb-3 pr-24">
                <h3 className="text-2xl md:text-3xl font-serif text-[#58180D] font-bold uppercase tracking-wide leading-none" style={{ fontVariant: 'small-caps' }}>
                  {item.name}
                </h3>
                <p className="text-sm italic text-[#3a2215] font-serif leading-none mt-1">
                  {item.categorySubtitle}
                </p>
              </div>

              {/* FLAVOR TEXT SECTION */}
              <div className="mb-4">
                {flavorText ? (
                  <p className="text-[#3b1c11] italic text-[15px] font-serif border-l-4 border-[#852c17] pl-3 py-1 bg-[#58180D]/5 rounded-r-md">
                    "{flavorText}"
                  </p>
                ) : (
                  <button 
                    onClick={fetchFlavor}
                    disabled={flavorLoading}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-700 bg-amber-500/20 border border-amber-600/30 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
                  >
                    {flavorLoading ? '⏳ O Mercador está falando...' : '✨ Pedir para o Vendedor Mostrar'}
                  </button>
                )}
              </div>

              <div className="text-[15px] space-y-0.5 mb-3 text-[#2a1708]">
                {item.armorClass && <p><strong className="font-bold">Armor Class:</strong> {item.armorClass}</p>}
                {item.damage && <p><strong className="font-bold">Damage:</strong> {item.damage} {item.damageType && `(${item.damageType})`}</p>}
                {item.weight && <p><strong className="font-bold">Weight:</strong> {item.weight}</p>}
                {item.modifiers && <p><strong className="font-bold">Modifiers:</strong> {item.modifiers}</p>}
                {item.properties && <p><strong className="font-bold">Properties:</strong> {item.properties}</p>}
              </div>

              {(item.armorClass || item.damage || item.weight || item.modifiers || item.properties) && (
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#58180D] to-transparent w-full mb-3 opacity-50"></div>
              )}

              <div className="text-base font-serif text-[#2a1708] leading-relaxed space-y-3">
                {item.descriptionParagraphs.map((para, pIdx) => {
                  const formattedPara = para.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="font-bold">{chunk}</strong> : chunk);
                  return <p key={pIdx}>{formattedPara}</p>;
                })}
              </div>
            </div>
        </div>
      )}
    </div>
  );
}

// THE SHOP CARD
function GeneratedShopCard({ shop }: { shop: GeneratedShop }) {
  const [greetingText, setGreetingText] = useState<string | null>(null);
  const [greetingLoading, setGreetingLoading] = useState(false);

  const fetchGreeting = async () => {
    setGreetingLoading(true);
    
    // Generate inventory summary based on shop items
    const rarities = shop.items.map(i => i.rarity.toLowerCase());
    const hasLegendary = rarities.includes('legendary') || rarities.includes('artifact');
    const hasRare = rarities.includes('rare') || rarities.includes('very rare');
    let inventorySummary = "equipamentos mundanos, ferramentas simples e itens comuns";
    if (hasLegendary) inventorySummary = "artefatos míticos e lendários de poder absurdo";
    else if (hasRare) inventorySummary = "itens raros e peças mágicas de alto valor";

    try {
      const res = await fetch('/api/generate-flavor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptType: 'greeting',
          shopName: shop.name,
          merchantPersonality: shop.merchantPersonality || '',
          inventorySummary
        }),
      });
      const data = await res.json();
      if (data.flavorText) setGreetingText(data.flavorText);
      else setGreetingText("O mercador apenas os encara, em silêncio absoluto.");
    } catch {
      setGreetingText("Um vento frio passa pela loja vazia...");
    }
    setGreetingLoading(false);
  };

  return (
    <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* SHOP HEADER */}
      <div className="bg-neutral-900 p-5 md:p-6 border-b border-neutral-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-[family-name:var(--font-cinzel)] font-black text-amber-400 tracking-wider uppercase truncate pr-4">
            {shop.name}
          </h2>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest whitespace-nowrap bg-neutral-950 px-2 py-1 rounded-md border border-neutral-800">
            {shop.items.length} ITENS
          </span>
        </div>

        {/* SHOP GREETING SECTION */}
        <div className="bg-neutral-950/50 rounded-xl p-4 border border-neutral-800/60">
          {greetingText ? (
             <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-900/40 border border-amber-700/50 flex items-center justify-center text-amber-500 shrink-0 mt-1">
                   🗣️
                </div>
                <p className="text-[#a48e7a] italic text-[15px] font-serif leading-relaxed">
                  "{greetingText}"
                </p>
             </div>
          ) : (
            <button 
              onClick={fetchGreeting}
              disabled={greetingLoading}
              className="flex items-center justify-center w-full gap-2 text-sm font-bold uppercase tracking-wider text-amber-600 hover:text-amber-500 bg-neutral-900 border border-neutral-800 hover:border-amber-700/50 rounded-lg px-4 py-3 transition-all disabled:opacity-50"
            >
              {greetingLoading ? '⏳ O Vendedor está se aproximando...' : '✨ Gerar Saudação de Entrada'}
            </button>
          )}
        </div>
      </div>

      {/* SHOP ITEMS */}
      <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[800px] flex-grow custom-scrollbar">
        {shop.items.length === 0 ? (
          <div className="text-center text-neutral-500 py-12 italic">Nenhum item compatível encontrado.</div>
        ) : (
          shop.items.map((item) => (
            <ExpandableItemCard key={item.id} item={item} merchantPersonality={shop.merchantPersonality} />
          ))
        )}
      </div>
    </div>
  );
}


// --- MAIN PAGE ---
export default function Home() {
  const [shopsConfig, setShopsConfig] = useState<ShopDef[]>([
    {
      id: 'shop_1',
      name: generateShopName(),
      dmgOnly: true,
      rules: [ { id: 'r1', count: 3, rarity: 'any', category: 'any', classFilter: 'any' } ]
    }
  ]);
  
  const [generatedShops, setGeneratedShops] = useState<GeneratedShop[]>([]);
  const [openShops, setOpenShops] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // BUILDER ACTIONS
  const addShop = () => {
    const newId = `shop_${Date.now()}`;
    setShopsConfig(prev => [...prev, {
      id: newId,
      name: generateShopName(),
      dmgOnly: true,
      rules: [ { id: `r_${Date.now()}`, count: 3, rarity: 'any', category: 'any', classFilter: 'any' } ]
    }]);
  };

  const removeShop = (shopId: string) => {
    setShopsConfig(prev => prev.filter(s => s.id !== shopId));
  };

  const updateShopName = (shopId: string, newName: string) => {
    setShopsConfig(prev => prev.map(s => s.id === shopId ? { ...s, name: newName } : s));
  };

  const updateShopMerchant = (shopId: string, newMerchant: string) => {
    setShopsConfig(prev => prev.map(s => s.id === shopId ? { ...s, merchantPersonality: newMerchant } : s));
  };

  const updateShopDmg = (shopId: string, val: boolean) => {
    setShopsConfig(prev => prev.map(s => s.id === shopId ? { ...s, dmgOnly: val } : s));
  };

  const addRule = (shopId: string) => {
    setShopsConfig(prev => prev.map(s => {
      if (s.id === shopId) {
        return { ...s, rules: [...s.rules, { id: `r_${Date.now()}`, count: 1, rarity: 'any', category: 'any', classFilter: 'any' }] };
      }
      return s;
    }));
  };

  const removeRule = (shopId: string, ruleId: string) => {
    setShopsConfig(prev => prev.map(s => {
      if (s.id === shopId) {
        return { ...s, rules: s.rules.filter(r => r.id !== ruleId) };
      }
      return s;
    }));
  };

  const updateRule = (shopId: string, ruleId: string, field: keyof ShopRule, val: any) => {
    setShopsConfig(prev => prev.map(s => {
      if (s.id === shopId) {
        return { ...s, rules: s.rules.map(r => r.id === ruleId ? { ...r, [field]: val } : r) };
      }
      return s;
    }));
  };

  const generateShops = async () => {
    setLoading(true);
    setError('');
    setGeneratedShops([]);
    try {
      const res = await fetch('/api/generate-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopsConfig }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setGeneratedShops(data.shops);
      }
    } catch (err) {
      setError('Erro de conexão ao gerar loja.');
    }
    setLoading(false);
  };

  const toggleShop = (id: string) => setOpenShops(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <main className="min-h-screen bg-neutral-950 text-gray-100 p-4 md:p-8 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <header className="text-center space-y-3 mb-12">
          <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-cinzel)] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500 uppercase">
            DNDTOOLS
          </h1>
          <p className="text-neutral-400 text-lg font-light tracking-wider">Gerador open source de lojas e inventários para mestres de RPG</p>
        </header>

        {/* BUILDER SECTION (STACKED SINGLE COLUMN, SMALLER WIDTH) */}
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {shopsConfig.map((shop) => (
            <section key={shop.id} className="bg-neutral-900/40 p-5 md:p-6 rounded-2xl shadow-xl border border-neutral-800/80">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-neutral-800">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <input 
                    type="text" 
                    value={shop.name}
                    onChange={(e) => updateShopName(shop.id, e.target.value)}
                    className="bg-transparent text-2xl font-[family-name:var(--font-cinzel)] font-black text-amber-400 focus:outline-none focus:border-b border-amber-500/50 w-full sm:w-auto uppercase"
                  />
                  <input 
                    type="text" 
                    placeholder="Vendedor (ex: Goblin Pirata)"
                    value={shop.merchantPersonality || ''}
                    onChange={(e) => updateShopMerchant(shop.id, e.target.value)}
                    className="bg-neutral-950/50 text-neutral-400 text-sm italic rounded-md px-2 py-1 border border-neutral-800 focus:outline-none focus:border-amber-500/50 w-full"
                  />
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={shop.dmgOnly} 
                      onChange={(e) => updateShopDmg(shop.id, e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 text-amber-500 bg-neutral-950 shrink-0"
                    />
                    <span className="text-xs font-bold text-neutral-400 uppercase">Apenas Livros Base</span>
                  </label>
                  
                  {shopsConfig.length > 1 && (
                    <button onClick={() => removeShop(shop.id)} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase transition-colors shrink-0">
                      ✕ Excluir
                    </button>
                  )}
                </div>
              </div>

              {/* RULES ROWS */}
              <div className="space-y-3">
                {shop.rules.map((rule) => (
                  <div key={rule.id} className="flex flex-wrap md:flex-nowrap gap-3 items-end bg-neutral-950/50 p-3 rounded-xl border border-neutral-800">
                    
                    <div className="w-[70px] shrink-0">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Qtd</label>
                      <input 
                        type="number" 
                        value={rule.count} 
                        onChange={(e) => updateRule(shop.id, rule.id, 'count', parseInt(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl h-12 p-3 text-center text-neutral-200 focus:border-amber-500 outline-none"
                        min={1} max={50}
                      />
                    </div>

                    <div className="w-[calc(50%-45px)] md:w-40 shrink-0">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Raridade</label>
                      <CustomRaritySelect value={rule.rarity} onChange={(v) => updateRule(shop.id, rule.id, 'rarity', v)} />
                    </div>
                    
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Classe Foco</label>
                      <select 
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl h-12 p-3 text-sm text-neutral-200 focus:border-amber-500 outline-none"
                        value={rule.classFilter}
                        onChange={(e) => updateRule(shop.id, rule.id, 'classFilter', e.target.value)}
                      >
                        <option value="any">🎲 Qualquer</option>
                        <option value="artificer">Artífice</option>
                        <option value="barbarian">Bárbaro</option>
                        <option value="bard">Bardo</option>
                        <option value="cleric">Clérigo</option>
                        <option value="druid">Druida</option>
                        <option value="fighter">Guerreiro</option>
                        <option value="rogue">Ladino</option>
                        <option value="wizard">Mago</option>
                        <option value="monk">Monge</option>
                        <option value="paladin">Paladino</option>
                        <option value="ranger">Patrulheiro</option>
                        <option value="warlock">Bruxo</option>
                        <option value="sorcerer">Feiticeiro</option>
                      </select>
                    </div>

                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Categoria</label>
                      <CustomCategorySelect value={rule.category} onChange={(v) => updateRule(shop.id, rule.id, 'category', v)} />
                    </div>

                    <div className="shrink-0 flex items-center h-12">
                      {shop.rules.length > 1 && (
                        <button onClick={() => removeRule(shop.id, rule.id)} className="text-neutral-600 hover:text-red-500 px-3 text-xl font-bold transition-colors">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button 
                  onClick={() => addRule(shop.id)}
                  className="w-full sm:w-auto text-amber-500 hover:text-amber-400 text-xs font-bold border border-dashed border-amber-500/30 hover:border-amber-500/80 rounded-xl px-5 py-2.5 transition-colors uppercase tracking-wider"
                >
                  + Adicionar Regra
                </button>
              </div>

            </section>
          ))}
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={addShop}
              className="flex-1 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 font-bold py-4 rounded-xl transition-all shadow-lg uppercase tracking-wide text-sm"
            >
              + Criar Mais Lojas
            </button>
            
            <button 
              onClick={generateShops} 
              disabled={loading}
              className="flex-[2] bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-black tracking-widest uppercase py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] transform transition-all active:scale-[0.99] disabled:opacity-50 text-sm"
            >
              {loading ? 'Extraindo do Compêndio...' : '✨ Gerar Lojas'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-xl text-center font-bold">
              {error}
            </div>
          )}
        </div>

        {/* RESULTS - 2 COLUMNS */}
        {generatedShops.length > 0 && (
          <section className="space-y-8 pt-12 border-t border-neutral-800">
            <h2 className="text-3xl font-[family-name:var(--font-cinzel)] font-black text-neutral-300 text-center uppercase tracking-widest mb-10">
              Lojas Geradas
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {generatedShops.map((shop) => (
                <GeneratedShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </section>
        )}

        <footer className="border-t border-neutral-800 pt-6 text-center text-xs leading-relaxed text-neutral-500">
          <p>O catálogo distribuído usa material do SRD 5.1 sob CC-BY-4.0. DnDTools é um projeto independente, sem afiliação ou endosso da Wizards of the Coast.</p>
          <a
            className="mt-2 inline-block text-amber-600 hover:text-amber-500 transition-colors"
            href="https://github.com/haydnsass/dndtools"
            target="_blank"
            rel="noreferrer"
          >
            Código-fonte e atribuição
          </a>
        </footer>

      </div>
    </main>
  );
}
