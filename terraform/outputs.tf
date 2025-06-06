output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app_server.id
}

output "server_ip" {
  value = aws_eip.app_eip.public_ip
}

output "rds_hostname" {
  description = "RDS instance hostname"
  value       = aws_db_instance.alliance.address
  #sensitive   = true
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.alliance.port
  #sensitive   = true
}

output "rds_username" {
  description = "RDS instance root username"
  value       = aws_db_instance.alliance.username
  #sensitive   = true
}