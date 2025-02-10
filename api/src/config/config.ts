export const stackOverFlowConfig = {
  url: process.env.STACKOVERFLOW_API_URL as string,
  site: process.env.STACKOVERFLOW_SITE as string,
  order: process.env.STACKOVERFLOW_ORDER as string,
  sort: process.env.STACKOVERFLOW_SORT as string,
};

export const mongoConfig = {
  url: process.env.MONGO_URL as string,
  database: process.env.MONGODB_DB_NAME as string,
  collection: process.env.MONGODB_COLLECTION as string,
};

export const redisConfig = {
  url: process.env.REDIS_URL as string,
  password: process.env.REDIS_PASSWORD as string,
};

export const kafkaConfig = {
  url: process.env.KAFKA_BROKER as string,
  clientId: process.env.KAFKA_PRODUCER_CLIENT_ID as string,
  topic: process.env.KAFKA_TOPIC as string,
};
