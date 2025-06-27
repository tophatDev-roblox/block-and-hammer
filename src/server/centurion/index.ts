import { Centurion } from '@rbxts/centurion';

const server = Centurion.server();

const commandsContainer = script.FindFirstChild('commands');
if (commandsContainer !== undefined) {
	server.registry.load(commandsContainer);
}

server.start();
