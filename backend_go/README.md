# FoodBank

This Go project requires a `.env` file with Google OAuth keys and a PostgreSQL `DATABASE_URL` to run properly.

## Prerequisites

-   Go (https://golang.org/doc/install)
-   PostgreSQL database
-   Google OAuth credentials

## Setup

1. **Create a `.env` file** in the backend_go directory of this project with the following variables:

    GOOGLE_CLIENT_ID=`your-google-client-id`  
    GOOGLE_CLIENT_SECRET=`your-google-client-secret`
    GOOGLE_REDIRECT_URL=http://localhost:8080/callback
    DATABASE_URL=`postgresql://user:password@host:port/database`

    Replace `your-google-client-id` and `your-google-client-secret` with your Google OAuth credentials, and fill in the PostgreSQL connection details.

2. **Install dependencies** (if any additional Go modules are required):

    go mod tidy

## Usage

This project includes a `Makefile` with commands for running and testing the application.

### Run the Backend

Before making any changes first change into the folder

```shell
cd backend_go
```

To start the application, use:

```shell
make run
```

This will execute `go run main.go` and start the Go application.

### Run Tests

To run all tests in verbose mode, use:

```shell
make test
```

This will execute `go test -v ./...` and run all tests in the project.

## Additional Notes

-   Ensure that the `.env` file is located in the backend_go directory of the project to load environment variables correctly.
-   Google OAuth credentials can be obtained by creating a project in the Google Cloud Console (https://console.cloud.google.com/) and enabling the OAuth consent screen and APIs.
-   The PostgreSQL `DATABASE_URL` should follow the format:

    postgresql://<user>:<password>@<host>:<port>/<database>

## License

MIT License (LICENSE)
