-- Local Docker bootstrap. The database owner is created by the official
-- PostgreSQL image from POSTGRES_USER; this script creates the restricted
-- runtime role used by the application container.
\set ON_ERROR_STOP on

SELECT format('CREATE ROLE taskapi_app LOGIN PASSWORD %L', 'change_me_local_only')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'taskapi_app')
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
