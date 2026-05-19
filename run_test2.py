logs = [
    "[2026-05-18 10:00:00] ERROR: User connection failed (IP: 192.168.1.10)",
    "[2026-05-18 10:05:12] INFO: Session started for user 45",
    "[2026-05-18 10:10:03] ERROR: Database timeout (IP: 10.0.0.5)",
    "[2026-05-18 10:15:00] WARN: High memory usage",
]

def extract_errors(log_lines):
    error_count = 0
    unique_ips = set()
    
    for line in log_lines:
        if "ERROR:" in line:
            error_count += 1
            ip_start = line.find("IP: ")
            if ip_start != -1:
                ip_end = line.find(")", ip_start)
                ip = line[ip_start+4:ip_end]
                unique_ips.add(ip)
    
    print(f"Total Errors Found: {error_count}")
    print(f"Unique Error IPs: {', '.join(sorted(list(unique_ips)))}")

extract_errors(logs)
