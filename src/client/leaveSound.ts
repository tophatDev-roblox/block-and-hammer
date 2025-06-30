import { SoundService } from '@rbxts/services';

const sound = SoundService.WaitForChild('Leave') as Sound;

game.OnClose = () => {
	for (const sound of SoundService.GetChildren()) {
		if (sound.IsA('Sound')) {
			sound.Stop();
		}
	}
	
	SoundService.PlayLocalSound(sound);
	
	task.wait(sound.TimeLength);
};
