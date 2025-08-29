import { findFirstChild } from 'shared/wait-for-child';
import { Logger } from 'shared/logger';
import { Number } from 'shared/number';

const logger = new Logger('area-manager');

export namespace AreaManager {
	export const enum Area {
		Unknown = '--',
		Level1 = 'Level 1',
	}
	
	export type Region2 = [Vector2, Vector2];
}

export class AreaManager {
	public readonly areas = new Map<AreaManager.Area, AreaManager.Region2>();
	
	public processArea(area: Instance): void {
		if (!area.IsA('Model')) {
			return;
		}
		
		const pointA = findFirstChild(area, 'A', 'Part');
		const pointB = findFirstChild(area, 'B', 'Part');
		
		if (pointA === undefined || pointB === undefined) {
			logger.warn('area is missing A and B Part instances:', area.GetFullName());
			
			return;
		}
		
		const a = new Vector2(pointA.Position.X, pointA.Position.Y);
		const b = new Vector2(pointB.Position.X, pointB.Position.Y);
		
		this.areas.set(area.Name as AreaManager.Area, [a.Min(b), a.Max(b)]);
	}
	
	public isInArea(body: Part, region: AreaManager.Region2): boolean {
		const minimumX = region[0].X;
		const minimumY = region[0].Y;
		const maximumX = region[1].X;
		const maximumY = region[1].Y;
		
		return Number.isInRange(body.Position.X, minimumX, maximumX) && Number.isInRange(body.Position.Y, minimumY, maximumY);
	}
}
