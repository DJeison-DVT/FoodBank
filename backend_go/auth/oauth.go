package auth

import (
	"context"
	"encoding/json"
	"net/http"

	"backend_go/config"

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
