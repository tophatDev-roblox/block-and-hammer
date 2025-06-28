export namespace Raycast {
	export function params(filterType: Enum.RaycastFilterType, parts: Array<Instance>): RaycastParams {
		const raycastParameters = new RaycastParams();
		raycastParameters.FilterType = filterType;
		raycastParameters.FilterDescendantsInstances = parts;
		return raycastParameters;
	}
}
