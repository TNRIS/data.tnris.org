//takes action as argument and performs it if the current steps validateFields are validated successfully.
//If current field has no validateFields, action is called.
export const validateCartStep = (form, step, action) => {
  if (step.validationFields.length === 0) {
    return action();
  } else {
    form
      .validateFields(step.validationFields)
      .then((validation) => {
        return action();
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }
};

export const submitOrderCartForm = async (order) => {
  const {postData, cart} = order
  let orders = "\n";
  Object.keys(cart).forEach((collectionId, index) => {
    const dataName = cart[collectionId].name;
    const dataNum = `(${index + 1}) ${dataName}`;
    orders += dataNum;
    orders += "\n";
    orders += `   UUID: ${collectionId}\n`;
    const dataOrder = cart[collectionId];
    orders += `   Acquisition Date: ${dataOrder.acquisition_date}\n`;
    orders += `   Coverage: ${dataOrder.coverage}\n`;
    if (dataOrder.formats) {
      orders += `   Formats: ${dataOrder.formats}\n`;
    }
    if (dataOrder.coverage === "Partial") {
      orders += `   Identified By: ${dataOrder.type}\n`;
    }
    if (dataOrder.description) {
      switch (typeof dataOrder.description) {
        case "string":
          orders += `   Description: ${dataOrder.description}\n`;
          break;
        case "object":
          orders += `   Description Files:\n ${dataOrder.description
            .map((v, i) => `\t(${i + 1}) File: ${v.filename}\n${v.link}\n`)
            .toString()}`;
          break;
        default:
          orders += `   Description: ${dataOrder.description}\n`;
      }
    }
    return orders;
  });
  const formVals = {
    Name: `${postData["First Name"]} ${postData["Last Name"]}`,
    Email: postData["Email"],
    Phone: postData["Phone Number"],
    Address: `${postData["Address"]} ${postData["City"]}, ${postData["State"]}`,
    Organization: postData["Organization"],
    Industry: postData["Industry"],
    Notes: postData["Comment"],
    Delivery: postData["Delivery Method"],
    HardDrive: postData["Hard Drive"],
    Payment: postData["Payment Method"],
    Order: orders,
    form_id: "data-tnris-org-order",
    recaptcha: postData["recaptcha"],
  };
  const url = "https://api.tnris.org/api/v1/contact/submit";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(formVals),
  };

  const response = fetch(url, payload);
  return response;
};
