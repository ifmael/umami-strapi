// "use strict";
// const { ConectorPlugin } = require("../../api/orders/services/ConectorPlugin");
// const {
//   generateDocument,
// } = require("../../api/orders/services/orders.functions");

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

// module.exports = {
//   "1/1 * * * *": async () => {
//     try {
//       const errors = await strapi.query("printing-errors").find({
//         status: "KO",
//       });

//       if (Array.isArray(errors) && errors.length > 0) {
//         for (const error of errors) {
//           const conector = new ConectorPlugin();
//           const constantes = ConectorPlugin.Constantes;
//           const printerName = "printer-01";

//           generateDocument(error.order, conector, constantes);

//           conector.imprimirEn(printerName).then(
//             async (printed) => {
//               if (printed) {
//                 strapi.services["printing-errors"].fixError(
//                   error.id,
//                   error.order.id
//                 );
//               }
//             },
//             (error) => {
//               console.log(error);
//             }
//           );
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   },
//   "30 00 * * *": async () => {
//     try {
//       const errors = await strapi.query("printing-errors").find({
//         status: "KO",
//       });

//       if (Array.isArray(errors) && errors.length > 0) {
//         for (const error of errors) {
//           strapi.services["printing-errors"]
//             .unfixedError(error.id)
//             .catch((error) => console.log(error));
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   },
// };
