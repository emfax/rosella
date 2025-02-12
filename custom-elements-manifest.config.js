import { LitElement } from "lit";

export default {
    /** Globs to analyze */
    globs: ['src/components/**/*.component.ts'],
    exclude: ['**/*.styles.ts', '**/*.test.ts'],
    /** Directory to output CEM to */
    outdir: 'dist',
    /** Enable handling of Lit Elements */
    litelement: true,
};