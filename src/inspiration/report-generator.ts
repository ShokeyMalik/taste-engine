/**
 * Design Report Generator
 * Generates rich, developer-centric HTML design explorations
 */

import type { ExtractionResult, MiromiroDesignTokens, ExtractedAssets, AccessibilityReport, ComponentPattern } from './miromiro-types';

export class DesignReportGenerator {
    /**
     * Generate a complete, interactive Developer Design Explorer
     */
    generateHTML(data: ExtractionResult): string {
        const { url, extractedAt } = data.metadata;
        const tokens = data.tokens;
        const assets = data.assets;
        const accessibility = data.accessibility;
        const patterns = data.patterns;
        const motion = data.motion;

        return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design Intelligence Explorer - ${url}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#6366f1',
            surface: '#0f172a',
            'surface-light': '#1e293b',
          },
          fontFamily: {
            sans: ['Outfit', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
  <style>
    .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .nav-active { @apply bg-primary text-white shadow-lg shadow-indigo-500/30; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
    
    /* Animation Preview Container */
    .animation-preview:hover .animate-target {
        animation-play-state: running !important;
    }
    .animate-target {
        animation-play-state: paused;
    }
  </style>
</head>
<body class="bg-surface text-slate-100 font-sans antialiased overflow-hidden h-screen flex">

  <!-- Sidebar -->
  <aside class="w-72 bg-surface border-r border-slate-800 flex flex-col z-50">
    <div class="p-8 pb-4">
      <div class="flex items-center gap-3 text-primary font-extrabold text-xl tracking-tight">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        TASTE ENGINE
      </div>
      <div class="mt-2 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Design Intelligence Explorer</div>
    </div>

    <nav class="mt-8 flex-1 px-4 space-y-1 overflow-y-auto">
      <button onclick="showTab('overview')" id="nav-overview" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800 group flex items-center gap-3 nav-active active">
        <svg class="w-5 h-5 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        Overview
      </button>
      <button onclick="showTab('tokens')" id="nav-tokens" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800 group flex items-center gap-3">
        <svg class="w-5 h-5 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656L17 13"></path></svg>
        Design Tokens
      </button>
      <button onclick="showTab('assets')" id="nav-assets" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800 group flex items-center gap-3">
        <svg class="w-5 h-5 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Visual Assets
      </button>
      <button onclick="showTab('motion')" id="nav-motion" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800 group flex items-center gap-3">
        <svg class="w-5 h-5 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        Motion & Animation
      </button>
      <button onclick="showTab('patterns')" id="nav-patterns" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800 group flex items-center gap-3">
        <svg class="w-5 h-5 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        Components
      </button>
      <button onclick="showTab('accessibility')" id="nav-accessibility" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800 group flex items-center gap-3">
        <svg class="w-5 h-5 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        Accessibility
      </button>
    </nav>

    <div class="p-6 border-t border-slate-800">
        <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Developer Mode</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="dev-mode-toggle" onchange="toggleDevMode()" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none ring-4 ring-indigo-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
        <button onclick="downloadAllAssets()" class="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Project Assets
        </button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 overflow-y-auto relative bg-[#020617]">
    
    <!-- Tab: Overview -->
    <div id="tab-overview" class="tab-content active p-12 max-w-6xl mx-auto">
      <header class="mb-16">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-widest uppercase mb-6">Discovery Complete</div>
        <h1 class="text-6xl font-extrabold tracking-tighter mb-4">${new URL(url).hostname}</h1>
        <div class="flex items-center gap-4 text-slate-400">
            <span class="bg-indigo-500/5 px-3 py-1 rounded-md border border-indigo-500/10 text-xs font-mono">${url}</span>
            <span class="text-xs font-medium opacity-50">Extracted: ${new Date(extractedAt).toLocaleString()}</span>
        </div>
        
        <div class="mt-12 grid grid-cols-4 gap-6">
            <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center">
                <div class="text-3xl font-black text-indigo-400">${tokens?.colors.all.length || 0}</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">Design Tokens</div>
            </div>
            <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                <div class="text-3xl font-black text-emerald-400">${assets?.all.length || 0}</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">Found Assets</div>
            </div>
            <div class="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center">
                <div class="text-3xl font-black text-amber-400">${motion?.animationTypes.length || 0}</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">Motion Rules</div>
            </div>
            <div class="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-6 text-center">
                <div class="text-3xl font-black text-pink-400">${accessibility?.score || 0} %</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">A11y Health</div>
            </div>
        </div>
      </header>

      <div class="grid grid-cols-2 gap-12">
        <section>
            <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <span class="w-8 h-[2px] bg-indigo-500"></span>
                Primary Brand Colors
            </h2>
            <div class="grid grid-cols-2 gap-4">
                ${tokens?.colors.primary.slice(0, 4).map(c => this.renderColorBar(c)).join('') || ''}
            </div>
        </section>

        <section>
            <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <span class="w-8 h-[2px] bg-indigo-500"></span>
                Typography System
            </h2>
            <div class="space-y-4">
                ${tokens?.typography.headings.slice(0, 2).map(t => `
                    <div class="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <div class="text-[10px] font-mono text-slate-500 mb-4">${t.fontFamily.split(',')[0]} / ${t.fontSize} / ${t.fontWeight}</div>
                        <div style="font-family: ${t.fontFamily}; font-size: 24px; font-weight: ${t.fontWeight};" class="truncate">
                            Design systems build trust.
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
      </div>
    </div>

    <!-- Tab: Tokens -->
    <div id="tab-tokens" class="tab-content h-full">
        <div class="h-full flex overflow-hidden">
            <!-- Token Navigation -->
            <div class="w-64 border-r border-slate-800 p-8 space-y-6 flex-shrink-0">
                <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Token System</h3>
                <div class="space-y-2">
                    <button onclick="scrollToToken('colors-section')" class="w-full text-left text-sm py-2 px-4 rounded-lg bg-slate-800 text-primary font-bold">Colors</button>
                    <button onclick="scrollToToken('typo-section')" class="w-full text-left text-sm py-2 px-4 rounded-lg hover:bg-slate-800/50 text-slate-400">Typography</button>
                </div>
            </div>
            
            <!-- Token Viewer -->
            <div class="flex-1 overflow-y-auto p-12 scroll-smooth">
                <section id="colors-section" class="mb-20 text-center">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-3xl font-extrabold tracking-tight text-center">Color Palette</h2>
                        <button onclick="copyAllTokens('css')" class="text-xs px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/20 font-bold transition-all">Copy as CSS Variables</button>
                    </div>
                    <div class="grid grid-cols-4 gap-6">
                        ${tokens?.colors.all.slice(0, 24).map(c => this.renderFullColorCard(c)).join('')}
                    </div>
                </section>

                <section id="typo-section" class="mb-20">
                    <h2 class="text-3xl font-extrabold tracking-tight mb-8">Typography System</h2>
                    <div class="space-y-6">
                        ${tokens?.typography.all.slice(0, 10).map(t => this.renderFullTypoRow(t)).join('')}
                    </div>
                </section>
            </div>
        </div>
    </div>

    <!-- Tab: Assets -->
    <div id="tab-assets" class="tab-content h-full overflow-y-auto p-12">
        <header class="mb-12 flex items-center justify-between max-w-6xl mx-auto">
            <div>
                <h2 class="text-4xl font-extrabold tracking-tighter">Visual Assets</h2>
                <p class="text-slate-500 text-sm mt-2">All branding elements, vectors, and background imagery identified on page.</p>
            </div>
        </header>

        <div class="max-w-6xl mx-auto grid grid-cols-3 gap-8">
            <!-- Graphs -->
            ${assets?.graphs.map(g => `
                <div class="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col">
                    <div class="p-6 bg-slate-950 flex items-center justify-center min-h-[180px]">
                        <img src="${g.dataUrl}" class="max-w-full max-h-40 object-contain">
                    </div>
                    <div class="p-4 border-t border-slate-800">
                        <div class="flex items-center justify-between mb-2">
                             <span class="text-[10px] font-bold text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded uppercase tracking-wider">Canvas Graph</span>
                             <span class="text-[10px] text-slate-500">${g.width}x${g.height}</span>
                        </div>
                        <h4 class="text-xs font-bold text-slate-300 truncate">${g.id}</h4>
                        <div class="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onclick="downloadDataUrl('${g.dataUrl}', '${g.id}.png')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold">Download PNG</button>
                        </div>
                    </div>
                </div>
            `).join('')}

            <!-- SVGs -->
            ${assets?.svgs.map((s, i) => `
                <div class="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col">
                    <div class="p-8 bg-white flex items-center justify-center min-h-[180px]">
                        ${s.content || `<img src="${s.url}" class="max-w-full max-h-32">`}
                    </div>
                    <div class="p-4 border-t border-slate-800 flex-1 flex flex-col">
                        <div class="flex items-center justify-between mb-2">
                             <span class="text-[10px] font-bold text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded uppercase tracking-wider">Vector SVG</span>
                             <span class="text-[10px] text-slate-500">${s.width}x${s.height}</span>
                        </div>
                        <h4 class="text-xs font-mono text-slate-300 truncate mb-4">${s.url || 'Inline SVG ' + i}</h4>
                        <div class="mt-auto grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            ${s.content ? `<button onclick="copyToClipboard(\`${s.content.replace(/`/g, '\\`')}\`)" class="py-2 bg-indigo-500 text-white rounded-lg text-[10px] font-bold col-span-2">Copy SVG Code</button>` : ''}
                            ${s.url ? `<button onclick="downloadUrl('${s.url}')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold">Download Vector</button>` : ''}
                            <button onclick="copyToClipboard('${s.url}')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold">Copy URL</button>
                        </div>
                    </div>
                </div>
            `).join('')}

            <!-- Images -->
            ${assets?.images.map(img => `
                <div class="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col">
                    <div class="h-44 overflow-hidden bg-slate-950 flex items-center justify-center">
                        <img src="${img.url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${img.alt}">
                    </div>
                    <div class="p-4 border-t border-slate-800">
                        <div class="flex items-center justify-between mb-2">
                             <span class="text-[10px] font-bold text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded uppercase tracking-wider">${img.format} image</span>
                             <span class="text-[10px] text-slate-500">${img.width}x${img.height}</span>
                        </div>
                        <h4 class="text-xs font-bold text-slate-300 truncate">${img.alt || 'Untitled Asset'}</h4>
                        <div class="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onclick="downloadUrl('${img.url}')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold">Download</button>
                            <button onclick="copyToClipboard('${img.url}')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold">Copy URL</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <!-- Tab: Motion -->
    <div id="tab-motion" class="tab-content h-full p-12 overflow-y-auto">
        <h2 class="text-4xl font-extrabold tracking-tighter mb-12 max-w-6xl mx-auto">Motion Intelligence</h2>
        
        <div class="max-w-6xl mx-auto grid grid-cols-2 gap-12">
            <section>
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Detected Engines</h3>
                <div class="flex gap-4">
                    ${motion?.libraries.map(l => `
                        <div class="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex-1 flex items-center justify-center gap-3">
                             <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                             <span class="font-extrabold text-primary text-xl">${l}</span>
                        </div>
                    `).join('') || '<div class="text-slate-500 font-mono text-sm">Standard Native CSS / Web Animations</div>'}
                </div>
            </section>

            <section>
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Animation Rules</h3>
                <div class="grid grid-cols-2 gap-4">
                    ${motion?.animationTypes.map(a => `
                        <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs font-bold text-slate-300">
                            ${a}
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>

        <div class="mt-16 max-w-6xl mx-auto">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Extracted @keyframes & Transitions</h3>
            <div class="space-y-6">
                 <!-- Since we extract this per-element during inspection, we would list common ones here -->
                 <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 group">
                    <p class="text-slate-500 text-sm mb-6 italic">Deep motion inspection is available in "Developer Mode" when hover-inspecting specific elements.</p>
                    <div class="grid grid-cols-2 gap-12">
                        <div>
                            <h4 class="text-xs font-bold text-primary uppercase mb-4">Sample Transition</h4>
                            <div class="p-6 bg-slate-950 rounded-2xl font-mono text-xs text-indigo-300 border border-slate-800 group-hover:border-primary/30 transition-all">
                                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s;
                            </div>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-primary uppercase mb-4">Sample Keyframes</h4>
                            <div class="p-6 bg-slate-950 rounded-2xl font-mono text-[10px] text-indigo-300 border border-slate-800 group-hover:border-primary/30 transition-all max-h-40 overflow-y-auto">
                                @keyframes fade-in-up {<br>
                                &nbsp;&nbsp;from { opacity: 0; transform: translateY(10px); }<br>
                                &nbsp;&nbsp;to { opacity: 1; transform: translateY(0); }<br>
                                }
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </div>

    <!-- Tab: Patterns -->
    <div id="tab-patterns" class="tab-content h-full p-12 overflow-y-auto">
        <h2 class="text-4xl font-extrabold tracking-tighter mb-12 max-w-6xl mx-auto">Component Library</h2>
        <div class="max-w-6xl mx-auto grid grid-cols-2 gap-8">
            ${patterns?.map(p => this.renderPatternCard(p)).join('') || '<div class="col-span-2 text-slate-500 py-20 text-center">No deep component patterns identified on this page.</div>'}
        </div>
    </div>

    <!-- Tab: Accessibility -->
    <div id="tab-accessibility" class="tab-content p-12 h-full overflow-y-auto">
         <div class="max-w-4xl mx-auto">
             <div class="flex items-center justify-between mb-16">
                <div>
                    <h2 class="text-4xl font-extrabold tracking-tighter">A11y Audit</h2>
                    <p class="text-slate-500 text-sm mt-2">WCAG 2.1 Compliance scan based on ${accessibility?.metadata.elementsChecked || 0} elements.</p>
                </div>
                <div class="bg-slate-900 h-32 w-32 rounded-3xl border-2 border-primary flex items-center justify-center relative">
                    <div class="text-4xl font-black text-primary">${accessibility?.score}%</div>
                    <div class="absolute -bottom-3 px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-widest rounded-full">Score</div>
                </div>
             </div>

             <div class="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-8 mb-12">
                <h3 class="text-lg font-bold mb-4">Design Team Recommendations</h3>
                <ul class="space-y-4">
                    ${accessibility?.recommendations.map(r => `
                        <li class="flex gap-4 p-4 hover:bg-slate-800/30 rounded-xl transition-colors">
                            <div class="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
                            <div class="text-sm text-slate-300">${r.message}</div>
                        </li>
                    `).join('')}
                </ul>
             </div>

             <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Violations & Warnings</h3>
             <div class="space-y-4">
                ${accessibility?.wcag.issues.map(issue => `
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex gap-6 items-start">
                        <div class="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${issue.severity === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}">
                            ${issue.severity}
                        </div>
                        <div class="flex-1">
                            <div class="text-sm font-bold text-slate-200 mb-1">${issue.type.toUpperCase()}: ${issue.message}</div>
                            <div class="text-[10px] font-mono text-slate-500 truncate mt-2">Affected Element: ${issue.element}</div>
                        </div>
                    </div>
                `).join('')}
             </div>
         </div>
    </div>

  </main>
  
  <!-- Global Notifier -->
  <div id="toast" class="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-indigo-600 text-white font-bold text-sm rounded-full shadow-2xl transition-all duration-300 opacity-0 translate-y-10 z-[100]">
      Copied to clipboard!
  </div>

  <script>
    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.getElementById('tab-' + tabId).classList.add('active');
      
      document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('nav-active');
        btn.classList.remove('active');
      });
      document.getElementById('nav-' + tabId).classList.add('nav-active');
      document.getElementById('nav-' + tabId).classList.add('active');
    }

    function toggleDevMode() {
        const isEnabled = document.getElementById('dev-mode-toggle').checked;
        if (isEnabled) {
            document.body.classList.add('dev-mode-active');
        } else {
            document.body.classList.remove('dev-mode-active');
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text);
        const toast = document.getElementById('toast');
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 10px)';
        }, 2000);
    }

    function downloadUrl(url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop() || 'asset';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function downloadDataUrl(dataUrl, filename) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function scrollToToken(id) {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    }
  </script>
</body>
</html>
    `;
    }

    private renderColorBar(color: any): string {
        return `
    <div class="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
        <div class="w-12 h-12 rounded-xl shadow-lg ring-1 ring-white/10" style="background: ${color.value}"></div>
        <div>
            <div class="text-[10px] font-mono text-slate-500">${color.value.toUpperCase()}</div>
            <div class="text-xs font-bold text-slate-300">Brand Primary</div>
        </div>
    </div>
    `;
    }

    private renderFullColorCard(color: any): string {
        return `
    <div class="group bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-primary transition-all">
        <div class="w-full h-24 rounded-xl mb-4 relative overflow-hidden" style="background: ${color.value}">
            <button onclick="copyToClipboard('${color.value}')" class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-widest transition-opacity cursor-pointer">Copy Hex</button>
        </div>
        <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold">${color.value.toUpperCase()}</span>
            <span class="text-[10px] font-bold text-slate-500">${color.occurrences}x</span>
        </div>
    </div>
    `;
    }

    private renderFullTypoRow(typo: any): string {
        return `
    <div class="bg-slate-900 border border-slate-800 p-8 rounded-2xl group hover:border-slate-600 transition-all">
        <div class="flex items-center justify-between mb-8">
            <div class="flex gap-4">
                <span class="bg-slate-800 px-3 py-1 rounded text-[10px] font-mono border border-slate-700">${typo.fontFamily.split(',')[0]}</span>
                <span class="bg-slate-800 px-3 py-1 rounded text-[10px] font-mono border border-slate-700">${typo.fontSize}</span>
                <span class="bg-slate-800 px-3 py-1 rounded text-[10px] font-mono border border-slate-700">W: ${typo.fontWeight}</span>
            </div>
            <button onclick="copyToClipboard('font-family: ${typo.fontFamily}; font-size: ${typo.fontSize}; font-weight: ${typo.fontWeight};')" class="text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Copy CSS</button>
        </div>
        <div style="font-family: ${typo.fontFamily}; font-size: 32px; font-weight: ${typo.fontWeight};" class="line-clamp-2">
            The quick brown fox jumps over the lazy dog.
        </div>
    </div>
    `;
    }

    private renderPatternCard(p: ComponentPattern): string {
        return `
    <div class="bg-slate-900 border border-slate-800 p-8 rounded-3xl group hover:border-primary transition-all">
        <div class="flex items-center justify-between mb-6">
            <div class="text-[10px] font-black uppercase text-primary tracking-[0.2em]">${p.type} detected</div>
            <div class="text-xs font-bold text-slate-500">${p.count} Instances</div>
        </div>
        <h3 class="text-2xl font-extrabold mb-4 italic tracking-tighter">${p.name}</h3>
        <div class="flex flex-wrap gap-2 mb-8">
            ${p.variants?.map(v => `<span class="bg-slate-800 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-700">#${v}</span>`).join('') || ''}
        </div>
        <div class="pt-6 border-t border-slate-800 flex gap-4">
            <button class="flex-1 py-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700">Copy Selectors</button>
            <button class="flex-1 py-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700">View Computed</button>
        </div>
    </div>
    `;
    }
}
