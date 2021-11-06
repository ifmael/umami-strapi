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
    let textIngredients = !!burger.ingredients
      ? burger.ingredients
          .split("||")
          .map((element) => {
            const e = element.split(",").map((innerText) => {
              const ingredientWithPrice = innerText.split("--");
              const x =
                ingredientWithPrice.length === 1
                  ? `${tab}${innerText}\n`
                  : justifyLine(
                      `${tab}${ingredientWithPrice[0]}`,
                      `${Number(ingredientWithPrice[1]).toFixed(2)}E`,
                      printerWidth
                    );
              return x;
            });
            return e;
          })
          .flat()
          .join("")
      : "";

    const meatPoint = burger?.meatPoint ? `${tab}- ${burger.meatPoint}\n` : "";
    const meatHasSupplement =
      burger?.typeOfMeat.split("||").length === 2 ? true : false;
    const typeOfMeat = burger?.typeOfMeat
      ? meatHasSupplement
        ? justifyLine(
            `${tab}- ${burger.typeOfMeat.split("||")[0]}`,
            `${Number(burger?.typeOfMeat.split("||")[1]).toFixed(2)}E`,
            printerWidth
          )
        : `${tab}- ${burger.typeOfMeat}\n`
      : "";
    const typeOfBread = burger?.typeOfBread
      ? `${tab}- ${burger.typeOfBread}\n`
      : "";
    textIngredients = textIngredients ? `${textIngredients}` : "";

    return `${titleAndPrice}${meatPoint}${typeOfMeat}${typeOfBread}${textIngredients}`;
  } catch (error) {
    console.log(error);
  }
};

const textChildrenBurger = (beverage) => {
  return `${tab}- ${beverage?.name}\n`;
};

const textSandwidch = (sandwich) => {
  try {
    const titleAndPrice = justifyLine(
      sandwich.name,
      `${sandwich.price.toFixed(2)}E`,
      printerWidth
    );

    const textIngredients = !!sandwich.ingredients
      ? sandwich.ingredients
          .split("||")
          .map((element) => {
            const e = element.split(",").map((innerText) => {
              const ingredientWithPrice = innerText.split("--");
              const x =
                ingredientWithPrice.length === 1
                  ? `${tab}${innerText}\n`
                  : justifyLine(
                      `${tab}${ingredientWithPrice[0]}`,
                      `${Number(ingredientWithPrice[1]).toFixed(2)}E`,
                      printerWidth
                    );
              return x;
            });
            return e;
          })
          .flat()
          .join("")
      : "";

    return `${titleAndPrice}\n${tab}- ${sandwich.typeOfBread}\n${textIngredients}`;
  } catch (error) {
    console.log(error);
  }
};

const textSalad = (salad) => {
  try {
    const titleAndPrice = justifyLine(
      salad.name,
      `${salad.price.toFixed(2)}E`,
      printerWidth
    );

    const textIngredients = !!salad.ingredients
      ? salad.ingredients
          .split("||")
          .map((element) => {
            const e = element.split(",").map((innerText) => {
              const ingredientWithPrice = innerText.split("--");
              const x =
                ingredientWithPrice.length === 1
                  ? `${tab}${innerText}\n`
                  : justifyLine(
                      `${tab}${ingredientWithPrice[0]}`,
                      `${Number(ingredientWithPrice[1]).toFixed(2)}E`,
                      printerWidth
                    );
              return x;
            });
            return e;
          })
          .flat()
          .join("")
      : "";

    return `${titleAndPrice}\n${textIngredients}`;
  } catch (error) {
    console.log(error);
  }
};

const generateDocument = (orderInput, conector, constantes) => {
  try {
    // delivery components
    const deliveryLocalComponent = "contact.in-local";
    const deliveryHomeComponent = "contact.contact";

    const line = "=================================";
    const { deliveryOptions, shoppingCart, paymentMethod } = orderInput;
    conector.cortar();

    // Header
    conector.establecerJustificacion(constantes.AlineacionCentro);
    // conector.imagenDesdeUrl(umamiLogoUrl);
    conector.establecerTamanioFuente(2, 2);
    conector.texto("UMAMI\n");
    conector.establecerTamanioFuente(1, 1);
    conector.feed(1);
    // conector.establecerJustificacion(constantes.AlineacionIzquierda);
    conector.texto("75147867J\n");
    conector.texto("PLAZA PINTOR VELAZQUEZ 2 LOCAL\n");
    conector.texto("SANTA FE, 18320\n");
    conector.texto("858693302\n");
    conector.feed(1);
    conector.establecerJustificacion(constantes.AlineacionCentro);

    //Client info
    conector.establecerEnfatizado(1);
    conector.texto("DATOS DEL PEDIDO\n\n");
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
    paymentMethod.name &&
      conector.texto(`Metodo de pago: ${paymentMethod.name}\n`);
    conector.establecerJustificacion(constantes.AlineacionCentro);
    conector.establecerJustificacion(constantes.AlineacionIzquierda);

    // Order Info
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
      conector.establecerJustificacion(constantes.AlineacionIzquierda);

      if (component === "shopping-cart.menu") {
        products.forEach((product) => {
          let isChildrenMenu = false;
          if (!!product.burger) {
            conector.texto(textBurger(product.burger));
            isChildrenMenu = !!product.burger.isChildrenMenu;
          } else if (!!product.sandwich) {
            conector.texto(textSandwidch(product.sandwich));
          }
          if (!isChildrenMenu) {
            product.side &&
              conector.texto(
                `${justifyLine(
                  product.side.name,
                  `${product.side.price.toFixed(2)}E`,
                  printerWidth
                )}\n`
              );
            if (product?.side?.ingredients) {
              const ingredients = product.side.ingredients.split(",");
              ingredients.forEach((ingredient) =>
                conector.texto(`${tab}- ${ingredient}\n`)
              );
            }

            product.beverage &&
              conector.texto(
                `${justifyLine(
                  product.beverage.name,
                  `${product.beverage.price.toFixed(2)}E`,
                  printerWidth
                )}\n`
              );
            conector.texto(
              `${justifyLine("Ahorro menu", `-1,00E`, printerWidth)}\n`
            );
          } else {
            conector.texto(textChildrenBurger(product?.beverage));
          }
        });
      } else if (component === "shopping-cart.burger") {
        products.forEach((burger) => conector.texto(`${textBurger(burger)}\n`));
      } else if (component === "shopping-cart.sandwich") {
        products.forEach((sandwich) =>
          conector.texto(`${textSandwidch(sandwich)}\n`)
        );
      } else if (component === "shopping-cart.salad") {
        products.forEach((sandwich) =>
          conector.texto(`${textSalad(sandwich)}\n`)
        );
      } else if (
        component === "shopping-cart.beverage" ||
        component === "shopping-cart.dessert" ||
        component === "shopping-cart.side"
      ) {
        products.forEach((product) => {
          conector.texto(
            `${justifyLine(
              product.name,
              `${product.price.toFixed(2)}E`,
              printerWidth
            )}\n`
          );
          if (product.ingredients && component === "shopping-cart.side") {
            const ingredients = product.ingredients.split(",");
            ingredients.forEach((ingredient) =>
              conector.texto(`${tab}- ${ingredient}\n`)
            );
          }
        });
      }

      conector.feed(1);
    });

    if (orderInput.supplement > 0) {
      conector.texto(
        `${justifyLine(
          "Suplemento domicilio",
          `${orderInput.supplement.toFixed(2)}E`,
          printerWidth
        )}\n`
      );
    }

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
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  generateDocument,
};
