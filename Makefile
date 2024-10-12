FRONTEND_DIR = ./frontend_react_native
BACKEND_DIR  = ./backend_go


build_backend:
	@cd ${BACKEND_DIR} && go build -o ./bin/FoodBank

run_backend: build_backend
	@cd ${BACKEND_DIR}/bin && ./FoodBank

test-backend:
	@cd $(BACKEND_DIR) && go test -v ./...


clean:
	@echo "Cleaning up..."
	rm -rf $(BACKEND_DIR)/bin

