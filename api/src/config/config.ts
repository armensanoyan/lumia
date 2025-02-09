export const stackOverFlowConfig = {
  url: 'https://api.stackexchange.com/2.3/search',
  site: 'stackoverflow',
  order: 'desc',
  sort: 'activity',
};

export const mongoConfig = {
  url: process.env.MONGO_URL || `mongodb://root:example@localhost:27017`,
  database: process.env.MONGODB_DB_NAME || 'stackoverflow',
  collection: process.env.MONGODB_COLLECTION || 'questions',
};

export const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
};

export const kafkaConfig = {
  url: process.env.KAFKA_BROKER || 'localhost:9092',
  clientId: process.env.KAFKA_CLIENT_ID || 'api',
  topic: process.env.KAFKA_TOPIC || 'search-results',
};
