const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()        // logs en formato JSON estructurado
  ),
  transports: [

    // Transport 1: consola (para ver logs localmente)
    new winston.transports.Console(),

    // Transport 2: CloudWatch (para ver logs en AWS)
    new WinstonCloudWatch({
      logGroupName: '/evparcial/app',        // nombre del Log Group en CloudWatch
      logStreamName: 'express-logs',         // nombre del stream dentro del grupo
      awsRegion: 'us-east-1',
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      jsonMessage: true
    })
  ]
});

module.exports = logger;