-- Least-privilege PostgreSQL role bootstrap for TaskAPI.
--
-- Run with psql as a database administrator, then store the generated
-- taskapi_app password in the deployment secret store. Do not commit
-- real passwords.
--
-- Example:
--   psql -v taskapi_app_password='replace-with-generated-password' -f infra/db/roles.sql

\set ON_ERROR_STOP on

SELECT 'CREATE ROLE taskapi_owner NOLOGIN'
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'taskapi_owner')
\gexec

SELECT format('CREATE ROLE taskapi_app LOGIN PASSWORD %L', :'taskapi_app_password')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'taskapi_app')
\gexec

SELECT 'CREATE DATABASE taskapi OWNER taskapi_owner'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'taskapi')
\gexec

\connect taskapi

GRANT CONNECT ON DATABASE taskapi TO taskapi_app;
GRANT USAGE, CREATE ON SCHEMA public TO taskapi_owner;
GRANT USAGE ON SCHEMA public TO taskapi_app;

ALTER DEFAULT PRIVILEGES FOR ROLE taskapi_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO taskapi_app;

ALTER DEFAULT PRIVILEGES FOR ROLE taskapi_owner IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO taskapi_app;
