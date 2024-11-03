{
    "builds": [
        { "src": "server/index.js", "use": "@vercel/node" },
        { "src": "client/package.json", "use": "@vercel/static-build" }
    ],
    "routes": [
        { "src": "/api/(.*)", "dest": "BackEnd/index.js" },
        { "src": "/(.*)", "dest": "/FrontEnd/index.html" }
    ]
}
