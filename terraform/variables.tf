variable "aws_region" { type = string }
variable "aws_profile" { type = string }
variable "lambda_name" { type = string }
variable "image_uri" { type = string }
variable "lambda_role_arn" { type = string }
variable "memory_size" { type = number default = 512 }
variable "timeout" { type = number default = 10 }
variable "environment_variables" { type = map(string) default = {} }
