import { defineConfig } from 'vitest/config';
import replace from '@rollup/plugin-replace';

export default defineConfig({
	base: '',
	build: {
		rollupOptions: {
			plugins: [
				//  Toggle the booleans here to enable / disable Phaser 3 features:
				replace({
					'typeof CANVAS_RENDERER': "'true'",
					'typeof WEBGL_RENDERER': "'true'",
					'typeof EXPERIMENTAL': "'true'",
					'typeof PLUGIN_CAMERA3D': "'false'",
					'typeof PLUGIN_FBINSTANT': "'false'",
					'typeof FEATURE_SOUND': "'true'"
				}) as any
			],
			makeAbsoluteExternalsRelative: true
		},
		emptyOutDir: true
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true
	}
});
