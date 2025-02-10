export const kafkaConfig = {
  url: process.env.KAFKA_BROKER as string,
  clientId: process.env.KAFKA_LISTENER_CLIENT_ID as string,
  groupId: process.env.KAFKA_GROUP_ID as string,
  topic: process.env.KAFKA_TOPIC as string,
};

export const mongoConfig = {
  url: process.env.MONGO_URL as string,
  database: process.env.MONGODB_DB_NAME as string,
  collection: process.env.MONGODB_COLLECTION as string,
};
