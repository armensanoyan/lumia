type EnvVar = {
  key: string;
  required?: boolean;
};

const requiredEnvVars: EnvVar[] = [
  // MongoDB
  { key: 'MONGO_URL', required: true },
  { key: 'MONGODB_DB_NAME', required: true },
  { key: 'MONGODB_COLLECTION', required: true },

  // Kafka
  { key: 'KAFKA_BROKER', required: true },
  { key: 'KAFKA_LISTENER_CLIENT_ID', required: true },
  { key: 'KAFKA_GROUP_ID', required: true },
  { key: 'KAFKA_TOPIC', required: true },
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
