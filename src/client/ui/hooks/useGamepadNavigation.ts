import { RunService, UserInputService } from '@rbxts/services';
import { useRef, useState } from '@rbxts/react';
import { useEventListener } from '@rbxts/pretty-react-hooks';
import { useAtom } from '@rbxts/react-charm';

import { Controller } from 'shared/controller';
import { InputType } from 'client/inputType';

interface NavigationPoint {
	position: Vector2;
}

export function useGamepadNavigation(points: Array<NavigationPoint>, onSelect?: (index: number) => void): LuaTuple<[number | undefined, (index: number) => void]> {
	const inputType = useAtom(InputType.stateAtom);
	
	const [focusedIndex, setFocusedId] = useState<number>(-1);
	
	const directionRef = useRef<Controller.Direction>(Controller.Direction.None);
	
	const findNextPoint = (current: NavigationPoint, index: number, direction: Controller.Direction): number => {
		const possiblePoints = points.filter((_, i) => i !== index);
		
		const filteredPoints = possiblePoints.filter((point) => {
			switch (direction) {
				case Controller.Direction.Up: {
					return point.position.Y < current.position.Y;
				}
				case Controller.Direction.Down: {
					return point.position.Y > current.position.Y;
				}
				case Controller.Direction.Left: {
					return point.position.X < current.position.X;
				}
				case Controller.Direction.Left: {
					return point.position.X > current.position.X;
				}
			}
			
			return false;
		});
		
		if (filteredPoints.size() === 0) {
			return -1;
		}
		
		const sortedPoints = filteredPoints.sort((a, b) => {
			return a.position.sub(current.position).Magnitude < b.position.sub(current.position).Magnitude;
		});
		
		const firstPoint = sortedPoints[0];
		for (const i of $range(0, points.size() - 1)) {
			if (points[i].position === firstPoint.position) {
				return i;
			}
		}
		
		return -1;
	}
	
	useEventListener(RunService.RenderStepped, () => {
		if (inputType !== InputType.Value.Controller || focusedIndex === -1) {
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
		
		const nextId = findNextPoint(current, focusedIndex, direction);
		if (nextId === -1) {
			return;
		}
		
		setFocusedId(nextId);
		onSelect?.(nextId);
		directionRef.current = Controller.Direction.None;
	});
	
	useEventListener(UserInputService.InputChanged, (input, processed) => {
		if (processed || inputType !== InputType.Value.Controller) {
			return;
		}
		
		if (input.KeyCode === Controller.UINavigationThumbstick) {
			directionRef.current = Controller.getThumbstickDirection(input.Position);
		}
	});
	
	useEventListener(UserInputService.InputEnded, (input, processed) => {
		if (processed || inputType !== InputType.Value.Controller) {
			return;
		}
		
		if (input.KeyCode === Controller.UINavigationThumbstick) {
			directionRef.current = Controller.Direction.None;
		}
	});
	
	return $tuple(inputType === InputType.Value.Controller ? focusedIndex : undefined, (key) => setFocusedId(key));
}
