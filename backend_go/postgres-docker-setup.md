## Get postgreSQL db using docker locally
- docker pull postgres
- docker run --name my_postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres

## Get the db url
- postgresql://myuser:mypassword@localhost:5432/mydatabase
