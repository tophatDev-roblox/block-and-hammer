export async function applyLeaderstats(player: Player): Promise<void> {
	const leaderstatsFolder = new Instance('Folder');
	leaderstatsFolder.Name = 'leaderstats';
	
	const altitudeStat = new Instance('IntValue');
	altitudeStat.Value = 0;
	altitudeStat.Name = 'Altitude';
	altitudeStat.Parent = leaderstatsFolder;
	
	const areaStat = new Instance('StringValue');
	areaStat.Value = '--';
	areaStat.Name = 'Area';
	areaStat.Parent = leaderstatsFolder;
	
	leaderstatsFolder.Parent = player;
}
