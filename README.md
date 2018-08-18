# Betting System MicroServices

A betting system starter with the following features.
Start a betting site with this project.

1. Authentication
2. Wallet
3. Betting
4. Events
5. Notifications
6. WebSocket Server

## Installation for production

You create your own .env from .env.example

```
$ ./build.sh
$ pm2 start ecosystem.config.js
```

## Installation for development
You create your own .env from .env.example
Just go inside each services and run individually.

## Testing

```npm run test``` on individual services.

## Requirements

1. NodeJS
2. Linux System
3. Redis
4. MongoDB
5. Docker for development

## License

Copyright 2018 John Dave Decano <johndavececano@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.