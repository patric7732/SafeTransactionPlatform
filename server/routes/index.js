const auth = require("./auth");
const product = require("./product");
const chat = require("./chat");
const user = require("./user");

/** 라우터 통합 실행 함수
 * @description 모든 api 라우팅
 * @description auth, product 등
 */
const routerLoader = () => {
  const app = require("express").Router();
  auth(app);
  product(app);
  chat(app);
  user(app);
  return app;
};

module.exports = routerLoader;
