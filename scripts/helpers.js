Handlebars.registerHelper("ifNotEmpty", (input, block) => {
  if (
    input &&
    ((input.length && input.length > 0) || (input.size && input.size > 0))
  ) {
    return block.fn(this);
  }
});

const actionTypeNames = {
  action: "Acciones",
  bonus: "Acciones adicionales",
  reaction: "Reacciones",
  crew: "Acciones de tripulación",
};

Handlebars.registerHelper(
  "actionTypeName",
  (type) => actionTypeNames[type] || "Otras acciones"
);

Handlebars.registerHelper("modifier", (x) => (x < 0 ? x : `+${x}`));

Handlebars.registerHelper("abilityName", (id) =>
  game.i18n.localize(`DND5E.Ability${id.titleCase()}Abbr`)
);

Handlebars.registerHelper("skillName", (id) =>
  game.i18n.localize(`DND5E.Skill${id.titleCase()}`)
);

Handlebars.registerHelper("firstWord", (str) => str.split(" ")[0]);
