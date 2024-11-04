package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"backend_go/config"
	"backend_go/services"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// Google OAuth2 configuration
var googleOauthConfig = &oauth2.Config{
	ClientID:     config.GoogleClientID,
	ClientSecret: config.GoogleClientSecret,
	RedirectURL:  config.GoogleRedirectURL,
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile"}, // Limited to name and profile picture
	Endpoint:     google.Endpoint,
}

func UpdateGoogleOAuthConfig() {
	googleOauthConfig.ClientID = config.GoogleClientID
	googleOauthConfig.ClientSecret = config.GoogleClientSecret
	googleOauthConfig.RedirectURL = config.GoogleRedirectURL
}

// HandleLogin initiates the Google OAuth2 login process
func HandleLogin(w http.ResponseWriter, r *http.Request) {
	url := googleOauthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// HandleCallback handles the callback from Google OAuth2 and retrieves user information
func HandleCallback(w http.ResponseWriter, r *http.Request) {
	// Extract the authorization code from the URL
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Code not found", http.StatusBadRequest)
		return
	}

	// Exchange the authorization code for an access token
	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Failed to exchange token", http.StatusBadRequest)
		return
	}

	// Fetch the user's profile information from Google
	userInfo, err := fetchUserInfo(token)
	if err != nil {
		http.Error(w, "Failed to fetch user info", http.StatusBadRequest)
		return
	}

	// Join userInfo and Token
	userInfo["token"] = token

	// Return the user's info as JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userInfo)
}

// fetchUserInfo uses the access token to get the user's basic profile from Google
func fetchUserInfo(token *oauth2.Token) (map[string]interface{}, error) {
	client := googleOauthConfig.Client(context.Background(), token)

	// Request user information from Google's userinfo endpoint
	response, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(response.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return userInfo, nil
}

func VerifyAccessTokenHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Parse the ID token from the request
	accessToken := r.PostFormValue("idtoken")
	if accessToken == "" {
		http.Error(w, "ID token is required", http.StatusBadRequest)
		return
	}

	token := &oauth2.Token{
		AccessToken: accessToken,
	}

	// Use TokenSource to validate and refresh if needed
	tokenSource := googleOauthConfig.TokenSource(r.Context(), token)
	newToken, err := tokenSource.Token()
	if err != nil {
		http.Error(w, "Token is invalid or expired", http.StatusUnauthorized)
		return
	}

	// Check if token was refreshed
	var response = map[string]interface{}{
		"status": "success",
	}
	if newToken.AccessToken != accessToken {
		response["message"] = "Token was expired and has been refreshed"
		response["new_access_token"] = newToken.AccessToken
		response["expiration_date"] = newToken.Expiry.Format(time.RFC3339)
	} else {
		response["message"] = "Token is still valid"
		response["expiration_date"] = newToken.Expiry.Format(time.RFC3339)
	}

	// Send the response with token details
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

type TokenFormFields struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   string `json:"expires_in"`
	IssuedAt    string `json:"issued_at"`
	TokenType   string `json:"token_type"`
}

func TokenSignInHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	formFields := map[string]string{
		"access_token": r.PostFormValue("access_token"),
		"expires_in":   r.PostFormValue("expires_in"),
		"issued_at":    r.PostFormValue("issued_at"),
		"token_type":   r.PostFormValue("token_type"),
	}

	token := &oauth2.Token{
		AccessToken: formFields["access_token"],
		TokenType:   formFields["token_type"],
	}

	userInfo, err := fetchUserInfo(token)
	if err != nil {
		http.Error(w, "Failed to fetch user info", http.StatusBadRequest)
		return
	}

	user, err := services.UpsertUser(userInfo)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusBadRequest)
		return
	}

	userToken, err := services.RegisterAccessToken(user, formFields)
	if err != nil {
		http.Error(w, "Failed to register access token", http.StatusBadRequest)
		return
	}

	fmt.Println("User token: ", userToken)
	fmt.Println("Expiry: ", userToken.ExpiresAt)
	fmt.Println("User: ", user)

	// Send the user information as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
