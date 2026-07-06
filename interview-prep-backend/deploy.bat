@echo off
echo Logging into Amazon ECR...
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 692299587899.dkr.ecr.ap-south-1.amazonaws.com

echo Building the production Docker image...
docker build --provenance=false --platform linux/amd64 -t algonotes-interview-prep-backend -f Dockerfile .

echo Tagging image as 'latest'...
docker tag algonotes-interview-prep-backend:latest 692299587899.dkr.ecr.ap-south-1.amazonaws.com/algonotes-interview-prep-backend:latest

echo Pushing image to Amazon ECR...
docker push 692299587899.dkr.ecr.ap-south-1.amazonaws.com/algonotes-interview-prep-backend:latest

echo Forcing AWS Lambda to deploy the fresh container image...
aws lambda update-function-code --function-name algonotes-interview-prep-backend --image-uri 692299587899.dkr.ecr.ap-south-1.amazonaws.com/algonotes-interview-prep-backend:latest --region ap-south-1

echo Deployment completed successfully! Your changes are going live.