const path = require('path')

module.exports = {
  apps: [
    {
      name: 'AUTH-API',
      script: path.resolve(__dirname, './authentication/dist/index.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './authentication/dist')
      }
    },
    {
      name: 'AUTH-CONSUMER',
      script: path.resolve(__dirname, './authentication/dist/consumer.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './authentication/dist')
      }
    },
    {
      name: 'AUTH-SUBSCRIBER',
      script: path.resolve(__dirname, './authentication/dist/subscriber.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './authentication/dist')
      }
    },
    {
      name: 'BETTING-API',
      script: path.resolve(__dirname, './betting/dist/index.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './betting/dist')
      }
    },
    {
      name: 'BETTING-CONSUMER',
      script: path.resolve(__dirname, './betting/dist/consumer.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './betting/dist')
      }
    },
    {
      name: 'BETTING-SUBSCRIBER',
      script: path.resolve(__dirname, './betting/dist/subscriber.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './betting/dist')
      }
    },
    {
      name: 'EVENTS-API',
      script: path.resolve(__dirname, './events/dist/index.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './events/dist')
      }
    },
    {
      name: 'EVENTS-CONSUMER',
      script: path.resolve(__dirname, './events/dist/consumer.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './events/dist')
      }
    },
    {
      name: 'EVENTS-SUBSCRIBER',
      script: path.resolve(__dirname, './events/dist/subscriber.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './events/dist')
      }
    },
    {
      name: 'NOTIFICATIONS-API',
      script: path.resolve(__dirname, './notifications/dist/index.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './notifications/dist')
      }
    },
    {
      name: 'NOTIFICATIONS-CONSUMER',
      script: path.resolve(__dirname, './notifications/dist/consumer.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './notifications/dist')
      }
    },
    {
      name: 'NOTIFICATIONS-SUBSCRIBER',
      script: path.resolve(__dirname, './notifications/dist/subscriber.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './notifications/dist')
      }
    },
    {
      name: 'SOCKET-SERVICE',
      script: path.resolve(__dirname, './socket/index.js')
    },
    {
      name: 'WALLET-API',
      script: path.resolve(__dirname, './wallet/dist/index.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './wallet/dist')
      }
    },
    {
      name: 'WALLET-CONSUMER',
      script: path.resolve(__dirname, './wallet/dist/consumer.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './wallet/dist')
      }
    },
    {
      name: 'WALLET-SUBSCRIBER',
      script: path.resolve(__dirname, './wallet/dist/subscriber.js'),
      env: {
        NODE_PATH: path.resolve(__dirname, './wallet/dist')
      }
    }
  ]
}
