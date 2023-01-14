import MyCard from "./Card.vue";

export default {
  title: "Example/Card",
  component: MyCard,
};

const Template = (args) => ({
  components: { MyCard },
  setup() {
    return { args };
  },
  template: '<MyCard v-bind="args" />',
});

export const BaseCard = Template.bind({});
export const Showcase = Template.bind({});
Showcase.args = {
  name: "Vaporeon VMAX",
  supertype: "Pokémon",
  subtypes: ["VMAX", "Rapid Strike"],
  number: "SWSH182",
  rarity: "Rare Rainbow Alt",
  img: "https://images.pokemontcg.io/swshp/SWSH182_hires.png",
};
