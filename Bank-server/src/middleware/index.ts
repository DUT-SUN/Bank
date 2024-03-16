import AuthMiddleware from "./AuthMiddleware";
import AccessLogMiddleware from "./AccessLogMiddleware";
export const GlobalMiddlewares = [
    AuthMiddleware,
    AccessLogMiddleware
]