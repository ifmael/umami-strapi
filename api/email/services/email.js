"use strict";

/**
 * `email` service.
 */

const from = "print@umami.com";
const to = "ismael.rm.1986@gmail.com";
const cc = "ismael.rm.1986@gmail.com";

module.exports = {
  sendKO: (orderId, error) => {
    const subject = `Fallo de impresion. Pedido: ${orderId}`;
    const text = `Revisa si se ha tienes otro email indicando si se ha imprimido correctamente el pedido: ${orderId}.
            Si no lo has recibido, puedes generar la impresión manualmente consultando el panel de administración e introduciendo los datos en el TPV

            ${error ? error.toString() : ""}`;

    return strapi.plugins["email"].services.email.send({
      to,
      from,
      cc,
      subject,
      text: text,
      html: text,
    });
  },

  sendOK: (orderId) => {
    const subject = `Se ha enviado a imprimir el pedido ${orderId}. Revisa la impresora.`;
    const text = `Se ha recuperado un error previo de impresion para el pedido ${orderId}. Revisalo por si hubiese algun otro problema no contemplado`;

    return strapi.plugins["email"].services.email.send({
      to,
      from,
      cc,
      subject,
      text: text,
      html: text,
    });
  },
};
