function asyncRouteHandler(routeHandlerFunction) {
  return function wrappedRouteHandler(request, response, next) {
    Promise.resolve(routeHandlerFunction(request, response, next)).catch(next);
  };
}

module.exports = asyncRouteHandler;
