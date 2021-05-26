import "./helpers.js";
import {
  getCharacter,
  getPartyCharacters,
  characterData,
} from "./character.js";
import * as actions from "./actions.js";

Hooks.on("renderApplication", async function () {
  if (!isGm()) {
    await renderCharacter();
  }

  await renderParty();

  if (isGm()) {
    $("#players").removeClass("hidden");
  } else {
    $("#players").addClass("hidden");
  }
});

Hooks.on("updateActor", async function (actor) {
  if (!isGm() && actor.id === getCharacter()?.id) {
    await renderCharacter();
  }

  await renderParty();
});

Hooks.on("updateOwnedItem", async function (actor, _, diff) {
  if (isGm() || actor.id !== getCharacter()?.id) {
    return;
  }

  // Wait a little bit so the item is updated and can be rendered
  // correctly in the actions list.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (diff.flags && diff.flags["character-actions-list-5e"]) {
    await renderCharacter();
  }
});

Hooks.once("init", async () => {
  $("body.game").append('<div id="player-character"></div>');
  $("body.game").append('<div id="party"></div>');

  await loadTemplates([
    "modules/fancy-ui-5e/templates/character.hbs",
    "modules/fancy-ui-5e/templates/party.hbs",
  ]);

  activatePlayerListeners();
  activatePartyListeners();
});

function activatePlayerListeners() {
  $(document).on("click", "#player-character .sheet", actions.openSheet);
  setupHealthPointsTracker("#current-health");
  $(document).on("click", "#player-character .action", actions.rollAction);
  $(document).on("click", "#player-character .skill", actions.rollSkill);
  $(document).on("click", "#player-character .save", actions.rollSave);
  $(document).on("click", "#player-character .ability", actions.rollAbility);
  $(document).on("click", "#player-character .actions-toggle", toggleActions);
  $(document).on("click", "#player-character .stats-toggle", toggleStats);
}

function toggleActions(e) {
  e.stopPropagation();
  $(".character-actions").toggleClass("show");
  $(".character-stats").removeClass("show");
}

function toggleStats(e) {
  e.stopPropagation();
  $(".character-stats").toggleClass("show");
  $(".character-actions").removeClass("show");
}

function activatePartyListeners() {
  $(document).on("dblclick", "#party .character-picture", actions.openSheet);
  $(document).on("click", "#party .character-picture", actions.selectToken);
  setupHealthPointsTracker("#party .current-health");
}

function setupHealthPointsTracker(element) {
  $(document).on("focus", element, function () {
    this.value = "";
  });

  $(document).on("blur", element, function () {
    this.value = this.dataset.value;
  });

  $(document).on("keyup", element, function (e) {
    if (e.keyCode !== 13) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const actor = game.actors.get(this.dataset.id);
    if (!actor) {
      return;
    }

    const current = this.dataset.value;
    const text = this.value.trim();

    let dmg;
    if (text.startsWith("+") || text.startsWith("-")) {
      dmg = -Number(text);
    } else {
      const num = Number(text);
      dmg = num > current ? -(num - current) : current - num;
    }

    if (!isNaN(dmg)) {
      actor.applyDamage(dmg);
    }
  });
}

function isGm() {
  return game.users.get(game.userId).isGM;
}

async function renderCharacter() {
  const elem = document.getElementById("player-character");
  if (!elem) return;

  const character = getCharacter();
  if (!character) return;

  const data = characterData(character);
  if (!data) return;

  const tpl = await renderTemplate(
    "modules/fancy-ui-5e/templates/character.hbs",
    data
  );

  elem.innerHTML = tpl;
}

async function renderParty() {
  const elem = document.getElementById("party");
  if (!elem) return;

  const characters = getPartyCharacters().map(characterData);

  const tpl = await renderTemplate("modules/fancy-ui-5e/templates/party.hbs", {
    characters,
  });

  elem.innerHTML = tpl;

  elem.style.top = `${window.innerHeight / 2 - elem.clientHeight / 2}px`;
}
