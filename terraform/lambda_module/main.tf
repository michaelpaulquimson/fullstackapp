resource "aws_lambda_function" "this" {
  function_name = var.lambda_name
  package_type  = "Image"
  image_uri     = var.image_uri
  role          = var.lambda_role_arn
  memory_size   = var.memory_size
  timeout       = var.timeout
  environment {
    variables = var.environment_variables
  }
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "apigateway.amazonaws.com"
}
