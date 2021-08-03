# Environment

| .env                  | docker-compose        | Postgres              | Heroku       | lib/server.js |
| --------------------- | --------------------- | --------------------- | ------------ | ------------- |
| POSTGRES_DB           | POSTGRES_DB           | POSTGRES_DB           | --           | -- | 
| POSTGRES_USER         | POSTGRES_USER         | POSTGRES_USER         | --           | -- |
| POSTGRES_PASSWORD     | POSTGRES_PASSWORD     | POSTGRES_PASSWORD     | --           | -- |
| POSTGRES_JWT_SECRET   | POSTGRES_JWT_SECRET   | POSTGRES_JWT_SECRET   | --           | -- |
| POSTGRES_API_PASSWORD | POSTGRES_API_PASSWORD | POSTGRES_API_PASSWORD | --           | -- |
| POSTGRES_JWT_CLAIMS   | POSTGRES_JWT_CLAIMS   | POSTGRES_JWT_CLAIMS   | --           | -- |
| API_HOST              | HOST                  | --                    | HOST         | --            |
| API_PORT              | PORT                  | --                    | --           | --            |
| API_DATABASE_URL      | DATABASE_URL          | --                    | DATABASE_URL | process.env.DATABASE_URL |
| API_JWT_SECRET        | JWT_SECRET            | --                    | JWT_SECRET   | process.env.JWT_SECRET   |
| API_JWT_CLAIMS        | JWT_CLAIMS            | --                    | JWT_CLAIMS   | process.env.JWT_CLAIMS   |
| NODE_ENV              | NODE_ENV              | --                    | NODE_ENV     | process.env.NODE_ENV |

