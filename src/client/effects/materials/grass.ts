const attachment = new Instance('Attachment');

const particleEmitter = new Instance('ParticleEmitter');
particleEmitter.EmissionDirection = Enum.NormalId.Front;
particleEmitter.Size = new NumberSequence(1);
particleEmitter.Texture = 'rbxassetid://79523797143801';
particleEmitter.Enabled = false;
particleEmitter.Rate = 0;
particleEmitter.Transparency = new NumberSequence(0.4, 1);
particleEmitter.Rotation = new NumberRange(0, 360);
particleEmitter.RotSpeed = new NumberRange(-60, 60);
particleEmitter.Speed = new NumberRange(20, 35);
particleEmitter.SpreadAngle = new Vector2(15, 15);
particleEmitter.Acceleration = new Vector3(0, -60, 0);
particleEmitter.Drag = 2;
particleEmitter.Parent = attachment;

export = attachment;
