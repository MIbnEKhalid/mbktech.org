import { createNotFoundHandler, createErrorHandler } from "mbkutils";

export const notFoundHandler = createNotFoundHandler({
  appName: "mbktech.org",
  defaultPage: "/",
  defaultPageName: "Home",
});

export const errorHandler = createErrorHandler({
  appName: "mbktech.org",
  defaultPage: "/",
  defaultPageName: "Home",
});

export default {
  notFoundHandler,
  errorHandler,
};
