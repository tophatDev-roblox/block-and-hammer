import { Client, createRemotes, remote, Server } from '@rbxts/remo';

export const Remotes = createRemotes({
	fullReset: remote<Server>().returns<true>(),
	unloadCharacter: remote<Server>(),
	sendSystemMessage: remote<Client, [message: string]>(),
});
