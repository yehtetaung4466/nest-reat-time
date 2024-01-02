DO $$ BEGIN
 CREATE TYPE "memberRole" AS ENUM('user', 'manager', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "role" SET DATA TYPE memberRole;