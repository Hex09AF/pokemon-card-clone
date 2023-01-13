import MyCard from "./Card.vue";

export default {
  title: "Example/Card",
  component: MyCard,
  parameters: {
    layout: "fullscreen",
  },
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { MyCard },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    // Story args can be spread into the returned object
    return { ...args };
  },
  // Then, the spread values can be accessed directly in the template
  template: "<my-card />",
});

export const BaseCard = Template.bind({});
BaseCard.args = {};
