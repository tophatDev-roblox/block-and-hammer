declare module '*.rscss' {
	interface RobloxSCSSDefinition {
		[content: string]: string;
	}
	
	const styles: RobloxSCSSDefinition;
	export default styles;
}
