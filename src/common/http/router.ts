import { Router } from "express";
import { withResponse } from "./response";
import type { Handler } from "./response";

export function createRouter(): Router {
  const router = Router();
  const originalGet = router.get.bind(router);
  const originalPost = router.post.bind(router);
  const originalPut = router.put.bind(router);
  const originalPatch = router.patch.bind(router);
  const originalDelete = router.delete.bind(router);
  const originalAll = router.all.bind(router);

  const wrapHandlers = (...handlers: Handler[]) =>
    handlers.map((handler) => {
      return withResponse(handler);
    });

  router.get = function (path: string, ...handlers: Handler[]) {
    const handlerMap = handlers.map((e) => e.name);
    console.log("✅ [GET]", path, handlerMap);
    return originalGet(path, ...wrapHandlers(...handlers));
  };

  router.post = function (path: string, ...handlers: Handler[]) {
    const handlerMap = handlers.map((e) => e.name);
    console.log("✅ [POST]", path, handlerMap);
    return originalPost(path, ...wrapHandlers(...handlers));
  };

  router.put = function (path: string, ...handlers: Handler[]) {
    const handlerMap = handlers.map((e) => e.name);
    console.log("✅ [PUT]", path, handlerMap);
    return originalPut(path, ...wrapHandlers(...handlers));
  };

  router.patch = function (path: string, ...handlers: Handler[]) {
    const handlerMap = handlers.map((e) => e.name);
    console.log("✅ [PATCH]", path, handlerMap);
    return originalPatch(path, ...wrapHandlers(...handlers));
  };

  router.delete = function (path: string, ...handlers: Handler[]) {
    const handlerMap = handlers.map((e) => e.name);
    console.log("✅ [DELETE]", path, handlerMap);
    return originalDelete(path, ...wrapHandlers(...handlers));
  };

  router.all = function (path: string, ...handlers: Handler[]) {
    const handlerMap = handlers.map((e) => e.name);
    console.log("✅ [ALL]", path, handlerMap);
    return originalAll(path, ...wrapHandlers(...handlers));
  };

  return router;
}
