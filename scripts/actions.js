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

  if (window.rsr5e) {
    const item = actor.items.get(this.dataset.itemId);
    if (!item) return;
    item.use();
  } else if (window.BetterRolls) {
    actor.sheet._onItemRoll(e);
  }
}

export function rollAbility(_) {
  const actor = game.actors.get(this.dataset.characterId);
  if (!actor) return;

  if (window.rsr5e) {
    actor.rollAbilityTest(this.dataset.ability, {});
  } else if (window.BetterRolls) {
    BetterRolls.rollCheck(actor, this.dataset.ability, {});
  }
}

export function rollSkill(_) {
  const actor = game.actors.get(this.dataset.characterId);
  if (!actor) return;

  if (window.rsr5e) {
    actor.rollSkill(this.dataset.skill, {});
  } else if (window.BetterRolls) {
    BetterRolls.rollSkill(actor, this.dataset.skill, {});
  }
}

export function rollSave(e) {
  e.preventDefault();
  e.stopPropagation();

  const actor = game.actors.get(this.parentNode.dataset.characterId);
  if (!actor) return;

  if (window.rsr5e) {
    actor.rollAbilitySave(this.parentNode.dataset.ability, {});
  } else if (window.BetterRolls) {
    BetterRolls.rollSave(actor, this.parentNode.dataset.ability, {});
  }
}
