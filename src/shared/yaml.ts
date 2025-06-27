import String from './string';

export default class YAML {
	static encode(this: void, obj: any, indentLevel = 0): string {
		const indent = '  '.rep(indentLevel);
		
		let result = '';
		for (const [key, value] of pairs(obj)) {
			const keyType = type(key);
			if (keyType === 'string') {
				result += `${indent}${tostring(key)}:`;
			} else if (keyType === 'number') {
				result += `${indent}-`;
			} else {
				throw `[shared::yaml] unsupported table key type: ${type(key)}`;
			}
			
			switch (type(value)) {
				case 'table': {
					const encoded = YAML.encode(value, indentLevel + 1);
					if (keyType === 'string') {
						result += `\n${encoded}`;
					} else if (keyType === 'number') {
						result += ` ${String.trimStart(encoded)}`;
					}
					break;
				}
				case 'string': {
					result += ` "${value}"\n`;
					break;
				}
				default: {
					result += ` ${tostring(value)}\n`;
					break;
				}
			}
		}
		
		return result;
	}
}
