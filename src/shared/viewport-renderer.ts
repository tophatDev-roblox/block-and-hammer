export class ViewportRenderer {
	public disposed = false;
	public readonly camera: Camera;
	
	constructor(public readonly viewportFrame: ViewportFrame) {
		this.camera = new Instance('Camera');
		
		viewportFrame.CurrentCamera = this.camera;
	}
	
	public move(cframe: CFrame): ViewportRenderer {
		if (!this.disposed) {
			this.camera.CFrame = cframe;
		}
		
		return this;
	}
	
	public fov(fov: number): ViewportRenderer {
		if (!this.disposed) {
			this.camera.FieldOfView = fov;
		}
		
		return this;
	}
	
	public add(instance: Instance): ViewportRenderer {
		if (!this.disposed) {
			instance.Parent = this.viewportFrame;
		}
		
		return this;
	}
	
	public cleanup(): void {
		this.disposed = true;
		
		this.viewportFrame.CurrentCamera = undefined;
		this.viewportFrame.ClearAllChildren();
		
		this.camera.Destroy();
	}
}
