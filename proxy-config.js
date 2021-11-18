const PROXY_CONFIG = {
    "/api": {
        "target": "http://localhost:8080/api",
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/api": ""
        }
    }
}

module.exports = PROXY_CONFIG;