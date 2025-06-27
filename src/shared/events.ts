import { createRemotes, remote, Server } from '@rbxts/remo';

export const remotes = createRemotes({
	fullReset: remote<Server>(),
});
