import React, { useId, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ArrowRight, Check, Clock, FileImage, MapPin, Menu, SlidersHorizontal, X } from 'lucide-react';

const Instagram = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

/* ---------- DATA (prices match the printed menu card) ---------- */
const PACK_SIZES = [
  { id: 'pop', label: 'Waffle Pop', shortLabel: 'Pop', pieces: '1 Belgian Waffle', description: 'Single crisp waffle served hot' },
  { id: 'duo', label: 'Waffle Duo', shortLabel: 'Duo', pieces: '2 Belgian Waffles', description: 'Two warm waffles pressed fresh for sharing' },
  { id: 'family', label: 'Family Feast', shortLabel: 'Family', pieces: '4 Belgian Waffles', description: 'Four-piece party box loaded with melted toppings' },
];

const BATTER_UPGRADES = [
  {
    id: 'golden', name: 'Crisp Golden Base', shortName: 'Golden',
    subtitle: 'Traditional aerated Belgian vanilla batter baked golden & airy',
    swatch: '#E59735', crust: '#9E4E0B', batter: '#E59735',
    filter: 'none',
    upcharge: { pop: 0, duo: 0, family: 0 },
    badgeText: 'Included by Default',
  },
  {
    id: 'red-velvet', name: 'Red Velvet Base', shortName: 'Red Velvet',
    subtitle: 'Velvety crimson cocoa batter with subtle buttermilk warmth',
    swatch: '#A62335', crust: '#5B0D18', batter: '#A62335',
    filter: 'hue-rotate(-40deg) saturate(1.5) brightness(0.72)',
    upcharge: { pop: 10, duo: 20, family: 30 },
    badgeText: '+₹10 Pop · +₹20 Duo · +₹30 Family',
  },
  {
    id: 'fudge-brownie', name: 'Fudge Brownie Base', shortName: 'Brownie',
    subtitle: 'Deep double-cocoa batter that crisps outside and stays fudgy inside',
    swatch: '#4A2616', crust: '#1F0D05', batter: '#4A2616',
    filter: 'sepia(0.7) saturate(1.1) brightness(0.38)',
    upcharge: { pop: 20, duo: 30, family: 50 },
    badgeText: '+₹20 Pop · +₹30 Duo · +₹50 Family',
  },
];

const WAFFLE_MENU = [
  {
    id: 'classic-dark', name: 'Dark Chocolate Melt', category: 'classic', categoryLabel: 'Classic Chocolates',
    tagline: '54% Belgian Dark Couverture', description: 'Warm Belgian waffle drenched in glossy, bittersweet dark chocolate.',
    prices: { pop: 49, duo: 90, family: 170 }, toppingStyle: 'dark', featuredTag: 'Cart Favorite'
  },
  {
    id: 'classic-milk', name: 'Milk Chocolate Silk', category: 'classic', categoryLabel: 'Classic Chocolates',
    tagline: 'Creamy Belgian Milk Chocolate', description: 'Smooth, velvety milk chocolate poured generously into every crisp pocket.',
    prices: { pop: 49, duo: 90, family: 170 }, toppingStyle: 'milk'
  },
  {
    id: 'classic-white', name: 'White Chocolate Velvet', category: 'classic', categoryLabel: 'Classic Chocolates',
    tagline: 'Ivory Cocoa Butter Glaze', description: 'Sweet caramelized ivory chocolate drizzle with delicate vanilla aroma.',
    prices: { pop: 49, duo: 90, family: 170 }, toppingStyle: 'white'
  },
  {
    id: 'signature-nutella', name: 'Nutella Hazelnut', category: 'signature', categoryLabel: 'Signature Specials',
    tagline: 'Roasted Hazelnut Cocoa Spread', description: 'Thick warm Nutella ribboned across crisp golden grooves with toasted crunch.',
    prices: { pop: 69, duo: 129, family: 239 }, toppingStyle: 'nutella', featuredTag: 'Bestseller'
  },
  {
    id: 'signature-biscoff', name: 'Lotus Biscoff', category: 'signature', categoryLabel: 'Signature Specials',
    tagline: 'Speculoos Cookie Butter & Crumble', description: 'Spiced caramelized Biscoff spread finished with crushed speculoos biscuit.',
    prices: { pop: 69, duo: 129, family: 239 }, toppingStyle: 'biscoff', featuredTag: 'Chef Pick'
  },
  {
    id: 'signature-oreo', name: 'Oreo Double Cream', category: 'signature', categoryLabel: 'Signature Specials',
    tagline: 'Crushed Cocoa Wafers & Cream', description: 'White & milk chocolate drizzle topped with crunchy dark Oreo cookie crumbles.',
    prices: { pop: 69, duo: 129, family: 239 }, toppingStyle: 'oreo'
  },
  {
    id: 'signature-kitkat', name: 'KitKat Crisp Snap', category: 'signature', categoryLabel: 'Signature Specials',
    tagline: 'Wafer Fingers & Milk Chocolate', description: 'Silky milk chocolate layered with crisp wafer bits and KitKat chunks.',
    prices: { pop: 69, duo: 129, family: 239 }, toppingStyle: 'kitkat'
  },
];

