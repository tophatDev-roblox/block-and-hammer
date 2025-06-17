-- https://github.com/EgoMoose/Articles/blob/master/3d%20triangles/3D%20triangles.md

local function draw3dTriangle(a, b, c, w1, w2)
	local ab, ac, bc = b - a, c - a, c - b
	local abd, acd, bcd = ab:Dot(ab), ac:Dot(ac), bc:Dot(bc)
	
	if (abd > acd and abd > bcd) then
		c, a = a, c
	elseif (acd > bcd and acd > abd) then
		a, b = b, a
	end
	
	ab, ac, bc = b - a, c - a, c - b
	
	local right = ac:Cross(ab).unit
	local up = bc:Cross(right).unit
	local back = bc.unit
	
	local height = math.abs(ab:Dot(up))
	
	w1.Size = Vector3.new(0, height, math.abs(ab:Dot(back)))
	w1.CFrame = CFrame.fromMatrix((a + b)/2, right, up, back)
	
	w2.Size = Vector3.new(0, height, math.abs(ac:Dot(back)))
	w2.CFrame = CFrame.fromMatrix((a + c)/2, -right, up, -back)
end

return draw3dTriangle
