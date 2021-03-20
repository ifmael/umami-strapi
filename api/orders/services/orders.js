"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */
const { ConectorPlugin } = require("./ConectorPlugin");
const { generateDocument } = require("./orders.functions");

module.exports = {
  print: (orderInput) => {
    try {
      const conector = new ConectorPlugin();
      const constant = ConectorPlugin.Constantes;
      const printerName = "TICKETS";

      generateDocument(orderInput, conector, constant);

      conector.imprimirEn(printerName).then(
        (printed) => {
          if (!printed) {
            strapi.services["printing-errors"].createError(orderInput.id);
          }
        },
        (error) => {
          strapi.services["printing-errors"].createError(orderInput.id, error);
        }
      );
    } catch (error) {
      strapi.services["printing-errors"].createError(orderInput.id, error);
    }
  },
};
