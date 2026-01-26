/**
 * Creative Mixer Engine
 * 
 * The ultimate synthesis logic that blends structural DNA, real SVGs,
 * and visual tokens from multiple inspiration sources into a unique UI.
 */

import { InspirationProfile, ColorPalette, TypographyConfig, SpacingConfig, MotionConfig, ComponentStyleConfig } from './inspiration-profile';
import { InspirationProfileBuilder } from './inspiration-profile';
import { URLAnalysisResult } from './url-analyzer';
import { AppliedTuners } from '../blocks/types';

export class CreativeMixer {
    /**
     * Blend up to 5 analysis results into a single unique InspirationProfile
     */
    static mix(results: URLAnalysisResult[]): InspirationProfile {
        if (results.length === 0) throw new Error('No analysis results to mix');

        // 1. Synthesize the visual tokens
        const profile = this.synthesizeProfile(results);

        // 2. Synthesize the Structure (Archetype Blending)
        const structure = this.synthesizeStructure(results);

        // 3. Harvest Assets
        const assets = this.harvestAssets(results);

        // 4. Update core profile with these additions
        const builder = new InspirationProfileBuilder(profile.name);
        // Copy existing
        builder.colors(profile.colors);
        builder.typography(profile.typography);
        builder.spacing(profile.spacing);
        builder.motion(profile.motion);
        builder.componentStyles(profile.componentStyles);
        builder.tuners(profile.tuners);

        // Add new
        builder.archetypes(structure);
        builder.assets(assets);

        // Literal Motion Synthesis
        const combinedMotion = results.map(r => r.motionCSS).filter(Boolean).join('\n');
        builder.motionCSS(combinedMotion);

        // Name synthesis
        const sourceNames = results.slice(0, 3).map(r => new URL(r.url).hostname.replace('www.', '').split('.')[0]);
        builder.name(`DNA Mix of ${sourceNames.join(' + ')}`);

        return builder.build();
    }

    private static synthesizeProfile(results: URLAnalysisResult[]): InspirationProfile {
        const builder = new InspirationProfileBuilder('Mixed Vibe');

        // Take primary color from the most "vibrant" result (heuristic)
        const vibrantResult = results.sort((a, b) =>
            (b.extractedColors.accents.length) - (a.extractedColors.accents.length)
        )[0];

        const isLikelyDark = results.filter(r => r.extractedColors.backgrounds.some(c => c === '#000000' || c === '#09090B')).length > results.length / 2;

        builder.colors({
            primary: vibrantResult.extractedColors.accents[0] || '#6157FF',
            primaryForeground: '#FFFFFF',
            secondary: results[1]?.extractedColors.accents[0] || '#8B5CF6',
            secondaryForeground: '#FFFFFF',
            accent: results[2]?.extractedColors.accents[0] || '#00D4FF',
            accentForeground: '#FFFFFF',
            background: {
                light: results.find(r => r.extractedColors.backgrounds.some(c => c === '#FFFFFF'))?.extractedColors.backgrounds[0] || '#FFFFFF',
                dark: results.find(r => r.extractedColors.backgrounds.some(c => c === '#000000' || c.includes('rgba(0,0,0')))?.extractedColors.backgrounds[0] || '#070912'
            },
            foreground: { light: '#0A0A0B', dark: '#FFFFFF' },
            surface: {
                light: '#F8F9FA',
                dark: isLikelyDark ? '#0F111A' : '#1A1C2E'
            },
            muted: { light: '#8B8B8B', dark: '#525252' },
            mutedForeground: { light: '#525252', dark: '#8B8B8B' },
            border: { light: '#E5E5E5', dark: '#1E293B' },
            gradients: results.flatMap(r => r.cssVariables ? Object.entries(r.cssVariables).filter(([k]) => k.includes('gradient')).map(([k, v]) => ({
                id: k,
                type: 'linear' as const,
                cssValue: v,
                stops: []
            })) : []).slice(0, 5)
        });

        // Mashup Typography
        builder.typography({
            headingFont: results[0].extractedTypography.fontFamilies.slice(0, 1),
            bodyFont: results[1]?.extractedTypography.fontFamilies.slice(0, 1) || results[0].extractedTypography.fontFamilies.slice(0, 1),
            monoFont: ['JetBrains Mono', 'monospace'],
            scale: 'normal',
            headingWeight: 'bold',
            bodyWeight: 'normal',
            lineHeight: 'relaxed',
            letterSpacing: 'tight',
        });

        // Average Tuners
        // Extract reality-based tuners
        const totalMotion = results.flatMap(r => r.extractedMotion.animationTypes).length;
        const motionScore = Math.min(0.9, 0.4 + (totalMotion * 0.1));

        builder.tuners({
            abstraction: 0.7,
            density: 0.5,
            motion: motionScore,
            contrast: 0.7,
            narrative: 0.8
        });

        return builder.build();
    }

    private static synthesizeStructure(results: URLAnalysisResult[]): InspirationProfile['archetypes'] {
        const archetypes = results.map(r => r.extractedArchetypes);

        // Strategy: Pick the most common or 'best' archetype for each slot
        return {
            header: this.getDominant(archetypes.map(a => a?.header)) || 'sticky',
            hero: archetypes.find(a => a?.hero === 'bento') ? 'bento' : 'split',
            features: archetypes.find(a => a?.features === 'grid') ? 'grid' : 'vertical-stack',
        };
    }

    private static harvestAssets(results: URLAnalysisResult[]): InspirationProfile['assets'] {
        const allSVGs = results.flatMap(r => r.harvestedSVGs || []);

        return {
            logos: allSVGs.filter(s => s.category === 'logo').map(s => s.svg),
            patterns: allSVGs.filter(s => s.category === 'pattern').map(s => s.svg),
            icons: allSVGs.filter(s => s.category === 'icon').map(s => s.svg),
        };
    }

    private static getDominant(items: (string | undefined)[]): string | undefined {
        const counts: Record<string, number> = {};
        items.forEach(item => {
            if (item) counts[item] = (counts[item] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    }
}
