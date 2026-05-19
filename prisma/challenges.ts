import { LanguageTrack, Difficulty, ValidationRule } from '@prisma/client';

export const challenges = [
  {
    languageTrack: LanguageTrack.PYTHON,
    difficulty: Difficulty.MEDIUM,
    title: 'Data Transformation Pipeline',
    prompt: 'Given a list of user records, group them by region, calculate the total count, sum of scores, number of admins, and the average score. Print the summary formatted as: [REGION] Users: count | Admins: count | Avg Score: avg_score',
    participantCode: `data = [
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
            report[reg]["admins"] += 0 # Bug: Adding 0 instead of 1
    
    for reg, stats in sorted(report.items()):
        avg = stats["total_score"] / stats["count"]
        print(f"[{reg}] Users: {stats['count']} | Admins: {stats['admins']} | Avg Score: {avg:.1f}")

generate_report(data)`,
    buggyCode: `data = [
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
            report[reg]["admins"] += 0 # Subtle Bug
    
    for reg, stats in sorted(report.items()):
        avg = stats["total_score"] / stats["count"]
        print(f"[{reg}] Users: {stats['count']} | Admins: {stats['admins']} | Avg Score: {avg:.1f}")

generate_report(data)`,
    correctCode: `data = [
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

generate_report(data)`,
    expectedOutput: `[APAC] Users: 2 | Admins: 2 | Avg Score: 81.5
[EMEA] Users: 1 | Admins: 0 | Avg Score: 92.0
[NAMER] Users: 1 | Admins: 0 | Avg Score: 88.0`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  },
  {
    languageTrack: LanguageTrack.PYTHON,
    difficulty: Difficulty.HARD,
    title: 'Log Analyzer & Formatter',
    prompt: 'Parse a list of server logs. Count total errors and extract a unique, sorted list of IPs associated with those errors.',
    participantCode: `logs = [
    "[2026-05-18 10:00:00] ERROR: User connection failed (IP: 192.168.1.10)",
    "[2026-05-18 10:05:12] INFO: Session started for user 45",
    "[2026-05-18 10:10:03] ERROR: Database timeout (IP: 10.0.0.5)",
    "[2026-05-18 10:15:00] WARN: High memory usage",
]

def extract_errors(log_lines):
    error_count = 0
    unique_ips = set()
    
    for line in log_lines:
        if "ERROR" in line: # Subtle bug: missing colon can match false positives
            error_count += 1
            ip_start = line.find("IP: ")
            if ip_start != -1:
                ip_end = line.find(")", ip_start)
                ip = line[ip_start+4:ip_end]
                unique_ips.add(ip)
    
    print(f"Total Errors Found: {error_count}")
    print(f"Unique Error IPs: {', '.join(sorted(list(unique_ips)))}")

extract_errors(logs)`,
    buggyCode: `logs = [
    "[2026-05-18 10:00:00] ERROR: User connection failed (IP: 192.168.1.10)",
    "[2026-05-18 10:05:12] INFO: Session started for user 45",
    "[2026-05-18 10:10:03] ERROR: Database timeout (IP: 10.0.0.5)",
    "[2026-05-18 10:15:00] WARN: High memory usage",
]

def extract_errors(log_lines):
    error_count = 0
    unique_ips = set()
    
    for line in log_lines:
        if "ERROR" in line: # Subtle bug: missing colon can match false positives
            error_count += 1
            ip_start = line.find("IP: ")
            if ip_start != -1:
                ip_end = line.find(")", ip_start)
                ip = line[ip_start+4:ip_end]
                unique_ips.add(ip)
    
    print(f"Total Errors Found: {error_count}")
    print(f"Unique Error IPs: {', '.join(sorted(list(unique_ips)))}")

extract_errors(logs)`,
    correctCode: `logs = [
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

extract_errors(logs)`,
    expectedOutput: `Total Errors Found: 2
Unique Error IPs: 10.0.0.5, 192.168.1.10`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  },
  {
    languageTrack: LanguageTrack.PHP_NATIVE,
    difficulty: Difficulty.MEDIUM,
    title: 'Nested Permission Checker',
    prompt: 'Check a list of users for a specific required role or if they are an admin. Only check active users. Sort the authorized names alphabetically and print them.',
    participantCode: `<?php
$users = [
    ['id' => 1, 'name' => 'Alice', 'roles' => ['editor', 'viewer'], 'active' => true],
    ['id' => 2, 'name' => 'Bob', 'roles' => ['viewer'], 'active' => false],
    ['id' => 3, 'name' => 'Charlie', 'roles' => ['admin', 'editor'], 'active' => true],
];

function checkPermissions($users, $requiredRole) {
    $authorized = [];
    foreach ($users as $user) {
        if ($user['active']) {
            foreach ($user['roles'] as $role) {
                // Bug: Checking wrong role logic, missing admin fallback
                if ($role === $requiredRole) { 
                    $authorized[] = $user['name'];
                    break;
                }
            }
        }
    }
    
    sort($authorized);
    echo "AUTHORIZED FOR '{$requiredRole}':\\n";
    foreach ($authorized as $name) {
        echo "- {$name}\\n";
    }
}

checkPermissions($users, 'editor');`,
    buggyCode: `<?php
$users = [
    ['id' => 1, 'name' => 'Alice', 'roles' => ['editor', 'viewer'], 'active' => true],
    ['id' => 2, 'name' => 'Bob', 'roles' => ['viewer'], 'active' => false],
    ['id' => 3, 'name' => 'Charlie', 'roles' => ['admin', 'editor'], 'active' => true],
];

function checkPermissions($users, $requiredRole) {
    $authorized = [];
    foreach ($users as $user) {
        if ($user['active']) {
            foreach ($user['roles'] as $role) {
                // Bug: Checking wrong role logic, missing admin fallback
                if ($role === $requiredRole) { 
                    $authorized[] = $user['name'];
                    break;
                }
            }
        }
    }
    
    sort($authorized);
    echo "AUTHORIZED FOR '{$requiredRole}':\\n";
    foreach ($authorized as $name) {
        echo "- {$name}\\n";
    }
}

checkPermissions($users, 'editor');`,
    correctCode: `<?php
$users = [
    ['id' => 1, 'name' => 'Alice', 'roles' => ['editor', 'viewer'], 'active' => true],
    ['id' => 2, 'name' => 'Bob', 'roles' => ['viewer'], 'active' => false],
    ['id' => 3, 'name' => 'Charlie', 'roles' => ['admin', 'editor'], 'active' => true],
];

function checkPermissions($users, $requiredRole) {
    $authorized = [];
    foreach ($users as $user) {
        if ($user['active']) {
            foreach ($user['roles'] as $role) {
                if ($role === $requiredRole || $role === 'admin') {
                    $authorized[] = $user['name'];
                    break;
                }
            }
        }
    }
    
    sort($authorized);
    echo "AUTHORIZED FOR '{$requiredRole}':\\n";
    foreach ($authorized as $name) {
        echo "- {$name}\\n";
    }
}

checkPermissions($users, 'editor');`,
    expectedOutput: `AUTHORIZED FOR 'editor':
- Alice
- Charlie`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  },
  {
    languageTrack: LanguageTrack.PHP_NATIVE,
    difficulty: Difficulty.HARD,
    title: 'Invoice Calculation Summary',
    prompt: 'Calculate subtotals, tax, and totals for an array of invoices. Print each invoice line and the overall grand total formatted to 2 decimal places.',
    participantCode: `<?php
$invoices = [
    ['id' => 'INV-001', 'items' => [['qty' => 2, 'price' => 50], ['qty' => 1, 'price' => 100]], 'tax_rate' => 0.1],
    ['id' => 'INV-002', 'items' => [['qty' => 5, 'price' => 20]], 'tax_rate' => 0.05],
];

function processInvoices($invoices) {
    $grandTotal = 0;
    foreach ($invoices as $inv) {
        $subtotal = 0;
        foreach ($inv['items'] as $item) {
            $subtotal += ($item['qty'] + $item['price']); // Subtle bug: addition instead of multiplication
        }
        $tax = $subtotal * $inv['tax_rate'];
        $total = $subtotal + $tax;
        $grandTotal += $total;
        
        echo "Invoice {$inv['id']}: Subtotal $" . number_format($subtotal, 2) . " | Total $" . number_format($total, 2) . "\\n";
    }
    echo "GRAND TOTAL: $" . number_format($grandTotal, 2) . "\\n";
}

processInvoices($invoices);`,
    buggyCode: `<?php
$invoices = [
    ['id' => 'INV-001', 'items' => [['qty' => 2, 'price' => 50], ['qty' => 1, 'price' => 100]], 'tax_rate' => 0.1],
    ['id' => 'INV-002', 'items' => [['qty' => 5, 'price' => 20]], 'tax_rate' => 0.05],
];

function processInvoices($invoices) {
    $grandTotal = 0;
    foreach ($invoices as $inv) {
        $subtotal = 0;
        foreach ($inv['items'] as $item) {
            $subtotal += ($item['qty'] + $item['price']); // Subtle bug: addition instead of multiplication
        }
        $tax = $subtotal * $inv['tax_rate'];
        $total = $subtotal + $tax;
        $grandTotal += $total;
        
        echo "Invoice {$inv['id']}: Subtotal $" . number_format($subtotal, 2) . " | Total $" . number_format($total, 2) . "\\n";
    }
    echo "GRAND TOTAL: $" . number_format($grandTotal, 2) . "\\n";
}

processInvoices($invoices);`,
    correctCode: `<?php
$invoices = [
    ['id' => 'INV-001', 'items' => [['qty' => 2, 'price' => 50], ['qty' => 1, 'price' => 100]], 'tax_rate' => 0.1],
    ['id' => 'INV-002', 'items' => [['qty' => 5, 'price' => 20]], 'tax_rate' => 0.05],
];

function processInvoices($invoices) {
    $grandTotal = 0;
    foreach ($invoices as $inv) {
        $subtotal = 0;
        foreach ($inv['items'] as $item) {
            $subtotal += ($item['qty'] * $item['price']);
        }
        $tax = $subtotal * $inv['tax_rate'];
        $total = $subtotal + $tax;
        $grandTotal += $total;
        
        echo "Invoice {$inv['id']}: Subtotal $" . number_format($subtotal, 2) . " | Total $" . number_format($total, 2) . "\\n";
    }
    echo "GRAND TOTAL: $" . number_format($grandTotal, 2) . "\\n";
}

processInvoices($invoices);`,
    expectedOutput: `Invoice INV-001: Subtotal $200.00 | Total $220.00
Invoice INV-002: Subtotal $100.00 | Total $105.00
GRAND TOTAL: $325.00`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  },
  {
    languageTrack: LanguageTrack.LARAVEL,
    difficulty: Difficulty.MEDIUM,
    title: 'Collection Style Filtering',
    prompt: 'Implement a standalone PHP script inspired by Laravel Collections. Filter completed orders, sum their amounts, and extract high-value order IDs.',
    participantCode: `<?php
class Collection {
    private $items;
    public function __construct($items) { $this->items = $items; }
    public static function make($items) { return new static($items); }
    public function filter($callback) { return new static(array_filter($this->items, $callback)); }
    public function map($callback) { return new static(array_map($callback, $this->items)); }
    public function values() { return new static(array_values($this->items)); }
    public function sum($key = null) {
        return array_reduce($this->items, function($carry, $item) use ($key) {
            return $carry + ($key ? $item[$key] : $item);
        }, 0);
    }
    public function toArray() { return $this->items; }
}

$orders = [
    ['id' => 101, 'status' => 'completed', 'amount' => 150.50],
    ['id' => 102, 'status' => 'pending', 'amount' => 80.00],
    ['id' => 103, 'status' => 'completed', 'amount' => 210.25],
];

$completedSum = Collection::make($orders)
    ->filter(function($order) { return $order['status'] === 'pending'; }) // Subtle bug: filtering wrong status
    ->sum('amount');

$ids = Collection::make($orders)
    ->filter(function($order) { return $order['amount'] > 100; })
    ->map(function($order) { return $order['id']; })
    ->values()
    ->toArray();

echo "COMPLETED REVENUE: $" . number_format($completedSum, 2) . "\\n";
echo "HIGH VALUE ORDER IDs: " . implode(", ", $ids) . "\\n";`,
    buggyCode: `<?php
class Collection {
    private $items;
    public function __construct($items) { $this->items = $items; }
    public static function make($items) { return new static($items); }
    public function filter($callback) { return new static(array_filter($this->items, $callback)); }
    public function map($callback) { return new static(array_map($callback, $this->items)); }
    public function values() { return new static(array_values($this->items)); }
    public function sum($key = null) {
        return array_reduce($this->items, function($carry, $item) use ($key) {
            return $carry + ($key ? $item[$key] : $item);
        }, 0);
    }
    public function toArray() { return $this->items; }
}

$orders = [
    ['id' => 101, 'status' => 'completed', 'amount' => 150.50],
    ['id' => 102, 'status' => 'pending', 'amount' => 80.00],
    ['id' => 103, 'status' => 'completed', 'amount' => 210.25],
];

$completedSum = Collection::make($orders)
    ->filter(function($order) { return $order['status'] === 'pending'; }) // Subtle bug: filtering wrong status
    ->sum('amount');

$ids = Collection::make($orders)
    ->filter(function($order) { return $order['amount'] > 100; })
    ->map(function($order) { return $order['id']; })
    ->values()
    ->toArray();

echo "COMPLETED REVENUE: $" . number_format($completedSum, 2) . "\\n";
echo "HIGH VALUE ORDER IDs: " . implode(", ", $ids) . "\\n";`,
    correctCode: `<?php
class Collection {
    private $items;
    public function __construct($items) { $this->items = $items; }
    public static function make($items) { return new static($items); }
    public function filter($callback) { return new static(array_filter($this->items, $callback)); }
    public function map($callback) { return new static(array_map($callback, $this->items)); }
    public function values() { return new static(array_values($this->items)); }
    public function sum($key = null) {
        return array_reduce($this->items, function($carry, $item) use ($key) {
            return $carry + ($key ? $item[$key] : $item);
        }, 0);
    }
    public function toArray() { return $this->items; }
}

$orders = [
    ['id' => 101, 'status' => 'completed', 'amount' => 150.50],
    ['id' => 102, 'status' => 'pending', 'amount' => 80.00],
    ['id' => 103, 'status' => 'completed', 'amount' => 210.25],
];

$completedSum = Collection::make($orders)
    ->filter(function($order) { return $order['status'] === 'completed'; })
    ->sum('amount');

$ids = Collection::make($orders)
    ->filter(function($order) { return $order['amount'] > 100; })
    ->map(function($order) { return $order['id']; })
    ->values()
    ->toArray();

echo "COMPLETED REVENUE: $" . number_format($completedSum, 2) . "\\n";
echo "HIGH VALUE ORDER IDs: " . implode(", ", $ids) . "\\n";`,
    expectedOutput: `COMPLETED REVENUE: $360.75
HIGH VALUE ORDER IDs: 101, 103`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  },
  {
    languageTrack: LanguageTrack.LARAVEL,
    difficulty: Difficulty.HARD,
    title: 'Controller Validation Simulation',
    prompt: 'Simulate Laravel request validation logic natively. Support "required", "email", and "min" rules.',
    participantCode: `<?php
class Validator {
    public static function validate($request, $rules) {
        $errors = [];
        foreach ($rules as $field => $ruleString) {
            $rulesArray = explode('|', $ruleString);
            $value = isset($request[$field]) ? $request[$field] : null;
            
            foreach ($rulesArray as $rule) {
                if ($rule === 'required' && empty($value)) {
                    $errors[$field][] = "The {$field} field is required.";
                }
                if ($rule === 'email' && !empty($value) && filter_var($value, FILTER_VALIDATE_EMAIL)) { // Subtle Bug: missing '!' operator
                    $errors[$field][] = "The {$field} must be a valid email address.";
                }
                if (strpos($rule, 'min:') === 0 && !empty($value)) {
                    $min = (int) substr($rule, 4);
                    if (strlen($value) < $min) {
                        $errors[$field][] = "The {$field} must be at least {$min} characters.";
                    }
                }
            }
        }
        return $errors;
    }
}

$requestData = [
    'email' => 'invalid-email',
    'password' => '123'
];

$rules = [
    'email' => 'required|email',
    'password' => 'required|min:8',
    'name' => 'required'
];

$errors = Validator::validate($requestData, $rules);

if (empty($errors)) {
    echo "VALIDATION PASSED\\n";
} else {
    echo "VALIDATION FAILED:\\n";
    foreach ($errors as $field => $messages) {
        foreach ($messages as $message) {
            echo "- {$message}\\n";
        }
    }
}`,
    buggyCode: `<?php
class Validator {
    public static function validate($request, $rules) {
        $errors = [];
        foreach ($rules as $field => $ruleString) {
            $rulesArray = explode('|', $ruleString);
            $value = isset($request[$field]) ? $request[$field] : null;
            
            foreach ($rulesArray as $rule) {
                if ($rule === 'required' && empty($value)) {
                    $errors[$field][] = "The {$field} field is required.";
                }
                if ($rule === 'email' && !empty($value) && filter_var($value, FILTER_VALIDATE_EMAIL)) { // Subtle Bug: missing '!' operator
                    $errors[$field][] = "The {$field} must be a valid email address.";
                }
                if (strpos($rule, 'min:') === 0 && !empty($value)) {
                    $min = (int) substr($rule, 4);
                    if (strlen($value) < $min) {
                        $errors[$field][] = "The {$field} must be at least {$min} characters.";
                    }
                }
            }
        }
        return $errors;
    }
}

$requestData = [
    'email' => 'invalid-email',
    'password' => '123'
];

$rules = [
    'email' => 'required|email',
    'password' => 'required|min:8',
    'name' => 'required'
];

$errors = Validator::validate($requestData, $rules);

if (empty($errors)) {
    echo "VALIDATION PASSED\\n";
} else {
    echo "VALIDATION FAILED:\\n";
    foreach ($errors as $field => $messages) {
        foreach ($messages as $message) {
            echo "- {$message}\\n";
        }
    }
}`,
    correctCode: `<?php
class Validator {
    public static function validate($request, $rules) {
        $errors = [];
        foreach ($rules as $field => $ruleString) {
            $rulesArray = explode('|', $ruleString);
            $value = isset($request[$field]) ? $request[$field] : null;
            
            foreach ($rulesArray as $rule) {
                if ($rule === 'required' && empty($value)) {
                    $errors[$field][] = "The {$field} field is required.";
                }
                if ($rule === 'email' && !empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $errors[$field][] = "The {$field} must be a valid email address.";
                }
                if (strpos($rule, 'min:') === 0 && !empty($value)) {
                    $min = (int) substr($rule, 4);
                    if (strlen($value) < $min) {
                        $errors[$field][] = "The {$field} must be at least {$min} characters.";
                    }
                }
            }
        }
        return $errors;
    }
}

$requestData = [
    'email' => 'invalid-email',
    'password' => '123'
];

$rules = [
    'email' => 'required|email',
    'password' => 'required|min:8',
    'name' => 'required'
];

$errors = Validator::validate($requestData, $rules);

if (empty($errors)) {
    echo "VALIDATION PASSED\\n";
} else {
    echo "VALIDATION FAILED:\\n";
    foreach ($errors as $field => $messages) {
        foreach ($messages as $message) {
            echo "- {$message}\\n";
        }
    }
}`,
    expectedOutput: `VALIDATION FAILED:
- The email must be a valid email address.
- The password must be at least 8 characters.
- The name field is required.`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  },
  {
    languageTrack: LanguageTrack.JAVASCRIPT,
    difficulty: Difficulty.MEDIUM,
    title: 'Transaction Summary',
    prompt: 'Summarize a list of transactions. Calculate total credits, total debits, and net balance, ignoring failed transactions.',
    participantCode: `const transactions = [
    { txId: "TX1001", amount: 450, type: "credit", status: "success" },
    { txId: "TX1002", amount: -50, type: "debit", status: "failed" },
    { txId: "TX1003", amount: 1200, type: "credit", status: "success" },
    { txId: "TX1004", amount: -300, type: "debit", status: "success" }
];

function summarizeTransactions(txs) {
    const summary = {
        totalCredits: 0,
        totalDebits: 0,
        failedCount: 0,
        netBalance: 0
    };

    txs.forEach(tx => {
        if (tx.status === "failed") {
            summary.failedCount++;
            return;
        }

        if (tx.type === "credit") {
            summary.totalCredits += tx.amount;
        } else if (tx.type === "debit") {
            summary.totalDebits -= Math.abs(tx.amount); // Bug: Debits should be added to totalDebits tracker
        }
    });

    summary.netBalance = summary.totalCredits - summary.totalDebits;

    console.log(\`TOTAL CREDITS: $\${summary.totalCredits}\`);
    console.log(\`TOTAL DEBITS: $\${summary.totalDebits}\`);
    console.log(\`NET BALANCE: $\${summary.netBalance}\`);
    console.log(\`FAILED TRANSACTIONS: \${summary.failedCount}\`);
}

summarizeTransactions(transactions);`,
    buggyCode: `const transactions = [
    { txId: "TX1001", amount: 450, type: "credit", status: "success" },
    { txId: "TX1002", amount: -50, type: "debit", status: "failed" },
    { txId: "TX1003", amount: 1200, type: "credit", status: "success" },
    { txId: "TX1004", amount: -300, type: "debit", status: "success" }
];

function summarizeTransactions(txs) {
    const summary = {
        totalCredits: 0,
        totalDebits: 0,
        failedCount: 0,
        netBalance: 0
    };

    txs.forEach(tx => {
        if (tx.status === "failed") {
            summary.failedCount++;
            return;
        }

        if (tx.type === "credit") {
            summary.totalCredits += tx.amount;
        } else if (tx.type === "debit") {
            summary.totalDebits -= Math.abs(tx.amount); // Bug: Debits should be added to totalDebits tracker
        }
    });

    summary.netBalance = summary.totalCredits - summary.totalDebits;

    console.log(\`TOTAL CREDITS: $\${summary.totalCredits}\`);
    console.log(\`TOTAL DEBITS: $\${summary.totalDebits}\`);
    console.log(\`NET BALANCE: $\${summary.netBalance}\`);
    console.log(\`FAILED TRANSACTIONS: \${summary.failedCount}\`);
}

summarizeTransactions(transactions);`,
    correctCode: `const transactions = [
    { txId: "TX1001", amount: 450, type: "credit", status: "success" },
    { txId: "TX1002", amount: -50, type: "debit", status: "failed" },
    { txId: "TX1003", amount: 1200, type: "credit", status: "success" },
    { txId: "TX1004", amount: -300, type: "debit", status: "success" }
];

function summarizeTransactions(txs) {
    const summary = {
        totalCredits: 0,
        totalDebits: 0,
        failedCount: 0,
        netBalance: 0
    };

    txs.forEach(tx => {
        if (tx.status === "failed") {
            summary.failedCount++;
            return;
        }

        if (tx.type === "credit") {
            summary.totalCredits += tx.amount;
        } else if (tx.type === "debit") {
            summary.totalDebits += Math.abs(tx.amount);
        }
    });

    summary.netBalance = summary.totalCredits - summary.totalDebits;

    console.log(\`TOTAL CREDITS: $\${summary.totalCredits}\`);
    console.log(\`TOTAL DEBITS: $\${summary.totalDebits}\`);
    console.log(\`NET BALANCE: $\${summary.netBalance}\`);
    console.log(\`FAILED TRANSACTIONS: \${summary.failedCount}\`);
}

summarizeTransactions(transactions);`,
    expectedOutput: `TOTAL CREDITS: $1650
TOTAL DEBITS: $300
NET BALANCE: $1350
FAILED TRANSACTIONS: 1`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  },
  {
    languageTrack: LanguageTrack.JAVASCRIPT,
    difficulty: Difficulty.HARD,
    title: 'Grouped Inventory Report',
    prompt: 'Generate an inventory report. Group items by category, calculate total quantity per category, and list sorted items.',
    participantCode: `const inventory = [
    { category: "Electronics", item: "Laptop", qty: 45 },
    { category: "Furniture", item: "Desk", qty: 12 },
    { category: "Electronics", item: "Mouse", qty: 150 },
    { category: "Supplies", item: "Paper", qty: 500 },
    { category: "Furniture", item: "Chair", qty: 24 }
];

function generateInventoryReport(items) {
    const grouped = items.reduce((acc, current) => {
        if (!acc[current.category]) {
            acc[current.category] = [];
        }
        acc[current.category].push(current);
        return acc;
    }, {});

    const categories = Object.keys(grouped).sort();

    categories.forEach(cat => {
        const totalQty = grouped[cat].reduce((sum, i) => sum + i.qty, 0);
        console.log(\`[\${cat.toUpperCase()}] Total Qty: \${totalQty}\`);
        
        const sortedItems = grouped[cat].sort((a, b) => b.item.localeCompare(a.item)); // Bug: sorting descending
        sortedItems.forEach(i => {
            console.log(\`  - \${i.item} (\${i.qty})\`);
        });
    });
}

generateInventoryReport(inventory);`,
    buggyCode: `const inventory = [
    { category: "Electronics", item: "Laptop", qty: 45 },
    { category: "Furniture", item: "Desk", qty: 12 },
    { category: "Electronics", item: "Mouse", qty: 150 },
    { category: "Supplies", item: "Paper", qty: 500 },
    { category: "Furniture", item: "Chair", qty: 24 }
];

function generateInventoryReport(items) {
    const grouped = items.reduce((acc, current) => {
        if (!acc[current.category]) {
            acc[current.category] = [];
        }
        acc[current.category].push(current);
        return acc;
    }, {});

    const categories = Object.keys(grouped).sort();

    categories.forEach(cat => {
        const totalQty = grouped[cat].reduce((sum, i) => sum + i.qty, 0);
        console.log(\`[\${cat.toUpperCase()}] Total Qty: \${totalQty}\`);
        
        const sortedItems = grouped[cat].sort((a, b) => b.item.localeCompare(a.item)); // Bug: sorting descending
        sortedItems.forEach(i => {
            console.log(\`  - \${i.item} (\${i.qty})\`);
        });
    });
}

generateInventoryReport(inventory);`,
    correctCode: `const inventory = [
    { category: "Electronics", item: "Laptop", qty: 45 },
    { category: "Furniture", item: "Desk", qty: 12 },
    { category: "Electronics", item: "Mouse", qty: 150 },
    { category: "Supplies", item: "Paper", qty: 500 },
    { category: "Furniture", item: "Chair", qty: 24 }
];

function generateInventoryReport(items) {
    const grouped = items.reduce((acc, current) => {
        if (!acc[current.category]) {
            acc[current.category] = [];
        }
        acc[current.category].push(current);
        return acc;
    }, {});

    const categories = Object.keys(grouped).sort();

    categories.forEach(cat => {
        const totalQty = grouped[cat].reduce((sum, i) => sum + i.qty, 0);
        console.log(\`[\${cat.toUpperCase()}] Total Qty: \${totalQty}\`);
        
        const sortedItems = grouped[cat].sort((a, b) => a.item.localeCompare(b.item));
        sortedItems.forEach(i => {
            console.log(\`  - \${i.item} (\${i.qty})\`);
        });
    });
}

generateInventoryReport(inventory);`,
    expectedOutput: `[ELECTRONICS] Total Qty: 195
  - Laptop (45)
  - Mouse (150)
[FURNITURE] Total Qty: 36
  - Chair (24)
  - Desk (12)
[SUPPLIES] Total Qty: 500
  - Paper (500)`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  },
  {
    languageTrack: LanguageTrack.VUE,
    difficulty: Difficulty.MEDIUM,
    title: 'Computed Property Simulation',
    prompt: 'Simulate a Vue computed property using standalone JS. Filter active users based on a reactive search query.',
    participantCode: `const reactiveState = {
    _data: {
        users: [
            { name: "John", active: true },
            { name: "Jane", active: false },
            { name: "Doe", active: true }
        ],
        searchQuery: "j"
    },
    get users() { return this._data.users; },
    get searchQuery() { return this._data.searchQuery; },
    set searchQuery(val) { this._data.searchQuery = val; }
};

function computedActiveFilteredUsers() {
    const query = reactiveState.searchQuery.toLowerCase();
    return reactiveState.users.filter(user => {
        return user.name.toLowerCase().includes(query); // Bug: Not checking user.active
    });
}

console.log("INITIAL FILTERED USERS:");
computedActiveFilteredUsers().forEach(u => console.log(\`- \${u.name}\`));

reactiveState.searchQuery = "do";

console.log("\\nAFTER SEARCH UPDATE ('do'):");
computedActiveFilteredUsers().forEach(u => console.log(\`- \${u.name}\`));`,
    buggyCode: `const reactiveState = {
    _data: {
        users: [
            { name: "John", active: true },
            { name: "Jane", active: false },
            { name: "Doe", active: true }
        ],
        searchQuery: "j"
    },
    get users() { return this._data.users; },
    get searchQuery() { return this._data.searchQuery; },
    set searchQuery(val) { this._data.searchQuery = val; }
};

function computedActiveFilteredUsers() {
    const query = reactiveState.searchQuery.toLowerCase();
    return reactiveState.users.filter(user => {
        return user.name.toLowerCase().includes(query); // Bug: Not checking user.active
    });
}

console.log("INITIAL FILTERED USERS:");
computedActiveFilteredUsers().forEach(u => console.log(\`- \${u.name}\`));

reactiveState.searchQuery = "do";

console.log("\\nAFTER SEARCH UPDATE ('do'):");
computedActiveFilteredUsers().forEach(u => console.log(\`- \${u.name}\`));`,
    correctCode: `const reactiveState = {
    _data: {
        users: [
            { name: "John", active: true },
            { name: "Jane", active: false },
            { name: "Doe", active: true }
        ],
        searchQuery: "j"
    },
    get users() { return this._data.users; },
    get searchQuery() { return this._data.searchQuery; },
    set searchQuery(val) { this._data.searchQuery = val; }
};

function computedActiveFilteredUsers() {
    const query = reactiveState.searchQuery.toLowerCase();
    return reactiveState.users.filter(user => {
        return user.active && user.name.toLowerCase().includes(query);
    });
}

console.log("INITIAL FILTERED USERS:");
computedActiveFilteredUsers().forEach(u => console.log(\`- \${u.name}\`));

reactiveState.searchQuery = "do";

console.log("\\nAFTER SEARCH UPDATE ('do'):");
computedActiveFilteredUsers().forEach(u => console.log(\`- \${u.name}\`));`,
    expectedOutput: `INITIAL FILTERED USERS:
- John

AFTER SEARCH UPDATE ('do'):
- Doe`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  },
  {
    languageTrack: LanguageTrack.VUE,
    difficulty: Difficulty.HARD,
    title: 'Reactive Style Prop Processing',
    prompt: 'Implement a standalone JS component with props and data to calculate discounts and render a list of products.',
    participantCode: `function defineComponent(options) {
    return {
        props: options.props || {},
        data: options.data ? options.data() : {},
        render() {
            const mappedData = this.data.items.map(item => {
                const isDiscounted = item.price > this.props.discountThreshold;
                const finalPrice = isDiscounted ? item.price * 1.9 : item.price; // Bug: Markup instead of discount
                return \`\${item.name}: $\${finalPrice.toFixed(2)}\${isDiscounted ? ' (Sale)' : ''}\`;
            });
            
            console.log(\`--- \${this.props.title} ---\`);
            mappedData.forEach(text => console.log(text));
        }
    };
}

const ProductList = defineComponent({
    props: {
        title: "Winter Tech Sale",
        discountThreshold: 100
    },
    data() {
        return {
            items: [
                { name: "Keyboard", price: 45.00 },
                { name: "Monitor", price: 299.99 },
                { name: "Mouse", price: 85.50 },
                { name: "Headphones", price: 150.00 }
            ]
        };
    }
});

ProductList.render();`,
    buggyCode: `function defineComponent(options) {
    return {
        props: options.props || {},
        data: options.data ? options.data() : {},
        render() {
            const mappedData = this.data.items.map(item => {
                const isDiscounted = item.price > this.props.discountThreshold;
                const finalPrice = isDiscounted ? item.price * 1.9 : item.price; // Bug: Markup instead of discount
                return \`\${item.name}: $\${finalPrice.toFixed(2)}\${isDiscounted ? ' (Sale)' : ''}\`;
            });
            
            console.log(\`--- \${this.props.title} ---\`);
            mappedData.forEach(text => console.log(text));
        }
    };
}

const ProductList = defineComponent({
    props: {
        title: "Winter Tech Sale",
        discountThreshold: 100
    },
    data() {
        return {
            items: [
                { name: "Keyboard", price: 45.00 },
                { name: "Monitor", price: 299.99 },
                { name: "Mouse", price: 85.50 },
                { name: "Headphones", price: 150.00 }
            ]
        };
    }
});

ProductList.render();`,
    correctCode: `function defineComponent(options) {
    return {
        props: options.props || {},
        data: options.data ? options.data() : {},
        render() {
            const mappedData = this.data.items.map(item => {
                const isDiscounted = item.price > this.props.discountThreshold;
                const finalPrice = isDiscounted ? item.price * 0.9 : item.price;
                return \`\${item.name}: $\${finalPrice.toFixed(2)}\${isDiscounted ? ' (Sale)' : ''}\`;
            });
            
            console.log(\`--- \${this.props.title} ---\`);
            mappedData.forEach(text => console.log(text));
        }
    };
}

const ProductList = defineComponent({
    props: {
        title: "Winter Tech Sale",
        discountThreshold: 100
    },
    data() {
        return {
            items: [
                { name: "Keyboard", price: 45.00 },
                { name: "Monitor", price: 299.99 },
                { name: "Mouse", price: 85.50 },
                { name: "Headphones", price: 150.00 }
            ]
        };
    }
});

ProductList.render();`,
    expectedOutput: `--- Winter Tech Sale ---
Keyboard: $45.00
Monitor: $269.99 (Sale)
Mouse: $85.50
Headphones: $135.00 (Sale)`,
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: "Check structure and logic.",
  }
];