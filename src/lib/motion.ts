import { prefersReducedMotion } from 'svelte/motion';
import {
	scale as baseScale,
	slide as baseSlide,
	type ScaleParams,
	type SlideParams
} from 'svelte/transition';

const reduced = () => (prefersReducedMotion.current ? { duration: 0 } : {});

export const slide = (node: Element, params?: SlideParams) =>
	baseSlide(node, { duration: 200, ...params, ...reduced() });

export const scale = (node: Element, params?: ScaleParams) =>
	baseScale(node, { duration: 300, ...params, ...reduced() });
