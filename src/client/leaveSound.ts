import { SoundService } from '@rbxts/services';

const sound = SoundService.WaitForChild('Leave') as Sound;

game.OnClose = () => {
	SoundService.PlayLocalSound(sound);
	task.wait(sound.TimeLength);
};