const HERO_PRESETS = [
  { label: 'Dark Chocolate', waffleId: 'classic-dark', batterId: 'golden' },
  { label: 'Nutella', waffleId: 'signature-nutella', batterId: 'golden' },
  { label: 'Lotus Biscoff', waffleId: 'signature-biscoff', batterId: 'red-velvet' },
  { label: 'Fudge Brownie', waffleId: 'classic-milk', batterId: 'fudge-brownie' },
];

const GLAZE_PALETTE = {
  dark: { main: '#33180C', shine: '#58301D', crumb: '#58301D' },
  milk: { main: '#6F3B1D', shine: '#9A5A35', crumb: '#9A5A35' },
  white: { main: '#F4E5B1', shine: '#FFF9E2', crumb: '#FFFDF5' },
  nutella: { main: '#4A2312', shine: '#7A4228', crumb: '#E0B179' },
  biscoff: { main: '#C57526', shine: '#E69B4A', crumb: '#F6D59B' },
  oreo: { main: '#242020', shine: '#484140', crumb: '#F8F5EB' },
  kitkat: { main: '#7B361C', shine: '#A85432', crumb: '#D49B59' },
};

const calculateUnitPrice = (waffle, packSize, batterId) => {
  const batter = BATTER_UPGRADES.find((b) => b.id === batterId);
  return waffle.prices[packSize] + (batter ? batter.upcharge[packSize] : 0);
};
const formatINR = (n) => `₹${n}`;

/* ---------- Drip wave ---------- */
function MeltDripWave({ flip = false, fill = '#2D2584', height = 56 }) {
  return (
    <svg viewBox="0 0 1440 84" preserveAspectRatio="none" aria-hidden="true"
      className="d-block w-100" style={{ height, transform: flip ? 'rotate(180deg)' : 'none' }}>
      <path fill={fill}
        d="M0 0H1440V28C1410 28 1398 62 1372 62C1346 62 1338 30 1306 30C1274 30 1264 76 1234 76C1204 76 1198 34 1164 34C1130 34 1122 58 1094 58C1066 58 1054 24 1020 24C986 24 976 74 944 74C912 74 904 32 872 32C840 32 828 54 798 54C768 54 758 26 724 26C690 26 680 78 648 78C616 78 608 34 574 34C540 34 530 60 500 60C470 60 462 24 426 24C390 24 382 72 350 72C318 72 310 30 278 30C246 30 234 64 204 64C174 64 166 28 132 28C98 28 88 70 58 70C28 70 18 32 0 32V0Z" />
    </svg>
  );
}

