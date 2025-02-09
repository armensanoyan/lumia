export const kafkaConfig = {
  url: process.env.KAFKA_BROKER || 'localhost:9092',
  clientId: process.env.KAFKA_CLIENT_ID || 'listener',
  groupId: process.env.KAFKA_GROUP_ID || 'listener-group',
  topic: process.env.KAFKA_TOPIC || 'search-results',
};

export const mongoConfig = {
  url: process.env.MONGO_URL || `mongodb://root:example@localhost:27017`,
  database: process.env.MONGODB_DB_NAME || 'stackoverflow',
  collection: process.env.MONGODB_COLLECTION || 'search-logs',
};
