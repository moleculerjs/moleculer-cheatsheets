/* *******************************************************************************************
 * MOLECULER WEB CHEATSHEET
 * http://moleculer.services/0.12/docs/moleculer-web.html
 *
 * Version: 0.6.x
 * ******************************************************************************************* */

/* *******************************************************************************************
 * Install Moleculer Web
 * ******************************************************************************************* */

```bash
npm i moleculer-web
```

/* *******************************************************************************************
 * SERVICE USAGE
 * ******************************************************************************************* */
const ApiGW = require("moleculer-web");

module.exports = {
    name: "www",
    mixins: [ApiGW],
    settings: {
        port: 4000
    }
};

/* *******************************************************************************************
 * SERVICE SETTINGS
 * ******************************************************************************************* */

module.exports = {
    name: "www",
    mixins: [ApiGW],
    settings: {
        // Exposed port
        port: 4000,

        // Exposed IP
        ip: "0.0.0.0",

        // HTTPS server with certificate
        https: {
            key: fs.readFileSync(path.join(__dirname, "../ssl/key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "../ssl/cert.pem"))
        },

        // Global CORS settings
        cors: {
            origin: "*",
            methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
            allowedHeaders: "*",
            //exposedHeaders: "*",
            credentials: true,
            maxAge: null
        },

        // Rate limiter
        rateLimit: {
            window: 10 * 1000,
            limit: 10,
            headers: true
        },

        // Exposed path prefix
        path: "/api",

        routes: [

            /**
             * This route demonstrates a protected `/api/admin` path to access `users.*` & internal actions.
             * To access them, you need to login first & use the received token in header
             */
            {
                // Path prefix to this route
                path: "/admin",

                // Whitelist of actions (array of string mask or regex)
                whitelist: [
                    "users.*",
                    "$node.*"
                ],

                // Route CORS settings
                cors: {
                    origin: ["https://localhost:4000"],
                    methods: ["GET", "OPTIONS", "POST"],
                },

                authorization: true,

                roles: ["admin"],

                // Action aliases
                aliases: {
                    "POST users": "users.create",
                    "health": "$node.health"
                },

                // Use bodyparser module
                bodyParsers: {
                    json: true
                },

                onBeforeCall(ctx, route, req, res) {
                    this.logger.info("onBeforeCall in protected route");
                    ctx.meta.authToken = req.headers["authorization"];
                },

                onAfterCall(ctx, route, req, res, data) {
                    this.logger.info("onAfterCall in protected route");
                    res.setHeader("X-Custom-Header", "Authorized path");
                },

                // Route error handler
                onError(req, res, err) {
                    res.setHeader("Content-Type", "text/plain");
                    res.writeHead(err.code || 500);
                    res.end("Route error: " + err.message);
                }

            },

            /**
             * This route demonstrates a public `/api` path to access `posts`, `file` and `math` actions.
             */
            {
                // Path prefix to this route
                path: "/",

                // Whitelist of actions (array of string mask or regex)
                whitelist: [
                    "auth.*",
                    "file.*",
                    "test.*",
                    /^math\.\w+$/
                ],

                authorization: false,

                // Convert "say-hi" action -> "sayHi"
                camelCaseNames: true,

                // Action aliases
                aliases: {
                    "login": "auth.login",
                    "add": "math.add",
                    "add/:a/:b": "math.add",
                    "GET sub": "math.sub",
                    "POST divide": "math.div",
                    "POST upload"(req, res) {
                        this.parseUploadedFile(req, res);
                    }
                },

                // Use bodyparser module
                bodyParsers: {
                    json: true,
                    urlencoded: { extended: true }
                },

                callOptions: {
                    timeout: 3000,
                    //fallbackResponse: "Fallback response via callOptions"
                },

                onBeforeCall(ctx, route, req, res) {
                    return new this.Promise(resolve => {
                        this.logger.info("async onBeforeCall in public. Action:", req.$endpoint.action.name);
                        ctx.meta.userAgent = req.headers["user-agent"];
                        //ctx.meta.headers = req.headers;
                        resolve();
                    });
                },

                onAfterCall(ctx, route, req, res, data) {
                    this.logger.info("async onAfterCall in public");
                    return new this.Promise(resolve => {
                        res.setHeader("X-Response-Type", typeof(data));
                        resolve();
                    });
                },
            }
        ],

        // Folder to server assets (static files)
        assets: {
            // Root folder of assets
            folder: "./examples/full/assets",
            // Options to `server-static` module
            options: {}
        },

        // Global error handler
        onError(req, res, err) {
            res.setHeader("Content-Type", "text/plain");
            res.writeHead(err.code || 500);
            res.end("Global error: " + err.message);
        }

    },

    methods: {
        /**
         * Authorize the request
         *
         * @param {Context} ctx
         * @param {Object} route
         * @param {IncomingRequest} req
         * @returns {Promise}
         */
        authorize(ctx, route, req) {
            let authValue = req.headers["authorization"];
            if (authValue && authValue.startsWith("Bearer ")) {
                let token = authValue.slice(7);

                // Verify JWT token
                return ctx.call("auth.verifyToken", { token })
                    .then(decoded => {
                        //console.log("decoded data", decoded);

                        // Check the user role
                        if (route.opts.roles.indexOf(decoded.role) === -1)
                            return this.Promise.reject(new ForbiddenError());

                        // If authorization was success, we set the user entity to ctx.meta
                        return ctx.call("auth.getUserByID", { id: decoded.id }).then(user => {
                            ctx.meta.user = user;
                            this.logger.info("Logged in user", user);
                        });
                    })

                    .catch(err => {
                        if (err instanceof MoleculerError)
                            return this.Promise.reject(err);

                        return this.Promise.reject(new UnAuthorizedError(ERR_INVALID_TOKEN));
                    });

            } else
                return this.Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
        }
    }
};