/* ---------- Round waffle: uses /golden-belgian-waffle.svg + topping overlay ---------- */
function RoundWaffle({ batter, toppingStyle }) {
  const glaze = GLAZE_PALETTE[toppingStyle] || GLAZE_PALETTE.dark;
  return (
    <div className="waffle-stack">
      <img
        src="/golden-belgian-waffle.svg"
        alt={`${batter.name} Belgian waffle`}
        className="waffle-img"
        style={{ filter: batter.filter }}
        draggable="false"
      />
      <svg viewBox="0 0 220 220" className="waffle-overlay" aria-hidden="true">
        <path
          d="M38 56C44 35 66 28 96 28C124 28 164 28 176 42C187 54 186 78 184 96C182 110 171 114 166 102C162 92 155 96 152 112C149 128 136 130 132 114C128 99 118 100 113 122C108 144 92 142 89 122C86 105 74 106 68 118C61 131 46 122 44 102C42 86 33 74 38 56Z"
          fill={glaze.main} fillOpacity="0.95" />
        <path d="M52 50C62 40 82 37 112 37C138 37 158 40 168 50"
          stroke={glaze.shine} strokeWidth="6" strokeLinecap="round" strokeOpacity="0.65" fill="none" />
        <circle cx="80" cy="66" r="4.5" fill={glaze.crumb} />
        <circle cx="132" cy="62" r="5" fill={glaze.crumb} />
        <circle cx="106" cy="90" r="3.5" fill={glaze.crumb} />
        <circle cx="148" cy="78" r="3" fill={glaze.crumb} />
      </svg>
    </div>
  );
}

/* ---------- Triangle waffle wedge (new SVG) ---------- */
function TriangleWaffle({ batter, toppingStyle }) {
  const uid = useId().replace(/:/g, '');
  const glaze = GLAZE_PALETTE[toppingStyle] || GLAZE_PALETTE.dark;
  const wedge = 'M110 16 L204 150 Q110 208 16 150 Z';
  return (
    <svg viewBox="0 0 220 220" className="waffle-wedge" role="img"
      aria-label={`${batter.name} waffle wedge with ${toppingStyle} topping`}>
      <defs>
        <clipPath id={`wedge-${uid}`}><path d={wedge} /></clipPath>
      </defs>
      <ellipse cx="110" cy="200" rx="78" ry="9" fill="#1D175B" fillOpacity="0.12" />
      <path d="M110 24 L212 160 Q110 220 8 160 Z" fill={batter.crust} />
      <path d={wedge} fill={batter.batter} />
      {/* waffle grid */}
      <g clipPath={`url(#wedge-${uid})`} stroke={batter.crust} strokeOpacity="0.55" strokeWidth="5">
        {[-40, 0, 40, 80, 120, 160, 200].map((x) => (
          <line key={`a${x}`} x1={x} y1="0" x2={x + 160} y2="220" />
        ))}
        {[-60, -20, 20, 60, 100, 140, 180, 220].map((x) => (
          <line key={`b${x}`} x1={x + 160} y1="0" x2={x} y2="220" />
        ))}
      </g>
      <path d={wedge} fill="none" stroke="#FFFDF2" strokeOpacity="0.3" strokeWidth="2" />
      {/* chocolate / spread cap with drips */}
      <path
        d="M110 10 L170 95 C170 108 160 112 156 102 C152 94 146 96 143 110 C140 124 128 124 125 110 C122 98 114 98 110 116 C106 132 94 130 92 114 C90 100 80 100 76 108 C72 118 62 112 62 100 L50 82 Z"
        fill={glaze.main} />
      <path d="M96 40 L110 22 L124 40" stroke={glaze.shine} strokeWidth="5"
        strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" fill="none" />
      <circle cx="104" cy="70" r="4" fill={glaze.crumb} />
      <circle cx="124" cy="82" r="3.5" fill={glaze.crumb} />
      <circle cx="88" cy="88" r="3" fill={glaze.crumb} />
    </svg>
  );
}

/* Pop = triangle wedge, Duo/Family = full round waffle */
function WaffleVisual({ batterId, toppingStyle, packSize = 'duo', size = 'md' }) {
  const batter = BATTER_UPGRADES.find((b) => b.id === batterId) || BATTER_UPGRADES[0];
  return (
    <div className={`waffle-visual waffle-${size}`}>
      {packSize === 'pop'
        ? <TriangleWaffle batter={batter} toppingStyle={toppingStyle} />
        : <RoundWaffle batter={batter} toppingStyle={toppingStyle} />}
    </div>
  );
}

