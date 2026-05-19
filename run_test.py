data = [
    {"user": "Alice", "role": "admin", "score": 85, "region": "APAC"},
    {"user": "Bob", "role": "user", "score": 92, "region": "EMEA"},
    {"user": "Charlie", "role": "admin", "score": 78, "region": "APAC"},
    {"user": "Diana", "role": "user", "score": 88, "region": "NAMER"},
]

def generate_report(records):
    report = {}
    for r in records:
        reg = r["region"]
        if reg not in report:
            report[reg] = {"count": 0, "total_score": 0, "admins": 0}
        report[reg]["count"] += 1
        report[reg]["total_score"] += r["score"]
        if r["role"] == "admin":
            report[reg]["admins"] += 1
    
    for reg, stats in sorted(report.items()):
        avg = stats["total_score"] / stats["count"]
        print(f"[{reg}] Users: {stats['count']} | Admins: {stats['admins']} | Avg Score: {avg:.1f}")

generate_report(data)
