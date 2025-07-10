import { Client, createRemotes, remote, Server } from '@rbxts/remo';

import { InputType } from 'shared/inputType';

export const Remotes = createRemotes({
	fullReset: remote<Server>().returns<true>(),
	unloadCharacter: remote<Server>(),
	sendSystemMessage: remote<Client, [message: string]>(),
	updateInputType: remote<Server, [inputType: InputType]>(
		(input) => input === InputType.Desktop || input === InputType.Touch || input === InputType.Controller,
	),
});
