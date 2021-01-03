const axios = require("axios");

module.exports = {
  resolver: {
    Mutation: {
      createIngredient: {
        description: "Trying a custom resolver for createIngredient mutation",
        resolverOf: "application::ingredient.ingredient.create",
        resolver: async (obj, options, { context }) => {
          // const where = context.params;
          const data = context.request.body;
          const ingredientResponse = await strapi.api.ingredient.services.ingredient.addIngredient(
            data
          );

          const response = await axios({
            url: "https://cat-fact.herokuapp.com/facts",
            method: "GET",
          });

          console.log(response.data);

          return new Promise(async (resolve) => {
            setTimeout(() => resolve(ingredientResponse), 3000);
          });
        },
      },
    },
  },
};
