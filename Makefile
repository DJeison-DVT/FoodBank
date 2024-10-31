FRONTEND_DIR = ./frontend_react_native
BACKEND_DIR  = ./backend_go


run_backend: 
	@cd ${BACKEND_DIR} && go run main.go

test_backend:
	@cd $(BACKEND_DIR) && go test -v ./...


clean:
	@echo "Cleaning up..."
	rm -rf $(BACKEND_DIR)/bin

