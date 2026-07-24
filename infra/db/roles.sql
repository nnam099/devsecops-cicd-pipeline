-- Least-privilege runtime role bootstrap for an existing TaskAPI database.
--
-- Run while connected as taskapi_owner after the database has been created.
-- The owner/migration credential and runtime credential must be separate.
--
-- Example:
--   psql -d taskapi -U taskapi_owner \
--     -v taskapi_app_password='replace-with-generated-password' \
--     -f infra/db/roles.sql

\set ON_ERROR_STOP on

SELECT format('CREATE ROLE taskapi_app LOGIN PASSWORD %L', :'taskapi_app_password')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'taskapi_app')
\gexec

SELECT format('ALTER ROLE taskapi_app PASSWORD %L', :'taskapi_app_password')
\gexec

ALTER ROLE taskapi_app NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;

GRANT CONNECT ON DATABASE taskapi TO taskapi_app;
GRANT USAGE ON SCHEMA public TO taskapi_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO taskapi_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO taskapi_app;

ALTER DEFAULT PRIVILEGES FOR ROLE taskapi_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO taskapi_app;

ALTER DEFAULT PRIVILEGES FOR ROLE taskapi_owner IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO taskapi_app;
