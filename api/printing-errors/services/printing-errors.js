"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  createError: (orderId, error) => {
    try {
      strapi.query("printing-errors").create({
        status: "KO",
        order: orderId,
      });

      strapi.services.email.sendKO(orderId, error);
    } catch (error) {
      console.log(error);
    }
  },
  fixError: (printingErrorId, orderId) => {
    try {
      strapi
        .query("printing-errors")
        .update({ id: printingErrorId }, { status: "OK" });

      strapi.services.email.sendOK(orderId);
    } catch (error) {
      console.log(error);
    }
  },
  unfixedError: async (printingErrorId) => {
    try {
      return strapi
        .query("printing-errors")
        .update({ id: printingErrorId }, { status: "UNFIXED" });
    } catch (error) {
      console.log(error);
    }
  },
};
