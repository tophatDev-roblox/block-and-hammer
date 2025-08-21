export const enum JoinMode {
	Round = 'round',
	Bevel = 'bevel',
	Miter = 'miter',
}

interface RichTextData {
	bold?: true;
	italic?: true;
	underline?: true;
	strikethrough?: true;
	uppercase?: true;
	smallcaps?: true;
	font: {
		color?: Color3;
		size?: number;
		family?: string;
		weight?: Enum.FontWeight;
		transparency?: number;
	};
	stroke?: {
		color?: Color3;
		joins?: JoinMode;
		thickness?: number;
		transparency?: number;
	};
	mark?: {
		color?: Color3;
		transparency?: number;
	};
}

export class RichText {
	constructor(
		public readonly data: RichTextData,
	) {}
	
	static parseAttributes(this: void, attributes: Record<string, string | number | undefined>): string {
		const result = new Array<string>();
		for (const [key, value] of pairs(attributes)) {
			result.push(`${key}="${value}"`);
		}
		
		return result.size() > 0 ? ` ${result.join(' ')}` : '';
	}
	
	static escape(this: void, str: string): string {
		return str.gsub('<', '&lt;')[0].gsub('>', '&gt;')[0];
	}
	
	public apply(str: string): string {
		if (this.data.bold) {
			str = `<b>${str}</b>`;
		}
		
		if (this.data.italic) {
			str = `<i>${str}</i>`;
		}
		
		if (this.data.underline) {
			str = `<u>${str}</u>`;
		}
		
		if (this.data.strikethrough) {
			str = `<s>${str}</s>`;
		}
		
		if (this.data.uppercase) {
			str = `<uc>${str}</uc>`;
		}
		
		if (this.data.smallcaps) {
			str = `<sc>${str}</sc>`;
		}
		
		if (this.data.font !== undefined) {
			const attributes = {
				color: this.data.font.color !== undefined ? `#${this.data.font.color.ToHex()}` : undefined,
				size: this.data.font.size,
				family: this.data.font.family,
				weight: this.data.font.weight?.Value,
				transparency: this.data.font.transparency,
			};
			
			str = `<font${RichText.parseAttributes(attributes)}>${str}</font>`;
		}
		
		if (this.data.stroke !== undefined) {
			const attributes = {
				color: this.data.stroke.color !== undefined ? `#${this.data.stroke.color.ToHex()}` : undefined,
				joins: this.data.stroke.joins,
				thickness: this.data.stroke.thickness,
				transparency: this.data.stroke.transparency,
			};
			
			str = `<stroke${RichText.parseAttributes(attributes)}>${str}</stroke>`;
		}
		
		if (this.data.mark !== undefined) {
			const attributes = {
				color: this.data.mark.color !== undefined ? `#${this.data.mark.color.ToHex()}` : undefined,
				transparency: this.data.mark.transparency,
			};
			
			str = `<mark${RichText.parseAttributes(attributes)}>${str}</mark>`;
		}
		
		return str;
	}
}
