local min, max = 0.95, 1.05
local RNG = Random.new()
for _, part in game.Selection:Get() do
	local n = RNG:NextNumber(min, max)
	part.Color = Color3.new(
		part.Color.R * n,
		part.Color.G * n,
		part.Color.B * n
	)
end
