import { isGm } from "./utils.js";

export function getCharacter() {
  if (isGm()) {
    const tokens = canvas.tokens.controlled;
    if (tokens.length === 0 || tokens.length > 1) return null;

    const token = tokens[0];
    return game.actors.get(token.document.actorId);
  }

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
  const showOnlyActive = game.settings.get('fancy-ui-5e', 'party-only-active');
  const characters = [];
  for (let user of game.users.values()) {
    if (user.character && user.character.system) {
      if (!showOnlyActive || user.active) {
        characters.push(user.character);
      }
    }
  }
  return characters;
}

export function characterData(c) {
  const { attributes, details, abilities, skills } = c.system;
  const items = Array.from(c.items.values());

  const characterClass = items.find((i) => i.type === 'class');
  let hpPercent = (attributes.hp.value / attributes.hp.max) * 100;
  if (hpPercent >= 99) {
    hpPercent = 99;
  }
  const ac = Number(attributes.ac.value);

  const actions = items.find((i) => i.getFlag) ? getActions(items) : {};

  return {
    id: c.id,
    isCharacter: c.type === 'character',
    name: c.name,
    level: details.level,
    race: details.race,
    class: characterClass?.name || '',
    armor: isNaN(ac) ? 10 : ac,
    picture: c.img,
    hp: {
      value: attributes.hp.value,
      max: attributes.hp.max,
      percent: hpPercent,
      status: hpStatus(hpPercent),
    },
    ini: attributes.init.mod || 0,
    speed: attributes.movement.walk,
    actions,
    abilities,
    skills,
  };
}

function getActivationType(activationType) {
  switch (activationType) {
    case 'action':
    case 'bonus':
    case 'crew':
    case 'reaction':
      return activationType;
    default:
      return 'other';
  }
}

function getActions(items) {
  return items.filter(isItemInActionList).reduce(
    (acc, item) => {
      var _a;
      try {
        const activationType = getActivationType(
          (_a = item.system.activation) === null || _a === void 0 ? void 0 : _a.type,
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
    },
  );
}

function isItemInActionList(item) {
  switch (item.type) {
    case 'weapon': {
      return item.system.equipped;
    }
    case 'equipment': {
      return item.system.equipped && isActiveItem(item.system.activation?.type);
    }
    case 'spell': {
      // only exclude spells which need to be prepared but aren't
      const notPrepared =
        item.system.preparation?.mode === 'prepared' && !item.system.preparation?.prepared;
      const isCantrip = item.system.level === 0;
      if (!isCantrip && notPrepared) {
        return false;
      }
      const isReaction = item.system.activation?.type === 'reaction';
      const isBonusAction = item.system.activation?.type === 'bonus';

      // ASSUMPTION: If the spell causes damage, it will have damageParts
      const isDamageDealer = item.system.damage?.parts?.length > 0;
      let shouldInclude = isReaction || isBonusAction || isDamageDealer;
      return shouldInclude;
    }
    case 'feat': {
      return !!item.system.activation?.type;
    }
    default: {
      return false;
    }
  }
}

function isActiveItem(activationType) {
  if (!activationType) {
    return false;
  }
  if (['minute', 'hour', 'day', 'none'].includes(activationType)) {
    return false;
  }
  return true;
}

function hpStatus(percent) {
  if (percent <= 25) {
    return 'critical';
  }

  if (percent <= 50) {
    return 'injured';
  }

  if (percent <= 75) {
    return 'hurt';
  }

  return 'healthy';
}
