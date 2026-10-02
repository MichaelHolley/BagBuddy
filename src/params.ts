import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	id: (param) => (/^[1-9]\d*$/.test(param) ? Number(param) : undefined)
});
