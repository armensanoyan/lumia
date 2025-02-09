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
