export function isGm() {
	return game.users.get(game.userId).isGM;
}