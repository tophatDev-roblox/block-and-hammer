import { Centurion } from '@rbxts/centurion';

const server = Centurion.server();

server.registry.registerGroup(
	{ name: 'dollars', description: 'subcommands for changing your dollars amount' },
);

const commandsContainer = script.FindFirstChild('commands')!;
server.registry.load(commandsContainer);

server.start();
