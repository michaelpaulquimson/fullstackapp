terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  profile = var.aws_profile
}

module "lambda" {
  source                = "./lambda_module"
  lambda_name           = var.lambda_name
  image_uri             = var.image_uri
  lambda_role_arn       = var.lambda_role_arn
  memory_size           = var.memory_size
  timeout               = var.timeout
  environment_variables = var.environment_variables
}
