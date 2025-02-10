type EnvVar = {
  key: string;
  required?: boolean;
};

const requiredEnvVars: EnvVar[] = [
  // MongoDB
  { key: 'MONGO_URL', required: true },
  { key: 'MONGODB_DB_NAME', required: true },
  { key: 'MONGODB_COLLECTION', required: true },

  // Redis
  { key: 'REDIS_URL', required: true },
  { key: 'REDIS_PASSWORD', required: true },

  // Kafka
  { key: 'KAFKA_BROKER', required: true },
  { key: 'KAFKA_PRODUCER_CLIENT_ID', required: true },
  { key: 'KAFKA_TOPIC', required: true },

  // StackOverflow API
  { key: 'STACKOVERFLOW_API_URL', required: true },
  { key: 'STACKOVERFLOW_SITE', required: true },
  { key: 'STACKOVERFLOW_ORDER', required: true },
  { key: 'STACKOVERFLOW_SORT', required: true },
];

export function validateEnv(): void {
  const missingVars = requiredEnvVars
    .filter((envVar) => envVar.required && !process.env[envVar.key])
    .map((envVar) => envVar.key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }
}