/* ---------- APP ---------- */
export default function App() {
  const [heroPresetIdx, setHeroPresetIdx] = useState(1);
  const [selectedPackSize, setSelectedPackSize] = useState('pop');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cardBatters, setCardBatters] = useState({});
  const [navOpen, setNavOpen] = useState(false);

  const [studioWaffleId, setStudioWaffleId] = useState('signature-nutella');
  const [studioPackSize, setStudioPackSize] = useState('duo');
  const [studioBatterId, setStudioBatterId] = useState('golden');
  const [showMenuPhotoModal, setShowMenuPhotoModal] = useState(false);

  const openInStudio = (waffleId, packSize, batterId) => {
    setStudioWaffleId(waffleId);
    setStudioPackSize(packSize);
    setStudioBatterId(batterId);
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeHero = HERO_PRESETS[heroPresetIdx];
  const heroWaffle = WAFFLE_MENU.find((w) => w.id === activeHero.waffleId) || WAFFLE_MENU[0];
  const heroBatter = BATTER_UPGRADES.find((b) => b.id === activeHero.batterId) || BATTER_UPGRADES[0];

  const visibleItems = categoryFilter === 'all' ? WAFFLE_MENU : WAFFLE_MENU.filter((i) => i.category === categoryFilter);
  const activePack = PACK_SIZES.find((p) => p.id === selectedPackSize) || PACK_SIZES[0];

  const studioWaffle = WAFFLE_MENU.find((w) => w.id === studioWaffleId) || WAFFLE_MENU[0];
  const studioBatter = BATTER_UPGRADES.find((b) => b.id === studioBatterId) || BATTER_UPGRADES[0];
  const studioPack = PACK_SIZES.find((p) => p.id === studioPackSize) || PACK_SIZES[0];
  const studioBase = studioWaffle.prices[studioPackSize];
  const studioUp = studioBatter.upcharge[studioPackSize];
  const studioTotal = calculateUnitPrice(studioWaffle, studioPackSize, studioBatterId);

  const navLinks = [
    ['#menu', 'Menu'], ['#batters', 'Batter Upgrades'], ['#studio', 'Waffle Studio'], ['#visit', 'Visit Cart'],
  ];

  return (
    <div className="melt-app d-flex flex-column min-vh-100">
      {/* ---------- Header ---------- */}
      <header className="sticky-top melt-header">
        <nav className="container d-flex align-items-center justify-content-between py-2" aria-label="Primary Navigation" style={{ minHeight: 64 }}>
          <a href="#top" className="melt-logo text-decoration-none">MELT Desserts</a>

          <div className="d-none d-md-flex align-items-center gap-4">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="melt-navlink text-decoration-none">{label}</a>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2">
            <a href="#visit" className="btn melt-btn-primary btn-sm d-inline-flex align-items-center gap-2">
              <MapPin size={16} aria-hidden="true" /> <span>Visit Cart</span>
            </a>
            <button type="button" className="btn btn-sm d-md-none melt-icon-btn"
              aria-label="Toggle menu" aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>
              {navOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
        {navOpen && (
          <div className="container d-md-none pb-3 d-flex flex-column gap-2">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setNavOpen(false)}
                className="melt-navlink text-decoration-none py-1">{label}</a>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow-1">
        {/* ---------- Hero ---------- */}
        <section id="top" className="position-relative overflow-hidden">
          <div className="melt-topstrip">
            <div className="container d-flex flex-wrap justify-content-between gap-2 pt-3 pb-1 small fw-medium">
              <span>MELT Desserts · Fresh Belgian Waffle Cart</span>
              <span>Kalavasal, Madurai-16 · Open Daily 6:00 PM – 11:00 PM</span>
            </div>
          </div>
          <MeltDripWave height={48} />

          <div className="container pt-3 pb-5">
            <div className="row g-4 g-lg-5 align-items-stretch">
              <div className="col-lg-6 d-flex flex-column justify-content-center">
                <p className="melt-eyebrow mb-3">Classic Chocolates · Signature Spreads · Custom Batters</p>
                <h1 className="font-display melt-h1 mb-4">Fresh Belgian Waffles, Pressed to Order.</h1>
                <p className="lead fs-6 melt-muted mb-4" style={{ maxWidth: 540 }}>
                  Crisp golden pockets flooded with warm Belgian dark, milk, or white chocolate,
                  Nutella, Lotus Biscoff, Oreo, and KitKat—customizable with Red Velvet or Fudge
                  Brownie batter.
                </p>
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <a href="#menu" className="btn melt-btn-primary btn-lg fs-6 d-inline-flex align-items-center gap-2">
                    <span>Explore Full Menu</span> <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <a href="#studio" className="btn melt-btn-outline btn-lg fs-6">Try Waffle Studio</a>
                </div>
              </div>

              <div className="col-lg-6 d-flex">
                <div className="melt-card w-100 p-4 p-sm-5 d-flex flex-column justify-content-between">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <span className="small fw-semibold melt-muted">Featured Combinations</span>
                    <div className="melt-seg d-flex flex-wrap gap-1" role="tablist" aria-label="Featured waffle presets">
                      {HERO_PRESETS.map((item, idx) => (
                        <button key={item.label} type="button" role="tab" aria-selected={idx === heroPresetIdx}
                          onClick={() => setHeroPresetIdx(idx)}
                          className={`btn btn-sm melt-seg-btn ${idx === heroPresetIdx ? 'active' : ''}`}>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center align-items-center py-2 gap-3">
                    <WaffleVisual batterId={heroBatter.id} toppingStyle={heroWaffle.toppingStyle} packSize="duo" size="lg" />
                    <div className="d-none d-sm-block">
                      <WaffleVisual batterId={heroBatter.id} toppingStyle={heroWaffle.toppingStyle} packSize="pop" size="sm" />
                    </div>
                  </div>

                  <div className="pt-3 border-top melt-border d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-3">
                    <div>
                      <p className="small fw-medium melt-muted mb-1">{heroWaffle.categoryLabel} · {heroBatter.name}</p>
                      <h2 className="font-display h5 fw-bold mb-1">{heroWaffle.name}</h2>
                      <div className="small fw-semibold tabular-nums">
                        Pop {formatINR(calculateUnitPrice(heroWaffle, 'pop', heroBatter.id))} ·{' '}
                        Duo {formatINR(calculateUnitPrice(heroWaffle, 'duo', heroBatter.id))} ·{' '}
                        Family {formatINR(calculateUnitPrice(heroWaffle, 'family', heroBatter.id))}
                      </div>
                    </div>
                    <button type="button" className="btn melt-btn-accent btn-sm text-nowrap"
                      onClick={() => openInStudio(heroWaffle.id, 'duo', heroBatter.id)}>
                      Customize Flavor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Menu ---------- */}
        <section id="menu" className="py-5 border-top melt-border">
          <div className="container">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4 mb-4">
              <div>
                <p className="melt-eyebrow mb-2">Fresh Belgian Waffle Menu</p>
                <h2 className="font-display melt-h2">01. Classic Chocolates &amp; Signature Specials</h2>
                <p className="melt-muted mb-0" style={{ maxWidth: 640 }}>
                  Switch pack sizes to compare Pop, Duo, and Family Feast prices, or preview each
                  flavor with a different batter base.
                </p>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2">
                <div className="melt-seg d-inline-flex gap-1" role="group" aria-label="Pack size selector">
                  {PACK_SIZES.map((p) => (
                    <button key={p.id} type="button" onClick={() => setSelectedPackSize(p.id)}
                      className={`btn btn-sm melt-seg-btn ${p.id === selectedPackSize ? 'active' : ''}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="melt-seg d-inline-flex gap-1" role="group" aria-label="Category filter">
                  {[{ id: 'all', label: 'All (7)' }, { id: 'classic', label: 'Classics' }, { id: 'signature', label: 'Specials' }].map((t) => (
                    <button key={t.id} type="button" onClick={() => setCategoryFilter(t.id)}
                      className={`btn btn-sm melt-seg-btn ${categoryFilter === t.id ? 'active accent' : ''}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="melt-card px-3 py-2 mb-4 d-flex flex-wrap justify-content-between gap-2 small">
              <span>
                Showing prices for <strong className="melt-indigo">{activePack.label}</strong> ({activePack.pieces}) — {activePack.description}.
              </span>
              <span className="fw-semibold melt-indigo tabular-nums">
                Classics {formatINR(WAFFLE_MENU[0].prices[selectedPackSize])} · Specials {formatINR(WAFFLE_MENU[3].prices[selectedPackSize])}
              </span>
            </div>

            <div className="row g-4">
              {visibleItems.map((waffle) => {
                const batterId = cardBatters[waffle.id] || 'golden';
                const price = calculateUnitPrice(waffle, selectedPackSize, batterId);
                return (
                  <div key={waffle.id} className="col-12 col-md-6 col-lg-4">
                    <article className="melt-card melt-hover h-100 p-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between small fw-medium melt-muted mb-3">
                          <span>{waffle.categoryLabel}</span>
                          {waffle.featuredTag
                            ? <span className="fw-semibold melt-crust">{waffle.featuredTag}</span>
                            : <span>{activePack.shortLabel}</span>}
                        </div>

                        <div className="melt-well rounded-4 py-4 mb-4 d-flex justify-content-center">
                          <WaffleVisual batterId={batterId} toppingStyle={waffle.toppingStyle} packSize={selectedPackSize} size="md" />
                        </div>

                        <div className="d-flex justify-content-between align-items-baseline gap-3 mb-1">
                          <h3 className="font-display h5 fw-bold mb-0">{waffle.name}</h3>
                          <span className="font-display h5 fw-bolder melt-indigo mb-0 tabular-nums">{formatINR(price)}</span>
                        </div>
                        <p className="small fw-semibold melt-crust mb-2">{waffle.tagline}</p>
                        <p className="small melt-muted mb-4">{waffle.description}</p>
                      </div>

                      <div className="pt-3 border-top melt-border">
                        <span className="d-block small fw-semibold melt-muted mb-2">Preview Batter Base</span>
                        <div className="row g-1 mb-3">
                          {BATTER_UPGRADES.map((b) => {
                            const active = batterId === b.id;
                            const up = b.upcharge[selectedPackSize];
                            return (
                              <div className="col-4" key={b.id}>
                                <button type="button"
                                  onClick={() => setCardBatters((prev) => ({ ...prev, [waffle.id]: b.id }))}
                                  className={`btn btn-sm w-100 melt-chip text-truncate ${active ? 'active' : ''}`}>
                                  {b.shortName}{up > 0 ? ` +₹${up}` : ''}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <div className="d-flex justify-content-between align-items-center gap-2">
                          <span className="small melt-muted tabular-nums">
                            Pop {formatINR(waffle.prices.pop)} · Duo {formatINR(waffle.prices.duo)} · Family {formatINR(waffle.prices.family)}
                          </span>
                          <button type="button" className="btn btn-sm melt-btn-outline d-inline-flex align-items-center gap-1 text-nowrap"
                            onClick={() => openInStudio(waffle.id, selectedPackSize, batterId)}>
                            <SlidersHorizontal size={14} aria-hidden="true" /> <span>Studio</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Batters + Studio ---------- */}
        <section id="batters" className="py-5 border-top melt-border melt-band">
          <div className="container">
            <div className="mb-4">
              <p className="melt-eyebrow mb-2">Turn Any Order into a Signature Base</p>
              <h2 className="font-display melt-h2">02. Batter Upgrades &amp; Waffle Studio</h2>
            </div>

            <div className="row g-3 mb-5">
              {BATTER_UPGRADES.map((item) => {
                const active = item.id === studioBatterId;
                return (
                  <div className="col-12 col-md-4" key={item.id}>
                    <button type="button" onClick={() => setStudioBatterId(item.id)}
                      className={`melt-batter-card w-100 h-100 text-start p-4 rounded-4 ${active ? 'active' : ''}`}>
                      <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                        <span className="melt-swatch" style={{ backgroundColor: item.swatch }} aria-hidden="true" />
                        <span className="small fw-semibold tabular-nums text-end">{item.badgeText}</span>
                      </div>
                      <h3 className="font-display h6 fw-bold mb-1">{item.name}</h3>
                      <p className="small mb-0 opacity-75">{item.subtitle}</p>
                    </button>
                  </div>
                );
              })}
            </div>

            <div id="studio" className="melt-card p-4 p-lg-5" style={{ scrollMarginTop: 80 }}>
              <div className="row g-4 g-lg-5">
                <div className="col-lg-5">
                  <div className="melt-well rounded-4 p-4 h-100 d-flex flex-column justify-content-between align-items-center border melt-border">
                    <div className="w-100 d-flex justify-content-between small fw-semibold melt-muted">
                      <span>Live Waffle Visualizer</span>
                      <span>{studioPack.pieces}</span>
                    </div>

                    <div className="py-4">
                      <WaffleVisual batterId={studioBatterId} toppingStyle={studioWaffle.toppingStyle} packSize={studioPackSize} size="lg" />
                    </div>

                    <div className="w-100 pt-3 border-top melt-border">
                      <p className="small fw-medium melt-muted mb-1">{studioBatter.name} · {studioPack.label}</p>
                      <p className="font-display h5 fw-bold mb-3">{studioWaffle.name}</p>
                      <div className="small tabular-nums">
                        <div className="d-flex justify-content-between mb-1">
                          <span>{studioWaffle.categoryLabel} ({studioPack.shortLabel})</span>
                          <span className="fw-semibold">{formatINR(studioBase)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>{studioBatter.name}</span>
                          <span className="fw-semibold">{studioUp === 0 ? 'Included' : `+${formatINR(studioUp)}`}</span>
                        </div>
                        <div className="d-flex justify-content-between pt-2 border-top melt-border fw-bold melt-indigo fs-6">
                          <span>Cart Counter Price</span>
                          <span>{formatINR(studioTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7 d-flex flex-column justify-content-between gap-4">
                  <div className="d-flex flex-column gap-4">
                    <div>
                      <h3 className="font-display h6 fw-bold mb-2">1. Choose Pack Size</h3>
                      <div className="row g-2">
                        {PACK_SIZES.map((p) => {
                          const active = p.id === studioPackSize;
                          return (
                            <div className="col-12 col-sm-4" key={p.id}>
                              <button type="button" onClick={() => setStudioPackSize(p.id)}
                                className={`melt-option w-100 text-start p-3 rounded-3 ${active ? 'active' : ''}`}>
                                <div className="d-flex justify-content-between gap-2">
                                  <span className="fw-semibold small">{p.label}</span>
                                  <span className="fw-bold small tabular-nums">{formatINR(calculateUnitPrice(studioWaffle, p.id, studioBatterId))}</span>
                                </div>
                                <span className="d-block small mt-1 opacity-75">{p.pieces}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display h6 fw-bold mb-2">2. Choose Chocolate or Signature Spread</h3>
                      <div className="row g-2">
                        {WAFFLE_MENU.map((item) => {
                          const active = item.id === studioWaffleId;
                          return (
                            <div className="col-6 col-sm-4" key={item.id}>
                              <button type="button" onClick={() => setStudioWaffleId(item.id)}
                                className={`melt-option w-100 text-start px-3 py-2 rounded-3 d-flex justify-content-between align-items-center gap-2 ${active ? 'active' : ''}`}>
                                <div className="min-w-0">
                                  <span className="d-block small fw-bold text-truncate">{item.name}</span>
                                  <span className="d-block tabular-nums opacity-75" style={{ fontSize: 11 }}>{formatINR(item.prices[studioPackSize])}</span>
                                </div>
                                {active && <Check size={14} className="flex-shrink-0" aria-hidden="true" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display h6 fw-bold mb-2">3. Choose Batter Base</h3>
                      <div className="row g-2">
                        {BATTER_UPGRADES.map((b) => {
                          const active = b.id === studioBatterId;
                          const extra = b.upcharge[studioPackSize];
                          return (
                            <div className="col-12 col-sm-4" key={b.id}>
                              <button type="button" onClick={() => setStudioBatterId(b.id)}
                                className={`melt-option w-100 text-start px-3 py-2 rounded-3 ${active ? 'active' : ''}`}>
                                <span className="d-block small fw-bold">{b.name}</span>
                                <span className={`d-block tabular-nums fw-semibold ${active ? 'opacity-75' : 'melt-crust'}`} style={{ fontSize: 11 }}>
                                  {extra === 0 ? 'Included' : `+${formatINR(extra)}`}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="melt-well border melt-border rounded-3 p-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                    <div>
                      <p className="small fw-semibold melt-indigo mb-1">Ready at the MELT Cart</p>
                      <p className="small mb-0">
                        Ask for <strong>{studioWaffle.name}</strong> on a <strong>{studioBatter.name}</strong> ({studioPack.label}).
                      </p>
                    </div>
                    <a href="#visit" className="btn melt-btn-accent fw-bold text-nowrap">Find Us in Kalavasal</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer id="visit" className="pt-3">
        <MeltDripWave height={64} flip />
        <div className="melt-footer pt-4 pb-5">
          <div className="container">
            <div className="row g-4 pb-4 border-bottom melt-footer-border">
              <div className="col-md-5">
                <p className="font-display fs-2 fw-bolder melt-cream mb-2">MELT DESSERTS</p>
                <p className="small opacity-75 mb-3" style={{ maxWidth: 380 }}>
                  Fresh Belgian Waffle Cart serving golden crisp pops, waffle duos, and family
                  feast boxes pressed hot to order in Kalavasal, Madurai-16.
                </p>
                <button type="button" className="btn btn-sm melt-footer-btn d-inline-flex align-items-center gap-2"
                  onClick={() => setShowMenuPhotoModal(true)}>
                  <FileImage size={16} aria-hidden="true" /> <span>View Original Cart Menu Photo</span>
                </button>
              </div>

              <div className="col-md-4 small">
                <h3 className="font-display h6 fw-bold melt-cream mb-3">Cart Location &amp; Hours</h3>
                <p className="d-flex gap-2 opacity-75">
                  <MapPin size={16} className="flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>Kalavasal, Madurai-16, Tamil Nadu</span>
                </p>
                <p className="d-flex gap-2 opacity-75">
                  <Clock size={16} className="flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>Open Daily · 6:00 PM – 11:00 PM</span>
                </p>
                <p className="d-flex gap-2 opacity-75 mb-0">
                  <span className="flex-shrink-0 mt-1"><Instagram size={16} /></span>
                  <a href="https://www.instagram.com/melt_dessertss" target="_blank" rel="noopener noreferrer"
                    className="melt-footer-link">@melt_dessertss</a>
                </p>
              </div>

              <div className="col-md-3 small">
                <h3 className="font-display h6 fw-bold melt-cream mb-3">Explore</h3>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  <li><a href="#menu" className="melt-footer-link">Classic Chocolates</a></li>
                  <li><a href="#menu" className="melt-footer-link">Signature Specials</a></li>
                  <li><a href="#batters" className="melt-footer-link">Batter Upgrades</a></li>
                  <li><a href="#studio" className="melt-footer-link">Waffle Studio</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-4 d-flex flex-column flex-sm-row justify-content-between gap-2 small opacity-75">
              <p className="mb-0">© 2026 MELT Desserts — Fresh Belgian Waffle Cart.</p>
              <p className="mb-0">Classic Chocolates from ₹49 · Signature Specials from ₹69</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ---------- Menu photo modal (Bootstrap markup, React-controlled) ---------- */}
      {showMenuPhotoModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true"
            aria-label="Original MELT Desserts Menu Card" onClick={() => setShowMenuPhotoModal(false)}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content melt-modal">
                <div className="modal-header border-0 pb-0">
                  <h3 className="modal-title font-display fs-6 fw-bold">Original Cart Menu — Kalavasal, Madurai-16</h3>
                  <button type="button" className="btn-close" aria-label="Close menu photo"
                    onClick={() => setShowMenuPhotoModal(false)} />
                </div>
                <div className="modal-body">
                  <img src="/images/menu-card.jpg" alt="MELT Desserts physical Belgian Waffle Cart menu card"
                    referrerPolicy="no-referrer" className="img-fluid rounded-3 d-block mx-auto"
                    style={{ maxHeight: '70vh', objectFit: 'contain' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}