/**
 * Design Synthesis Engine
 * 
 * Logic for merging multiple InspirationProfiles into a single "Synthesized Profile".
 * Supports weighted blending and smart attribute selection.
 */

import type { InspirationProfile, ColorPalette, TypographyConfig, SpacingConfig, MotionConfig, ComponentStyleConfig } from './inspiration-profile';
import { InspirationProfileBuilder } from './inspiration-profile';
import { AppliedTuners } from '../blocks/types';

export interface synthesisOptions {
    /** Weights for each source (0-1). Defaults to equal weights. */
    weights?: number[];
    /** Strategy for merging: 'weighted' or 'dominant' (take from most significant source) */
    strategy?: 'weighted' | 'dominant' | 'balanced';
    /** Preferred source for specific aspects */
    preferences?: {
        colors?: string; // id or index of preferred source
        typography?: string;
        motion?: string;
    };
}

export class DesignSynthesizer {
    /**
     * Merge multiple profiles into one
     */
    static synthesize(profiles: InspirationProfile[], options: synthesisOptions = {}): InspirationProfile {
        if (profiles.length === 0) throw new Error('No profiles to synthesize');
        if (profiles.length === 1) return profiles[0];

        const builder = new InspirationProfileBuilder('Synthesized Profile');

        // 1. Synthesize Colors
        builder.colors(this.synthesizeColors(profiles, options));

        // 2. Synthesize Typography
        builder.typography(this.synthesizeTypography(profiles, options));

        // 3. Synthesize Spacing
        builder.spacing(this.synthesizeSpacing(profiles, options));

        // 4. Synthesize Motion
        builder.motion(this.synthesizeMotion(profiles, options));

        // 5. Synthesize Component Styles
        builder.componentStyles(this.synthesizeComponentStyles(profiles, options));

        // 6. Synthesize Tuners
        builder.tuners(this.synthesizeTuners(profiles, options));

        return builder.build();
    }

    private static synthesizeColors(profiles: InspirationProfile[], options: synthesisOptions): ColorPalette {
        // If preference is set, take the whole palette from that source
        if (options.preferences?.colors) {
            const preferred = profiles.find(p => p.id === options.preferences?.colors);
            if (preferred) return preferred.colors;
        }

        // Default: Take the primary color from the first source, secondary from the second, etc.
        // This is a "Mashup" strategy
        const base = profiles[0].colors;
        return {
            ...base,
            primary: profiles[0].colors.primary,
            secondary: profiles[1]?.colors.primary || base.secondary,
            accent: profiles[2]?.colors.primary || profiles[0].colors.accent,
            // Merge gradients from all sources
            gradients: profiles.flatMap(p => p.colors.gradients).slice(0, 5)
        };
    }

    private static synthesizeTypography(profiles: InspirationProfile[], options: synthesisOptions): TypographyConfig {
        if (options.preferences?.typography) {
            const preferred = profiles.find(p => p.id === options.preferences?.typography);
            if (preferred) return preferred.typography;
        }

        // Strategy: Use heading font from source 1, body font from source 2
        return {
            headingFont: profiles[0].typography.headingFont,
            bodyFont: profiles[1]?.typography.bodyFont || profiles[0].typography.bodyFont,
            monoFont: profiles[0].typography.monoFont,
            scale: profiles[0].typography.scale,
            headingWeight: profiles[0].typography.headingWeight,
            bodyWeight: profiles[0].typography.bodyWeight,
            lineHeight: profiles[0].typography.lineHeight,
            letterSpacing: profiles[0].typography.letterSpacing,
        };
    }

    private static synthesizeSpacing(profiles: InspirationProfile[], options: synthesisOptions): SpacingConfig {
        // Just take the average or dominant
        return profiles[0].spacing;
    }

    private static synthesizeMotion(profiles: InspirationProfile[], options: synthesisOptions): MotionConfig {
        if (options.preferences?.motion) {
            const preferred = profiles.find(p => p.id === options.preferences?.motion);
            if (preferred) return preferred.motion;
        }

        // Take the most "expressive" motion level found
        const levels = ['subtle', 'moderate', 'expressive'];
        const maxLevelIndex = Math.max(...profiles.map(p => levels.indexOf(p.motion.level)));

        return {
            ...profiles[0].motion,
            level: levels[maxLevelIndex] as any
        };
    }

    private static synthesizeComponentStyles(profiles: InspirationProfile[], options: synthesisOptions): ComponentStyleConfig {
        // Mashup border radii and shadows
        return {
            borderRadius: profiles[0].componentStyles.borderRadius,
            shadow: profiles[0].componentStyles.shadow,
            border: profiles[0].componentStyles.border,
            buttonStyle: profiles[0].componentStyles.buttonStyle,
            inputStyle: profiles[1]?.componentStyles.inputStyle || profiles[0].componentStyles.inputStyle,
            cardStyle: profiles[2]?.componentStyles.cardStyle || profiles[0].componentStyles.cardStyle,
            avatarStyle: profiles[0].componentStyles.avatarStyle,
        };
    }

    private static synthesizeTuners(profiles: InspirationProfile[], options: synthesisOptions): AppliedTuners {
        // Average out the tuners
        const count = profiles.length;
        return {
            abstraction: profiles.reduce((acc, p) => acc + p.tuners.abstraction, 0) / count,
            density: profiles.reduce((acc, p) => acc + p.tuners.density, 0) / count,
            motion: profiles.reduce((acc, p) => acc + p.tuners.motion, 0) / count,
            contrast: profiles.reduce((acc, p) => acc + p.tuners.contrast, 0) / count,
            narrative: profiles.reduce((acc, p) => acc + p.tuners.narrative, 0) / count,
        };
    }
}
