aws_region = "us-east-1"
aws_profile = "default"
lambda_name = "api-lambda-prod"
image_uri = "<your_ecr_repo_url>:prod"
lambda_role_arn = "<your_lambda_role_arn>"
memory_size = 1024
timeout = 15
environment_variables = {
  ENV = "prod"
}
