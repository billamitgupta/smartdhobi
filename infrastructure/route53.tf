# Route53 Hosted Zone (assuming it already exists)
data "aws_route53_zone" "smartdhobi" {
  name         = "smartdhobi.in"
  private_zone = false
}

# Certificate validation records
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.smartdhobi_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.smartdhobi.zone_id
}

# Certificate validation
resource "aws_acm_certificate_validation" "smartdhobi_cert" {
  certificate_arn         = aws_acm_certificate.smartdhobi_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# A records pointing to ALB
resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.smartdhobi.zone_id
  name    = "smartdhobi.in"
  type    = "A"

  alias {
    name                   = aws_lb.smartdhobi_alb.dns_name
    zone_id                = aws_lb.smartdhobi_alb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.smartdhobi.zone_id
  name    = "www.smartdhobi.in"
  type    = "A"

  alias {
    name                   = aws_lb.smartdhobi_alb.dns_name
    zone_id                = aws_lb.smartdhobi_alb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.smartdhobi.zone_id
  name    = "api.smartdhobi.in"
  type    = "A"

  alias {
    name                   = aws_lb.smartdhobi_alb.dns_name
    zone_id                = aws_lb.smartdhobi_alb.zone_id
    evaluate_target_health = true
  }
}