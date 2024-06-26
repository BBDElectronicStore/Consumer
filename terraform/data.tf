data "aws_vpc" "main" {
  tags = {
    Name = "main-vpc"
  }
}

data "aws_subnet" "public_subnet_eu_west_1a" {
  vpc_id = data.aws_vpc.main.id
  filter {
    name   = "tag:Name"
    values = ["main-vpc-public-eu-west-1a"]
  }
}