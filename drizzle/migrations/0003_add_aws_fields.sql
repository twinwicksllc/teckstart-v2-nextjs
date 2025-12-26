ALTER TABLE "userPreferences" ADD COLUMN "awsRegion" varchar(50) DEFAULT 'us-east-1' NOT NULL;
ALTER TABLE "userPreferences" ADD COLUMN "awsLastRetrievedAt" timestamp;
