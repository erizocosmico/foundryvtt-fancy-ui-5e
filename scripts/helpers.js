Handlebars.registerHelper("ifNotEmpty", (input, block) => {
  if (
    input &&
    ((input.length && input.length > 0) || (input.size && input.size > 0))
  ) {
    return block.fn(this);
  }
});

const actionTypeNames = {
  action: "actions",
  bonus: "bonus_actions",
  reaction: "reactions",
  crew: "crew_actions",
};

Handlebars.registerHelper("actionTypeName", (type) => {
  const key = actionTypeNames[type] || "other_actions";
  return game.i18n.localize(`FANCYUI5E.${key}`);
});

Handlebars.registerHelper("modifier", (x) => (x < 0 ? x : `+${x}`));

Handlebars.registerHelper("abilityName", (id) =>
  game.i18n.localize(`DND5E.Ability${id.titleCase()}Abbr`)
);

Handlebars.registerHelper("skillName", (id) =>
  game.i18n.localize(`DND5E.Skill${id.titleCase()}`)
);

Handlebars.registerHelper("firstWord", (str) => str.split(" ")[0]);