declare module '@env' {
	export const API_BASE_URL: string;
	export const GLEAP_TOKEN: string | undefined;
	export const NODE_ENV: 'production' | 'development' | 'test';
}
