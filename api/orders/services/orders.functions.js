// const { ConectorPlugin } = require("./ConectorPlugin");
const fs = require("fs");
const printerWidth = 48;
const tab = "  ";
const umamiLogoUrl =
  "https://umami-images.s3.eu-west-1.amazonaws.com/umami_1ef7ffeb2a.jpg";

const groupByCategories = (shoppingCart) => {
  try {
    const categories = [
      { component: "shopping-cart.menu", title: "Menu", data: [] },
      { component: "shopping-cart.burger", title: "Hamburguesas", data: [] },
      { component: "shopping-cart.sandwich", title: "Bocadillos", data: [] },
      { component: "shopping-cart.salad", title: "Ensaladas", data: [] },
      { component: "shopping-cart.side", title: "Complementos", data: [] },
      { component: "shopping-cart.beverage", title: "Bebidas", data: [] },
      { component: "shopping-cart.dessert", title: "Postres", data: [] },
    ];
    if (Array.isArray(shoppingCart) && shoppingCart.length > 0) {
      return shoppingCart
        .reduce((acc, shoppingCartItem) => {
          const { __component, _id, __v, id, ...rest } = shoppingCartItem;
          const categoryFound = acc.find(
            (category) => category.component === __component
          );
          if (categoryFound) {
            categoryFound.data.push(rest);
          }
          return acc;
        }, categories)
        .filter(({ data }) => data.length > 0);
    }
  } catch (error) {
    console.log(error);
  }
};

const justifyLine = (textLeft, textRight, width) => {
  const textLength = textLeft.length + textRight.length;
  const nSpaces = width - textLength;
  return `${textLeft}${"".padEnd(nSpaces, " ")}${textRight}`;
};

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

    const meatPoint = burger.meatPoint ? `- ${burger.meatPoint}\n${tab}` : "";

    return `${titleAndPrice}\n${tab}${meatPoint}- ${burger.typeOfMeat}\n${textIndredients}`;
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

const generateDocument = (orderInput, conector, constantes) => {
  // delivery components
  const deliveryLocalComponent = "contact.in-local";
  const deliveryHomeComponent = "contact.contact";

  const line = "=================================";
  const { deliveryOptions, shoppingCart } = orderInput;
  conector.cortar();

  // Header
  conector.establecerJustificacion(constantes.AlineacionCentro);
  conector.imagenDesdeUrl(umamiLogoUrl);
  conector.feed(1);
  conector.establecerJustificacion(constantes.AlineacionCentro);

  //Client info
  conector.establecerEnfatizado(1);
  conector.texto("DATOS DEL CLIENTE\n\n");
  conector.establecerEnfatizado(0);
  conector.establecerJustificacion(constantes.AlineacionIzquierda);
  const [deliveryInfo] = deliveryOptions;

  if (deliveryInfo.__component === deliveryLocalComponent) {
    deliveryInfo.name && conector.texto(`Nombre: ${deliveryInfo.name} \n`);
    deliveryInfo.phone && conector.texto(`Telefono: ${deliveryInfo.phone}\n`);
    deliveryInfo.time &&
      conector.texto(`Hora: ${deliveryInfo.time.slice(0, 5)}\n`);
  } else if (deliveryInfo.__component === deliveryHomeComponent) {
    deliveryInfo.street && conector.texto(`Calle: ${deliveryInfo.street}\n`);
    deliveryInfo.number && conector.texto(`Numero: ${deliveryInfo.number}`);
    deliveryInfo.block && conector.texto(`  Bloque: ${deliveryInfo.block}`);
    deliveryInfo.flat && conector.texto(`  Piso: ${deliveryInfo.flat}`);
    conector.feed(1);
    deliveryInfo.locality &&
      conector.texto(`Localidad: ${deliveryInfo.locality}\n`);
    deliveryInfo.phone && conector.texto(`Telefono: ${deliveryInfo.phone}\n`);
    deliveryInfo.time &&
      conector.texto(`Hora: ${deliveryInfo.time.slice(0, 5)}\n`);
  }
  conector.establecerJustificacion(constantes.AlineacionCentro);
  conector.texto(line);
  conector.feed(2);
  conector.establecerJustificacion(constantes.AlineacionIzquierda);

  // Order Info
  conector.texto("Origen: APP\n");
  orderInput.id && conector.texto(`Id: ${orderInput.id}\n`);
  orderInput.createdAt &&
    conector.texto(
      `Fecha: ${orderInput.createdAt.getHours()}:${orderInput.createdAt.getMinutes()} ${orderInput.createdAt.getDate()}/${
        orderInput.createdAt.getMonth() + 1
      }/${orderInput.createdAt.getFullYear()}\n`
    );
  conector.establecerJustificacion(constantes.AlineacionCentro);
  conector.texto(line);
  conector.feed(2);

  // Shopping Cart
  const shoppingCartByCategories = groupByCategories(shoppingCart);

  shoppingCartByCategories.forEach(({ component, title, data: products }) => {
    conector.establecerJustificacion(constantes.AlineacionCentro);
    conector.establecerEnfatizado(1);
    conector.establecerTamanioFuente(2, 2);
    conector.texto(`${title}\n`);
    conector.establecerTamanioFuente(1, 1);
    conector.establecerEnfatizado(0);
    conector.establecerJustificacion(constantes.AlineacionIzquierda);

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
      products.forEach((burger) => conector.texto(`${textBurger(burger)}\n`));
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
  });

  // Price
  conector.establecerJustificacion(constantes.AlineacionCentro);
  conector.texto(line);
  conector.feed(2);
  conector.establecerJustificacion(constantes.AlineacionDerecha);
  conector.establecerTamanioFuente(2, 2);
  conector.texto(`Total: ${orderInput.totalPrice.toFixed(2)}E\n`);
  conector.establecerTamanioFuente(1, 1);
  // Finish
  conector.feed(2);
  conector.cortar();
};

module.exports = {
  generateDocument,
};
