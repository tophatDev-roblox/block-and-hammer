const unreservedURLCharacters = new Set<string>(['-', '_', '.', '~']);

for (const i of $range(48, 57)) { // 0-9
	unreservedURLCharacters.add(utf8.char(i));
}

for (const i of $range(65, 90)) { // A-Z
	unreservedURLCharacters.add(utf8.char(i));
}

for (const i of $range(97, 122)) { // a-z
	unreservedURLCharacters.add(utf8.char(i));
}

export default function encodeURIComponent(uriComponent: string): string {
	const totalCodes = uriComponent.size();
	
	const buff = buffer.create(totalCodes);
	buffer.writestring(buff, 0, uriComponent);
	
	const result = new Array<string>();
	for (const i of $range(1, totalCodes)) {
		const code = buffer.readu8(buff, i - 1);
		const character = utf8.char(code);
		if (unreservedURLCharacters.has(utf8.char(code))) {
			result.push(character);
		} else {
			result.push('%%%02X'.format(code));
		}
	}
	
	return result.join('');
}
