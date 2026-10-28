NIC — Database Setup
This guide creates the PostgreSQL database and tables required by the NIC FastAPI client registration service.
Prerequisites
- PostgreSQL is installed and running (locally or in Docker).
- You have a PostgreSQL role with permission to create a database and tables (for example, postgres).
- You can access PostgreSQL using psql.
1. Connect to PostgreSQL
If PostgreSQL is installed on your machine:
psql -U postgres -d postgres
If PostgreSQL is running inside Docker, instead run (replace <postgres-container> with the actual container name):
docker exec -it <postgres-container> psql -U postgres -d postgres
2. Create the database
Run this command inside psql, while connected to the postgres database:
CREATE DATABASE nic;
If nic already exists, skip the CREATE DATABASE command. Do not drop your existing database.

Connect to the new database:
\c nic
3. Create the registration_transation table
Naming: registration_transation is intentionally spelled exactly as it appears in the existing database and Python queries. Do not rename it without updating the application code.

CREATE TABLE IF NOT EXISTS public.registration_transation (
    transaction_id UUID NOT NULL DEFAULT gen_random_uuid(),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT registration_transation_pkey PRIMARY KEY (transaction_id),
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'COMPLETED'))
);
The database generates transaction_id automatically when the backend omits it from an INSERT. The backend must supply expires_at, typically using NOW() + INTERVAL '10 minutes'.
4. Create the client_request table
CREATE TABLE IF NOT EXISTS public.client_request (
    client_id VARCHAR(100) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    redirect_urls TEXT NOT NULL,
    client_secret VARCHAR(100) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT client_request_pkey PRIMARY KEY (client_id)
);
client_id deliberately has no PostgreSQL default. Your Python backend generates it, for example:
from uuid import uuid4

client_id = "client_" + uuid4().hex
The backend must provide that client_id when inserting a client. The backend should store a securely hashed client_secret, not the plaintext value.
5. Verify the tables
Run these commands inside psql:
\dt public.*
\d public.registration_transation
\d public.client_request
Both tables should exist, with the columns and defaults shown above.
6. Optional: Test transaction creation
INSERT INTO public.registration_transation (expires_at)
VALUES (NOW() + INTERVAL '10 minutes')
RETURNING transaction_id, status, created_at, expires_at;
This should return a generated UUID and the default status PENDING. It adds a real row to your database.

To inspect recent registrations:
SELECT transaction_id, status, created_at, expires_at, completed_at
FROM public.registration_transation
ORDER BY created_at DESC
LIMIT 10;
To inspect client records without exposing their secret hashes:
SELECT client_id, client_name, redirect_urls, date
FROM public.client_request
ORDER BY date DESC;
Notes
- Run CREATE DATABASE while connected to another database, such as postgres.
- \c and \d are psql commands, not SQL statements.
- CREATE TABLE IF NOT EXISTS does not update the structure of an already existing table; it only avoids an error if that table exists.
- PostgreSQL automatically generates transaction_id; Python generates client_id.
- Keep database passwords, API credentials, and client secrets out of your Git repository.