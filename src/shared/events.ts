import { createRemotes, remote, Server } from '@rbxts/remo';

export const Remotes = createRemotes({
	fullReset: remote<Server>(),
});
