"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */
const fs = require("fs");
const { ConectorPlugin } = require("./ConectorPlugin");
const { groupByCategories, justifyLine } = require("./orders.functions");
const printerWidth = 48;
const tab = "  ";

const textBurger = (burger) => {
  try {
    const titleAndPrice = justifyLine(
      burger.name,
      `${burger.price.toFixed(2)}E`,
      printerWidth
    );
    const textIndredients = !!burger.ingredients
      ? burger.ingredients
          .split("||")
          .map((element, index) =>
            index === 0 ? `${tab}${element}\n` : `${tab}${element.slice(1)}\n`
          )
          .join("")
          .replace(/·/g, "-")
      : "";

    return `${titleAndPrice}\n${tab}- ${burger.meatPoint}\n${tab}- ${burger.typeOfMeat}\n${textIndredients}`;
  } catch (error) {
    console.log(error);
  }
};

const textSandwidch = (sandwich) => {
  const titleAndPrice = justifyLine(
    sandwich.name,
    `${sandwich.price.toFixed(2)}E`,
    printerWidth
  );

  const textIndredients = !!sandwich.ingredients
    ? sandwich.ingredients
        .split("||")
        .map((element, index) =>
          index === 0 ? `${tab}${element}\n` : `${tab}${element.slice(1)}\n`
        )
        .join("")
        .replace(/·/g, "-")
    : "";

  return `${titleAndPrice}\n${tab}- ${sandwich.typeOfBread}\n${textIndredients}`;
};

module.exports = {
  print: (shoppingCartInput) => {
    try {
      // delivery components
      const deliveryLocalComponent = "contact.in-local";
      const deliveryHomeComponent = "contact.contact";

      const printerName = "printer-01";
      const image = `${__dirname}\\umami.jpg`;
      const line = "=================================";
      const { deliveryOptions, shoppingCart } = shoppingCartInput;

      let conector = new ConectorPlugin();

      conector.cortar();
      // conector.cortarParcialmente();

      // Header
      conector.establecerJustificacion(
        ConectorPlugin.Constantes.AlineacionCentro
      );
      // conector.feed(1);
      if (fs.existsSync(image)) conector.imagenLocal(image);
      conector.feed(1);
      conector.establecerJustificacion(
        ConectorPlugin.Constantes.AlineacionCentro
      );

      //Client info
      conector.establecerEnfatizado(1);
      conector.texto("DATOS DEL CLIENTE\n\n");
      conector.establecerEnfatizado(0);
      conector.establecerJustificacion(
        ConectorPlugin.Constantes.AlineacionIzquierda
      );
      const [deliveryInfo] = deliveryOptions;

      if (deliveryInfo.__component === deliveryLocalComponent) {
        deliveryInfo.name && conector.texto(`Nombre: ${deliveryInfo.name} \n`);
        deliveryInfo.phone &&
          conector.texto(`Telefono: ${deliveryInfo.phone}\n`);
        deliveryInfo.time &&
          conector.texto(`Hora: ${deliveryInfo.time.slice(0, 5)}\n`);
      } else if (deliveryInfo.__component === deliveryHomeComponent) {
        deliveryInfo.street &&
          conector.texto(`Calle: ${deliveryInfo.street}\n`);
        deliveryInfo.number && conector.texto(`Numero: ${deliveryInfo.number}`);
        deliveryInfo.block && conector.texto(`  Bloque: ${deliveryInfo.block}`);
        deliveryInfo.flat && conector.texto(`  Piso: ${deliveryInfo.flat}`);
        conector.feed(1);
        deliveryInfo.locality &&
          conector.texto(`Localidad: ${deliveryInfo.locality}\n`);
        deliveryInfo.phone &&
          conector.texto(`Telefono: ${deliveryInfo.phone}\n`);
        deliveryInfo.time &&
          conector.texto(`Hora: ${deliveryInfo.time.slice(0, 5)}\n`);
      }
      conector.establecerJustificacion(
        ConectorPlugin.Constantes.AlineacionCentro
      );
      conector.texto(line);
      conector.feed(2);
      conector.establecerJustificacion(
        ConectorPlugin.Constantes.AlineacionIzquierda
      );

      // Order Info
      conector.texto("Origen: APP\n");
      shoppingCartInput.id && conector.texto(`Id: ${shoppingCartInput.id}\n`);
      shoppingCartInput.createdAt &&
        conector.texto(
          `Fecha: ${shoppingCartInput.createdAt.getHours()}:${shoppingCartInput.createdAt.getMinutes()} ${shoppingCartInput.createdAt.getDate()}/${
            shoppingCartInput.createdAt.getMonth() + 1
          }/${shoppingCartInput.createdAt.getFullYear()}\n`
        );
      conector.establecerJustificacion(
        ConectorPlugin.Constantes.AlineacionCentro
      );
      conector.texto(line);
      conector.feed(2);

      // Shopping Cart
      const shoppingCartByCategories = groupByCategories(shoppingCart);

      shoppingCartByCategories.forEach(
        ({ component, title, data: products }) => {
          conector.establecerJustificacion(
            ConectorPlugin.Constantes.AlineacionCentro
          );
          conector.establecerEnfatizado(1);
          conector.establecerTamanioFuente(2, 2);
          conector.texto(`${title}\n`);
          conector.establecerTamanioFuente(1, 1);
          conector.establecerEnfatizado(0);
          conector.establecerJustificacion(
            ConectorPlugin.Constantes.AlineacionIzquierda
          );

          if (component === "shopping-cart.menu") {
            products.forEach((product) => {
              if (!!product.burger) {
                conector.texto(textBurger(product.burger));
              } else if (!!product.sandwich) {
                conector.texto(textSandwidch(product.sandwich));
              }
              product.side && conector.texto(`${tab}- ${product.side.name}\n`);
              product.beverage &&
                conector.texto(`${tab}- ${product.beverage.name}\n`);
            });
          } else if (component === "shopping-cart.burger") {
            products.forEach((burger) =>
              conector.texto(`${textBurger(burger)}\n`)
            );
          } else if (component === "shopping-cart.sandwich") {
            products.forEach((sandwich) =>
              conector.texto(`${textSandwidch(sandwich)}\n`)
            );
          } else if (
            component === "shopping-cart.salad" ||
            component === "shopping-cart.beverage" ||
            component === "shopping-cart.dessert" ||
            component === "shopping-cart.side"
          ) {
            products.forEach((product) =>
              conector.texto(
                `${justifyLine(
                  product.name,
                  `${product.price.toFixed(2)}E`,
                  printerWidth
                )}\n`
              )
            );
          }

          conector.feed(1);
        }
      );

      // Price
      conector.establecerJustificacion(
        ConectorPlugin.Constantes.AlineacionCentro
      );
      conector.texto(line);
      conector.feed(2);
      conector.establecerJustificacion(
        ConectorPlugin.Constantes.AlineacionDerecha
      );
      conector.establecerTamanioFuente(2, 2);
      conector.texto(`Total: ${shoppingCartInput.totalPrice.toFixed(2)}E\n`);
      conector.establecerTamanioFuente(1, 1);
      // Finish
      conector.feed(2);
      conector.cortar();

      conector.imprimirEn(printerName).then((respuestaAlImprimir) => {
        if (respuestaAlImprimir === true) {
          console.log("Impreso correctamente");
        } else {
          console.log("Error. La respuesta es: " + respuestaAlImprimir);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
};
