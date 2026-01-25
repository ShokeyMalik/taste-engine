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
        const globalMotion = data.globalMotion || [];

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
            primary: '#6157FF',
            surface: '#0B0F19',
            'surface-light': '#161B26',
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
    .glass { background: rgba(22, 27, 38, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.05); }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .nav-active { @apply bg-primary text-white shadow-lg shadow-indigo-500/20; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #0B0F19; }
    ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #334155; }
    
    /* Animation Preview */
    .animate-target { animation-play-state: paused; }
    .animation-preview:hover .animate-target { animation-play-state: running; }

    /* Developer Inspector Styles */
    .dev-mode-active * { cursor: crosshair !important; }
    #inspector-overlay {
        position: fixed;
        pointer-events: none;
        border: 2px solid #6157FF;
        background: rgba(97, 87, 255, 0.1);
        z-index: 10000;
        display: none;
        transition: all 0.1s ease-out;
    }
    #inspector-panel {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 320px;
        background: #111827;
        border: 1px solid #374151;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        z-index: 10001;
        display: none;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        overflow: hidden;
    }
  </style>
</head>
<body class="bg-surface text-slate-100 font-sans antialiased overflow-hidden h-screen flex">

  <!-- Inspector UI -->
  <div id="inspector-overlay"></div>
  <div id="inspector-panel">
      <div class="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
          <span class="text-indigo-400 font-bold uppercase tracking-tighter">Style Inspector</span>
          <button onclick="closeInspector()" class="text-gray-500 hover:text-white">&times;</button>
      </div>
      <div id="inspector-content" class="p-4 space-y-3 max-h-96 overflow-y-auto">
          <div class="text-slate-500 italic">Hover over an element to inspect...</div>
      </div>
  </div>

  <!-- Sidebar -->
  <aside class="w-72 bg-surface border-r border-slate-800/50 flex flex-col z-50">
    <div class="p-8 pb-4">
      <div class="flex items-center gap-3 text-primary font-extrabold text-xl tracking-tighter">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        TASTE ENGINE
      </div>
      <div class="mt-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">v1.0.0 Developer Hub</div>
    </div>

    <nav class="mt-12 flex-1 px-5 space-y-1 overflow-y-auto">
      <button onclick="showTab('overview')" id="nav-overview" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800/50 group flex items-center gap-3 nav-active active">
        <svg class="w-4 h-4 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path></svg>
        Overview
      </button>
      <button onclick="showTab('tokens')" id="nav-tokens" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800/50 group flex items-center gap-3">
        <svg class="w-4 h-4 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"></path></svg>
        Tokens
      </button>
      <button onclick="showTab('assets')" id="nav-assets" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800/50 group flex items-center gap-3">
        <svg class="w-4 h-4 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0"></path></svg>
        Assets
      </button>
      <button onclick="showTab('motion')" id="nav-motion" class="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-slate-800/50 group flex items-center gap-3">
        <svg class="w-4 h-4 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>
        Motion
      </button>
    </nav>

    <div class="p-6 border-t border-slate-800/50">
        <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Developer Mode</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="dev-mode-toggle" onchange="toggleDevMode()" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none ring-4 ring-indigo-500/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
        <button onclick="downloadAllAssets()" class="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold transition-all border border-slate-700 flex items-center justify-center gap-2 uppercase tracking-widest">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Assets
        </button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 overflow-y-auto relative bg-[#060912]">
    
    <!-- Tab: Overview -->
    <div id="tab-overview" class="tab-content active p-16 max-w-6xl mx-auto">
      <header class="mb-20">
        <h1 class="text-7xl font-extrabold tracking-tighter mb-4">${new URL(url).hostname}</h1>
        <div class="flex items-center gap-4 text-slate-400">
            <span class="bg-primary/10 px-3 py-1 rounded text-[10px] font-mono border border-primary/20 text-primary">${url}</span>
        </div>
        
        <div class="mt-16 grid grid-cols-4 gap-8">
            <div class="bg-indigo-500/5 border border-white/5 rounded-3xl p-8 hover:bg-indigo-500/10 transition-colors">
                <div class="text-4xl font-black text-primary">${tokens?.colors.all.length || 0}</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-2">Tokens</div>
            </div>
            <div class="bg-emerald-500/5 border border-white/5 rounded-3xl p-8 hover:bg-emerald-500/10 transition-colors">
                <div class="text-4xl font-black text-emerald-400">${assets?.all.length || 0}</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-2">Visuals</div>
            </div>
            <div class="bg-amber-500/5 border border-white/5 rounded-3xl p-8 hover:bg-amber-500/10 transition-colors">
                <div class="text-4xl font-black text-amber-400">${globalMotion.length}</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-2">Animations</div>
            </div>
            <div class="bg-pink-500/5 border border-white/5 rounded-3xl p-8 hover:bg-pink-500/10 transition-colors">
                <div class="text-4xl font-black text-pink-400">${accessibility?.score || 0}%</div>
                <div class="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-2">UX Health</div>
            </div>
        </div>
      </header>

      <div class="grid grid-cols-2 gap-16">
        <section>
            <h2 class="text-xs font-bold text-slate-500 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                <span class="w-12 h-[1px] bg-slate-800"></span> Primary Palette
            </h2>
            <div class="grid grid-cols-2 gap-4">
                ${tokens?.colors.primary.slice(0, 4).map(c => `
                    <div class="group relative bg-[#0D111C] border border-white/5 p-5 rounded-2xl hover:border-primary/50 transition-all">
                        <div class="w-10 h-10 rounded-xl mb-4 shadow-xl shadow-black/50" style="background: ${c.value}"></div>
                        <div class="text-[10px] font-mono text-slate-400">${c.value.toUpperCase()}</div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section>
            <h2 class="text-xs font-bold text-slate-500 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                <span class="w-12 h-[1px] bg-slate-800"></span> Typography
            </h2>
            <div class="space-y-4">
                ${tokens?.typography.headings.slice(0, 2).map(t => `
                    <div class="bg-[#0D111C] border border-white/5 p-8 rounded-3xl">
                        <div class="text-[9px] font-mono text-slate-600 mb-6 uppercase tracking-widest">${t.fontFamily.split(',')[0]} / ${t.fontSize}</div>
                        <div style="font-family: ${t.fontFamily}; font-size: 28px; font-weight: ${t.fontWeight};" class="truncate leading-tight">
                            Build with Intelligence.
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
      </div>
    </div>

    <!-- Tab: Tokens -->
    <div id="tab-tokens" class="tab-content h-full p-16 overflow-y-auto">
        <header class="mb-16">
            <h2 class="text-5xl font-black tracking-tighter mb-2">Design Tokens</h2>
            <p class="text-slate-500 text-sm">Extracted primitive values from ${url}</p>
        </header>
        
        <div class="space-y-24">
            <section>
                 <h3 class="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-8 pb-4 border-b border-white/5">Color Palette</h3>
                 <div class="grid grid-cols-6 gap-6">
                    ${tokens?.colors.all.slice(0, 30).map(c => `
                        <div class="group bg-slate-900/50 border border-white/5 p-4 rounded-2xl hover:border-primary transition-all cursor-pointer" onclick="copyToClipboard('${c.value}')">
                            <div class="aspect-square rounded-lg mb-3 shadow-lg" style="background: ${c.value}"></div>
                            <div class="text-[10px] font-mono font-bold text-slate-300">${c.value.toUpperCase()}</div>
                            <div class="text-[8px] text-slate-500 mt-1 uppercase">${c.usage}</div>
                        </div>
                    `).join('')}
                 </div>
            </section>

            <section>
                 <h3 class="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-8 pb-4 border-b border-white/5">Typography Specimen</h3>
                 <div class="space-y-6">
                    ${tokens?.typography.all.slice(0, 8).map(t => `
                        <div class="bg-slate-900/30 border border-white/5 p-12 rounded-3xl group hover:border-slate-700 transition-all">
                            <div class="flex items-center justify-between mb-8">
                                <div class="flex gap-4">
                                    <span class="bg-slate-800/80 px-3 py-1 rounded text-[10px] font-mono text-slate-400">${t.fontFamily.split(',')[0]}</span>
                                    <span class="bg-slate-800/80 px-3 py-1 rounded text-[10px] font-mono text-slate-400">${t.fontSize}</span>
                                </div>
                                <button onclick="copyToClipboard('font-family: ${t.fontFamily}; font-size: ${t.fontSize}; font-weight: ${t.fontWeight};')" class="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Copy CSS</button>
                            </div>
                            <div style="font-family: ${t.fontFamily}; font-size: 36px; font-weight: ${t.fontWeight};" class="line-clamp-1 italic tracking-tight">
                                The future belongs to the curious.
                            </div>
                        </div>
                    `).join('')}
                 </div>
            </section>
        </div>
    </div>

    <!-- Tab: Assets -->
    <div id="tab-assets" class="tab-content h-full overflow-y-auto p-16">
        <header class="mb-16">
            <h2 class="text-5xl font-black tracking-tighter">Visual Identity</h2>
            <p class="text-slate-500 text-sm mt-1">Discovered bitmaps, vectors, and complex elements.</p>
        </header>

        <div class="grid grid-cols-3 gap-12">
            <!-- Graphs/Canvas -->
            ${assets?.graphs.map(g => `
                <div class="group bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all flex flex-col">
                    <div class="p-8 bg-slate-950/50 flex items-center justify-center min-h-[220px]">
                        <img src="${g.dataUrl}" class="max-w-full max-h-44 object-contain">
                    </div>
                    <div class="p-6 border-t border-white/5">
                        <div class="flex items-center justify-between mb-2">
                             <span class="text-[9px] font-bold text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded uppercase">Graph Object</span>
                             <span class="text-[9px] font-mono text-slate-600">${g.width}x${g.height}</span>
                        </div>
                        <h4 class="text-xs font-bold text-slate-300 truncate">${g.id}</h4>
                        <div class="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onclick="downloadDataUrl('${g.dataUrl}', '${g.id}.png')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold">Download PNG</button>
                        </div>
                    </div>
                </div>
            `).join('')}

            <!-- SVGs -->
            ${assets?.svgs.map((s, i) => `
                <div class="group bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/50 transition-all flex flex-col">
                    <div class="p-12 bg-white flex items-center justify-center min-h-[220px]">
                        ${s.content || `<img src="${s.url}" class="max-w-full max-h-36">`}
                    </div>
                    <div class="p-6 border-t border-white/5">
                        <div class="flex items-center justify-between mb-2">
                             <span class="text-[9px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded uppercase">SVG Vector</span>
                             <span class="text-[9px] font-mono text-slate-600">${s.width}x${s.height}</span>
                        </div>
                        <h4 class="text-xs font-mono text-slate-400 truncate mb-4">${s.url || 'Inline ID: ' + i}</h4>
                        <div class="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            ${s.content ? `<button onclick="copyToClipboard(\`${s.content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="py-2 bg-primary text-white rounded-xl text-[10px] font-bold col-span-2 shadow-lg shadow-indigo-500/20">Copy SVG Code</button>` : ''}
                            ${s.url ? `<button onclick="downloadUrl('${s.url}')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold">Download</button>` : ''}
                            <button onclick="copyToClipboard('${s.url}')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold">Copy URL</button>
                        </div>
                    </div>
                </div>
            `).join('')}

            <!-- Background Images -->
            ${assets?.images.filter(img => img.source === 'background').map(img => `
                <div class="group bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col">
                    <div class="h-56 bg-slate-950 flex items-center justify-center relative overflow-hidden">
                        <img src="${img.url}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                    <div class="p-6 border-t border-white/5">
                        <span class="text-[9px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded uppercase mb-2 inline-block">CSS Background</span>
                        <h4 class="text-xs font-bold text-slate-300 truncate mb-6">${img.url.split('/').pop()}</h4>
                        <button onclick="downloadUrl('${img.url}')" class="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Download Source</button>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <!-- Tab: Motion -->
    <div id="tab-motion" class="tab-content h-full p-16 overflow-y-auto">
        <header class="mb-16">
            <h2 class="text-5xl font-black tracking-tighter">Motion Intelligence</h2>
            <p class="text-slate-500 text-sm">Real global keyframes and transition sets discovered in the source.</p>
        </header>
        
        <div class="space-y-12">
            <section>
                <h3 class="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-8 pb-4 border-b border-white/5">Global @Keyframes</h3>
                <div class="grid grid-cols-2 gap-8">
                    ${globalMotion.length > 0 ? globalMotion.map(km => `
                        <div class="bg-slate-900/50 border border-white/5 rounded-3xl p-8 group">
                            <div class="flex items-center justify-between mb-6">
                                <span class="text-xs font-black text-indigo-400 font-mono tracking-tighter">@keyframes ${km.name}</span>
                                <button onclick="copyToClipboard(\`${km.css.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` )" class="text-[9px] font-bold uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity">Copy Code</button>
                            </div>
                            <div class="p-6 bg-slate-950/80 rounded-2xl font-mono text-[10px] text-slate-400 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                                ${km.css}
                            </div>
                        </div>
                    `).join('') : '<div class="col-span-2 p-12 bg-slate-900/30 rounded-3xl text-center text-slate-500 italic">No global keyframes found in stylesheets. Try inspecting individual elements.</div>'}
                </div>
            </section>
        </div>
    </div>

  </main>
  
  <!-- Global Notifier -->
  <div id="toast" class="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-full shadow-2xl shadow-indigo-500/40 transition-all duration-300 opacity-0 translate-y-10 z-[100]">
      Copied to Clipboard
  </div>

  <script>
    // Robust Clipboard Logic (supports local file system)
    function copyToClipboard(text) {
        if (!text) return;
        
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('Copied to Clipboard');
        } catch (err) {
            console.error('Copy failed', err);
        }
        
        document.body.removeChild(textArea);
    }

    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 10px)';
        }, 2500);
    }

    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.getElementById('tab-' + tabId).classList.add('active');
      
      document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('nav-active');
        btn.classList.remove('active');
      });
      const currentBtn = document.getElementById('nav-' + tabId);
      if (currentBtn) {
          currentBtn.classList.add('nav-active');
          currentBtn.classList.add('active');
      }
    }

    // Developer Mode Inspector Logic
    let isInspectorActive = false;
    function toggleDevMode() {
        isInspectorActive = document.getElementById('dev-mode-toggle').checked;
        if (isInspectorActive) {
            document.body.classList.add('dev-mode-active');
            document.getElementById('inspector-panel').style.display = 'block';
            enableInspector();
        } else {
            document.body.classList.remove('dev-mode-active');
            document.getElementById('inspector-panel').style.display = 'none';
            document.getElementById('inspector-overlay').style.display = 'none';
            disableInspector();
        }
    }

    function enableInspector() {
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('click', handleClick);
    }

    function disableInspector() {
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('click', handleClick);
    }

    function handleMouseOver(e) {
        const el = e.target;
        if (el === document.body || el.closest('#inspector-panel') || el.closest('sidebar')) return;
        
        const rect = el.getBoundingClientRect();
        const overlay = document.getElementById('inspector-overlay');
        overlay.style.display = 'block';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
        
        updateInspectorPanel(el);
    }

    function handleClick(e) {
        if (!isInspectorActive || e.target.closest('#inspector-panel')) return;
        e.preventDefault();
        e.stopPropagation();
        
        const el = e.target;
        const styles = window.getComputedStyle(el);
        const cssLine = \`color: \${styles.color}; background-color: \${styles.backgroundColor}; font-size: \${styles.fontSize};\`;
        copyToClipboard(cssLine);
        showToast('Extracted Styles for Component Alignment');
    }

    function updateInspectorPanel(el) {
        const styles = window.getComputedStyle(el);
        const content = document.getElementById('inspector-content');
        
        content.innerHTML = \`
            <div class="mb-4">
                <span class="text-gray-500">&lt;</span><span class="text-indigo-400">\${el.tagName.toLowerCase()}</span><span class="text-gray-500">&gt;</span>
                <div class="text-[9px] text-gray-600 mt-1">\${el.className.substring(0, 50)}...</div>
            </div>
            <div class="grid grid-cols-2 gap-2 border-t border-gray-800 pt-3">
                <div class="text-gray-500">Color</div><div class="font-bold">\${styles.color}</div>
                <div class="text-gray-500">Font</div><div class="text-gray-300 truncate">\${styles.fontFamily.split(',')[0]}</div>
                <div class="text-gray-500">Size</div><div>\${styles.fontSize} / \${styles.fontWeight}</div>
                <div class="text-gray-500">Display</div><div>\${styles.display}</div>
                <div class="text-gray-500">Radius</div><div>\${styles.borderRadius}</div>
            </div>
            <div class="mt-4 p-3 bg-black/40 rounded-lg text-[9px] text-indigo-300 border border-indigo-500/10">
                Click element to copy alignment CSS for Vibe Coding.
            </div>
        \`;
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
  </script>
</body>
</html>
    `;
    }

    private renderPatternCard(p: ComponentPattern): string {
        return `
    <div class="bg-slate-900/50 border border-white/5 p-8 rounded-3xl group hover:border-primary transition-all">
        <div class="flex items-center justify-between mb-6">
            <div class="text-[9px] font-black uppercase text-primary tracking-[0.2em]">${p.type} detected</div>
            <div class="text-xs font-bold text-slate-500">${p.count} Instances</div>
        </div>
        <h3 class="text-2xl font-extrabold mb-4 italic tracking-tighter">${p.name}</h3>
        <div class="pt-6 border-t border-white/5 flex gap-4">
            <button class="flex-1 py-3 bg-slate-800 rounded-xl text-[9px] font-black uppercase hover:bg-slate-700 transition-colors">Copy Selectors</button>
        </div>
    </div>
    `;
    }
}
