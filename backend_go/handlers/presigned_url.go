package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	envconfig "backend_go/config"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

const expirationTime = 15 * time.Minute

func GeneratePresignedURL(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	customResolver := aws.EndpointResolverWithOptionsFunc(
		func(service, region string, options ...interface{}) (aws.Endpoint, error) {
			if service == s3.ServiceID && region == "nyc3" {
				return aws.Endpoint{
					URL:           envconfig.S3Endpoint, // Using the variable instead of a constant
					SigningRegion: "nyc3",
				}, nil
			}
			return aws.Endpoint{}, fmt.Errorf("unknown endpoint requested")
		})

	cfg, err := config.LoadDefaultConfig(
		context.Background(),
		config.WithRegion("nyc3"),
		config.WithEndpointResolverWithOptions(customResolver),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			envconfig.S3AccessKey, // Using the variable
			envconfig.S3SecretKey, // Using the variable
			"",
		)),
	)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable to load config: %v", err), http.StatusInternalServerError)
		return
	}

	s3Client := s3.NewFromConfig(cfg)

	fileName := r.URL.Query().Get("filename")
	if fileName == "" {
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	presignedURL, err := generatePresignedURL(s3Client, fileName)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error generating presigned URL: %v", err), http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"url": presignedURL,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
	}
}

func generatePresignedURL(s3Client *s3.Client, fileName string) (string, error) {
	presignClient := s3.NewPresignClient(s3Client)

	req := &s3.PutObjectInput{
		Bucket: aws.String(envconfig.S3Bucket),
		Key:    aws.String(fileName),
	}

	presignedURL, err := presignClient.PresignPutObject(context.Background(), req, s3.WithPresignExpires(expirationTime))
	if err != nil {
		return "", fmt.Errorf("unable to generate presigned URL: %v", err)
	}

	return presignedURL.URL, nil
}
