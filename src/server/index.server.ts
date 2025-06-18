import './players';
import './centurion';

if (script.FindFirstChild('anticheat')) {
	require(script.FindFirstChild('anticheat') as ModuleScript);
} else {
	print('anticheat was not found');
}
