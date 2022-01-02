export function openSheet() {
  let actor = game.actors.get(this.dataset.character);
  if (actor) {
    actor.sheet.render(true);
  }
}

export function selectToken() {
  const actor = game.actors.get(this.dataset.character);
  if (!actor) return;

  const tokens = actor.getActiveTokens();
  if (tokens.length > 0) {
    tokens[0].control();
  }
}

export function rollAction(e) {
  const actor = game.actors.get(this.dataset.characterId);
  if (!actor) return;

  actor.sheet._onItemRoll(e);
}

export function rollAbility(_) {
  const actor = game.actors.get(this.dataset.characterId);
  if (!actor) return;

  BetterRolls.rollCheck(actor, this.dataset.ability, {});
}

export function rollSkill(_) {
  const actor = game.actors.get(this.dataset.characterId);
  if (!actor) return;

  BetterRolls.rollSkill(actor, this.dataset.skill, {});
}

export function rollSave(e) {
  e.preventDefault();
  e.stopPropagation();

  const actor = game.actors.get(this.parentNode.dataset.characterId);
  if (!actor) return;

  BetterRolls.rollSave(actor, this.parentNode.dataset.ability, {});
}
