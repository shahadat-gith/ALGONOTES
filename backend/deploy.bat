@echo off
echo 🔒 Logging into Amazon ECR...
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 692299587899.dkr.ecr.ap-south-1.amazonaws.com

echo 📦 Building the production Docker image...
docker build --provenance=false --platform linux/amd64 -t algonotes-backend-prod -f Dockerfile.prod .

echo 🏷️ Tagging image as 'latest'...
docker tag algonotes-backend-prod:latest 692299587899.dkr.ecr.ap-south-1.amazonaws.com/algonotes-backend-prod:latest

echo 🚀 Pushing image to Amazon ECR...
docker push 692299587899.dkr.ecr.ap-south-1.amazonaws.com/algonotes-backend-prod:latest

echo 🔄 Forcing AWS Lambda to deploy the fresh container image...
aws lambda update-function-code --function-name algonotes-backend --image-uri 692299587899.dkr.ecr.ap-south-1.amazonaws.com/algonotes-backend-prod:latest --region ap-south-1

echo ✅ Deployment completed successfully! Your changes are going live.