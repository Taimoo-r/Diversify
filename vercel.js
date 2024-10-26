{
    "builds": [
      { "src": "server/index.js", "use": "@vercel/node" },
      { "src": "client/package.json", "use": "@vercel/static-build" }
    ],
    "routes": [
      { "src": "/api/(.*)", "dest": "server/index.js" },
      { "src": "/(.*)", "dest": "/client/$1" }
    ]
  }
  
