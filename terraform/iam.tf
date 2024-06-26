resource "aws_iam_policy" "ec2-sqs-policy" {
  name = "consumer-ec2-policy"

  policy = templatefile("${path.module}/policies/ec2-policy.json", {
    region  = local.region,
    account = local.account-id,
  })
}

data "aws_iam_policy_document" "AWSEc2TrustPolicy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "terraform_ec2_role" {
  name               = "ConsumerEc2Role"
  assume_role_policy = data.aws_iam_policy_document.AWSEc2TrustPolicy.json
}