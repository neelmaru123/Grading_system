const Queue = require('bull');
const redis = require('redis');

// Connect to Redis Cloud using the provided credentials
const REDIS_HOST = 'redis-16718.c301.ap-south-1-1.ec2.redns.redis-cloud.com'; 
const REDIS_PORT = '16718';  // e.g., 6379 (default)
const REDIS_PASSWORD = 'rJlhCYJBDs9IZGnnZGdvLV1XHs5UTu6K';  

// Initialize the Bull Queue with the cloud Redis connection details
const gradingQueue = new Queue('grading', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
  }
});

module.exports = gradingQueue;
