import { Centurion } from '@rbxts/centurion';

const server = Centurion.server();

const commandsContainer = script.FindFirstChild('commands')!;
server.registry.load(commandsContainer);

server.start();
