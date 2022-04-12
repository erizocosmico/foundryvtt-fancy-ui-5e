export function getCharacter() {
  let character = game.users.get(game.userId).character;
  if (!character) {
    for (let actor of Array.from(game.actors.values())) {
      if (actor.owner) {
        character = actor;
        break;
      }
    }
  }

  return character;
}

export function getPartyCharacters() {
  const showOnlyActive = game.settings.get("fancy-ui-5e", "party-only-active");
  const characters = [];
  for (let user of game.users.values()) {
    if (user.character && user.character.data) {
      if (!showOnlyActive || user.active) {
        characters.push(user.character);
      }
    }
  }
  return characters;
}

export function characterData(c) {
  const { attributes, details, abilities, skills } = c.data.data;
  const items = Array.from(c.items.values());

  const characterClass = items.find((i) => i.type === "class");
  let hpPercent = (attributes.hp.value / attributes.hp.max) * 100;
  if (hpPercent >= 99) {
    hpPercent = 99;
  }
  const ac = Number(attributes.ac.value);

  const actions = items.find((i) => i.getFlag) ? getActions(items) : {};

  return {
    id: c.id,
    name: c.name,
    level: details.level,
    race: details.race,
    class: characterClass?.name || "",
    armor: isNaN(ac) ? 10 : ac,
    picture: c.img,
    hp: {
      value: attributes.hp.value,
      max: attributes.hp.max,
      percent: hpPercent,
      status: hpStatus(hpPercent),
    },
    ini: attributes.init.mod,
    speed: attributes.movement.walk,
    actions,
    abilities,
    skills,
  };
}

function getActivationType(activationType) {
  switch (activationType) {
    case "action":
    case "bonus":
    case "crew":
    case "reaction":
      return activationType;
    default:
      return "other";
  }
}

function getActions(items) {
  const { isItemInActionList } = game.modules.get(
    "character-actions-list-5e"
  ).api;

  return items.filter(isItemInActionList).reduce(
    (acc, item) => {
      var _a;
      try {
        const activationType = getActivationType(
          (_a = item.data.data.activation) === null || _a === void 0
            ? void 0
            : _a.type
        );
        acc[activationType].add(item);
        return acc;
      } catch (e) {
        return acc;
      }
    },
    {
      action: new Set(),
      bonus: new Set(),
      crew: new Set(),
      reaction: new Set(),
      other: new Set(),
    }
  );
}

function hpStatus(percent) {
  if (percent <= 25) {
    return "critical";
  }

  if (percent <= 50) {
    return "injured";
  }

  if (percent <= 75) {
    return "hurt";
  }

  return "healthy";
}
