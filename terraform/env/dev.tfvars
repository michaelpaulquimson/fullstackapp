aws_region = "us-east-1"
aws_profile = "default"
lambda_name = "api-lambda-dev"
image_uri = "<your_ecr_repo_url>:dev"
lambda_role_arn = "<your_lambda_role_arn>"
memory_size = 512
timeout = 10
environment_variables = {
  ENV = "dev"
}
