const base = require("@playwright/test");

exports.customtest = base.test.extend({
  testDataForOrder: {
    username: "getnaveen81@gmail.com",
    password: "Rahulshetty@1234",
    productName: "ZARA COAT 3",
  }
});
