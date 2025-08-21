import { StarterGui } from '@rbxts/services';

import { setTimeout } from '@rbxts/set-timeout';

function disableReset(): void {
	try {
		StarterGui.SetCore('ResetButtonCallback', false);
	} catch (err) {
		setTimeout(disableReset, 0.1);
	}
}

disableReset();
