import { RunService, UserInputService } from '@rbxts/services';
import { useRef, useState } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { Controller } from 'shared/controller';
import { InputType } from 'client/inputType';

// TODO: fix x position not working properly
export function useGamepadNavigation(focused: boolean, points: Array<Vector2>): LuaTuple<[number | undefined, (index: number) => void]> {
	const [focusedIndex, setFocusedIndex] = useState<number>(-1);
	
	const directionRef = useRef<Controller.Direction>(Controller.Direction.None);
	
	const inputType = useAtom(InputType.stateAtom);
	
	const findNextPoint = (current: Vector2, index: number, direction: Controller.Direction): number => {
		const possiblePoints = points.filter((_, i) => i !== index);
		
		const filteredPoints = possiblePoints.filter((point) => {
			switch (direction) {
				case Controller.Direction.Up: {
					return point.Y < current.Y;
				}
				case Controller.Direction.Down: {
					return point.Y > current.Y;
				}
				case Controller.Direction.Left: {
					return point.X < current.X;
				}
				case Controller.Direction.Right: {
					return point.X > current.X;
				}
			}
			
			return false;
		});
		
		if (filteredPoints.size() === 0) {
			return -1;
		}
		
		const sortedPoints = filteredPoints.sort((a, b) => {
			return a.sub(current).Magnitude < b.sub(current).Magnitude;
		});
		
		const firstPoint = sortedPoints[0];
		for (const i of $range(0, points.size() - 1)) {
			if (points[i] === firstPoint) {
				return i;
			}
		}
		
		return -1;
	}
	
	useEventListener(RunService.RenderStepped, () => {
		if (inputType !== InputType.Value.Controller || !focused || focusedIndex === -1) {
			return;
		}
		
		const direction = directionRef.current;
		if (direction === Controller.Direction.None) {
			return;
		}
		
		const current = points[focusedIndex];
		if (current === undefined) {
			return;
		}
		
		const nextIndex = findNextPoint(current, focusedIndex, direction);
		if (nextIndex === -1) {
			return;
		}
		
		setFocusedIndex(nextIndex);
		directionRef.current = Controller.Direction.None;
	});
	
	useEventListener(UserInputService.InputChanged, (input, processed) => {
		if (processed || inputType !== InputType.Value.Controller || !focused) {
			return;
		}
		
		if (input.KeyCode === Controller.UINavigationThumbstick) {
			directionRef.current = Controller.getThumbstickDirection(input.Position);
		}
	});
	
	useEventListener(UserInputService.InputEnded, (input, processed) => {
		if (processed || inputType !== InputType.Value.Controller || !focused) {
			return;
		}
		
		if (input.KeyCode === Controller.UINavigationThumbstick) {
			directionRef.current = Controller.Direction.None;
		}
	});
	
	return $tuple(inputType === InputType.Value.Controller ? focusedIndex : undefined, (key) => setFocusedIndex(key));
}
