import { SoundService } from '@rbxts/services';

import { waitForChild } from 'shared/waitForChild';

(async () => {
	const sound = await waitForChild(SoundService, 'Leave', 'Sound');
	
	game.OnClose = () => {
		for (const sound of SoundService.GetChildren()) {
			if (sound.IsA('Sound')) {
				sound.Stop();
			}
		}
		
		SoundService.PlayLocalSound(sound);
		task.wait(sound.TimeLength);
	};
})();
