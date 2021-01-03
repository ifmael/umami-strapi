"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async addIngredient(data) {
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models.ingredient,
      data
    );

    const entry = await strapi.query("ingredient").create(validData);

    return entry;
  },
};
