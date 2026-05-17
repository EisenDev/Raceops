import { LanguageTrack, Difficulty, ValidationRule } from '@prisma/client';

export interface ChallengeSeed {
  languageTrack: LanguageTrack;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  participantCode: string;
  correctCode: string;
  buggyCode: string;
  expectedOutput: string;
  validationRule: ValidationRule;
  genericHint: string;
}

export const challenges: ChallengeSeed[] = [
  // --- PYTHON ---
  {
    languageTrack: LanguageTrack.PYTHON,
    difficulty: Difficulty.HARD,
    title: 'Advanced Data Pipeline',
    prompt: 'Process a list of raw user telemetry logs. Filter out system events, convert timestamps, normalize scores, and group results by region.',
    participantCode: `import json
from datetime import datetime

def process_telemetry(raw_data):
    # raw_data: list of JSON strings
    # 1. Filter: "event_type" == "user_action"
    # 2. Transform: Convert "ts" (ms) to ISO string
    # 3. Normalize: "score" should be 0.0 to 1.0 (div by 100)
    # 4. Group by: "region"
    
    processed = {}
    for entry in raw_data:
        data = json.loads(entry)
        if data.get("event_type") == "user_action":
            region = data.get("region", "UNKNOWN")
            
            # Timestamp conversion
            dt = datetime.fromtimestamp(data["ts"] / 1000.0)
            iso_ts = dt.isoformat()
            
            # Score normalization
            norm_score = min(1.0, max(0.0, data["score"] / 100.0))
            
            if region not in processed:
                processed[region] = []
                
            processed[region].append({
                "uid": data["uid"],
                "timestamp": iso_ts,
                "score": norm_score
            })
            
    return processed`,
    correctCode: `import json
from datetime import datetime

def process_telemetry(raw_data):
    # raw_data: list of JSON strings
    # 1. Filter: "event_type" == "user_action"
    # 2. Transform: Convert "ts" (ms) to ISO string
    # 3. Normalize: "score" should be 0.0 to 1.0 (div by 100)
    # 4. Group by: "region"
    
    processed = {}
    for entry in raw_data:
        data = json.loads(entry)
        if data.get("event_type") == "user_action":
            region = data.get("region", "UNKNOWN")
            
            # Timestamp conversion
            dt = datetime.fromtimestamp(data["ts"] / 1000.0)
            iso_ts = dt.isoformat()
            
            # Score normalization
            norm_score = min(1.0, max(0.0, data["score"] / 100.0))
            
            if region not in processed:
                processed[region] = []
                
            processed[region].append({
                "uid": data["uid"],
                "timestamp": iso_ts,
                "score": norm_score
            })
            
    return processed`,
    buggyCode: `import json
from datetime import datetime

def process_telemetry(raw_data):
    processed = {}
    for entry in raw_data:
        data = json.loads(entry)
        if data.get("event_type") == "user_action":
            region = data.get("region", "UNKNOWN")
            
            # Bug: using integer division instead of float
            dt = datetime.fromtimestamp(data["ts"] // 1000)
            iso_ts = dt.isoformat()
            
            # Bug: missing normalization clamping
            norm_score = data["score"] / 100
            
            if region not in processed:
                processed[region] = []
                
            processed[region].append({
                "uid": data["uid"],
                "timestamp": iso_ts,
                "score": norm_score
            })
            
    return processed`,
    expectedOutput: 'Dictionary grouped by region with normalized scores and ISO timestamps.',
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: 'Check the floating point division and clamping logic.'
  },
  {
    languageTrack: LanguageTrack.PYTHON,
    difficulty: Difficulty.VERY_HARD,
    title: 'Enterprise Log Formatter',
    prompt: 'Parse standard Apache-style logs using regex. Extract client IP, method, and response size. Aggregate total bytes per method.',
    participantCode: `import re

def aggregate_log_stats(logs):
    # Format: 127.0.0.1 - - [15/May/2026:14:00:00 +0000] "GET /api HTTP/1.1" 200 1234
    regex = r'(\\d+\\.\\d+\\.\\d+\\.\\d+).*"(GET|POST|PUT|DELETE)\\s+.*"\\s+\\d+\\s+(\\d+)'
    
    stats = {
        "GET": 0, "POST": 0, "PUT": 0, "DELETE": 0
    }
    
    for line in logs.strip().split("\\n"):
        match = re.search(regex, line)
        if match:
            method = match.group(2)
            bytes_sent = int(match.group(3))
            
            if method in stats:
                stats[method] += bytes_sent
                
    # Prepare summary string
    report = []
    for method, total in stats.items():
        if total > 0:
            report.append(f"{method}: {total} bytes")
            
    return "\\n".join(report)`,
    correctCode: `import re

def aggregate_log_stats(logs):
    # Format: 127.0.0.1 - - [15/May/2026:14:00:00 +0000] "GET /api HTTP/1.1" 200 1234
    regex = r'(\\d+\\.\\d+\\.\\d+\\.\\d+).*"(GET|POST|PUT|DELETE)\\s+.*"\\s+\\d+\\s+(\\d+)'
    
    stats = {
        "GET": 0, "POST": 0, "PUT": 0, "DELETE": 0
    }
    
    for line in logs.strip().split("\\n"):
        match = re.search(regex, line)
        if match:
            method = match.group(2)
            bytes_sent = int(match.group(3))
            
            if method in stats:
                stats[method] += bytes_sent
                
    # Prepare summary string
    report = []
    for method, total in stats.items():
        if total > 0:
            report.append(f"{method}: {total} bytes")
            
    return "\\n".join(report)`,
    buggyCode: `import re

def aggregate_log_stats(logs):
    regex = r'(\\d+\\.\\d+\\.\\d+\\.\\d+).*"(GET|POST|PUT|DELETE)\\s+.*"\\s+\\d+\\s+(\\d+)'
    
    stats = {} # Bug: Dynamic dict without initialization leads to KeyErrors
    
    for line in logs.strip().split("\\n"):
        match = re.search(regex, line)
        if match:
            method = match.group(2)
            bytes_sent = match.group(3) # Bug: Missing int() conversion
            
            stats[method] += bytes_sent
            
    return stats`,
    expectedOutput: 'GET: 4500 bytes\\nPOST: 1200 bytes',
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: 'Check capture group indexing and dictionary initialization.'
  },

  // --- PHP NATIVE ---
  {
    languageTrack: LanguageTrack.PHP_NATIVE,
    difficulty: Difficulty.HARD,
    title: 'Robust Order Processor',
    prompt: 'Calculate shipping costs and subtotals for an order. Apply bulk discounts (10% off for 5+ items) and calculate VAT.',
    participantCode: `function process_order_summary($items, $base_shipping = 50.00) {
    $total_qty = 0;
    $subtotal = 0.0;
    
    foreach ($items as $item) {
        $total_qty += $item['qty'];
        $item_total = $item['price'] * $item['qty'];
        
        // Bulk discount logic
        if ($item['qty'] >= 5) {
            $item_total *= 0.90;
        }
        
        $subtotal += $item_total;
    }
    
    // Free shipping for orders over 1000
    $shipping = ($subtotal > 1000) ? 0.0 : $base_shipping;
    
    $vat = $subtotal * 0.12;
    $grand_total = $subtotal + $shipping + $vat;
    
    return [
        "subtotal" => number_format($subtotal, 2),
        "shipping" => number_format($shipping, 2),
        "vat" => number_format($vat, 2),
        "total" => number_format($grand_total, 2)
    ];
}`,
    correctCode: `function process_order_summary($items, $base_shipping = 50.00) {
    $total_qty = 0;
    $subtotal = 0.0;
    
    foreach ($items as $item) {
        $total_qty += $item['qty'];
        $item_total = $item['price'] * $item['qty'];
        
        // Bulk discount logic
        if ($item['qty'] >= 5) {
            $item_total *= 0.90;
        }
        
        $subtotal += $item_total;
    }
    
    // Free shipping for orders over 1000
    $shipping = ($subtotal > 1000) ? 0.0 : $base_shipping;
    
    $vat = $subtotal * 0.12;
    $grand_total = $subtotal + $shipping + $vat;
    
    return [
        "subtotal" => number_format($subtotal, 2),
        "shipping" => number_format($shipping, 2),
        "vat" => number_format($vat, 2),
        "total" => number_format($grand_total, 2)
    ];
}`,
    buggyCode: `function process_order_summary($items, $base_shipping = 50.00) {
    $total_qty = 0;
    $subtotal = 0.0;
    
    foreach ($items as $item) {
        $total_qty += $item['qty'];
        $item_total = $item['price'] * $item['qty'];
        
        // Bug: applied discount after adding to subtotal
        if ($item['qty'] >= 5) {
            $subtotal += ($item_total * 0.90);
        } else {
            $subtotal += $item_total;
        }
    }
    
    // Bug: comparison operator logic error
    $shipping = ($subtotal < 1000) ? 0.0 : $base_shipping;
    
    return $subtotal;
}`,
    expectedOutput: 'Associative array with formatted currency strings.',
    validationRule: ValidationRule.REQUIRES_SEMICOLON,
    genericHint: 'Check formatting functions and discount logic boundaries.'
  },
  {
    languageTrack: LanguageTrack.PHP_NATIVE,
    difficulty: Difficulty.VERY_HARD,
    title: 'Recursive Directory Mapper',
    prompt: 'Implement a function to recursively map a nested array structure representing a file system to a flat list of paths.',
    participantCode: `function flatten_file_tree($tree, $parent_path = "") {
    $results = [];
    
    foreach ($tree as $node) {
        $current_path = $parent_path . "/" . $node['name'];
        
        if ($node['type'] === 'file') {
            $results[] = [
                'path' => $current_path,
                'size' => $node['size']
            ];
        } else if ($node['type'] === 'directory' && isset($node['children'])) {
            $sub_results = flatten_file_tree($node['children'], $current_path);
            $results = array_merge($results, $sub_results);
        }
    }
    
    // Sort by path length for presentation
    usort($results, function($a, $b) {
        return strlen($a['path']) - strlen($b['path']);
    });
    
    return $results;
}`,
    correctCode: `function flatten_file_tree($tree, $parent_path = "") {
    $results = [];
    
    foreach ($tree as $node) {
        $current_path = $parent_path . "/" . $node['name'];
        
        if ($node['type'] === 'file') {
            $results[] = [
                'path' => $current_path,
                'size' => $node['size']
            ];
        } else if ($node['type'] === 'directory' && isset($node['children'])) {
            $sub_results = flatten_file_tree($node['children'], $current_path);
            $results = array_merge($results, $sub_results);
        }
    }
    
    // Sort by path length for presentation
    usort($results, function($a, $b) {
        return strlen($a['path']) - strlen($b['path']);
    });
    
    return $results;
}`,
    buggyCode: `function flatten_file_tree($tree, $parent_path = "") {
    $results = [];
    
    foreach ($tree as $node) {
        $current_path = $parent_path . $node['name']; # Bug: Missing separator
        
        if ($node['type'] === 'file') {
            $results[] = $current_path;
        } else {
            # Bug: Infinite recursion if children is missing or path isn't passed
            $results = array_push($results, flatten_file_tree($node['children']));
        }
    }
    
    return $results;
}`,
    expectedOutput: 'Flat list of file path objects sorted by depth.',
    validationRule: ValidationRule.REQUIRES_SEMICOLON,
    genericHint: 'Verify recursion parameters and array merging methods.'
  },

  // --- LARAVEL ---
  {
    languageTrack: LanguageTrack.LARAVEL,
    difficulty: Difficulty.HARD,
    title: 'Custom Middleware Guard',
    prompt: 'Implement a middleware that checks if a user has a specific subscription tier and redirects if unauthorized.',
    participantCode: `namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class SubscriptionGuard {
    public function handle(Request $request, Closure $next, string $tier): Response {
        $user = $request->user();
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        if (!$user->hasSubscription($tier)) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Upgrade required'], 403);
            }
            return redirect()->route('billing.index')->with('warning', 'Access Restricted.');
        }
        
        // Log access for auditing
        \\Log::info("Access granted to {user->id} for tier {tier}");
        
        return $next($request);
    }
}`,
    correctCode: `namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class SubscriptionGuard {
    public function handle(Request $request, Closure $next, string $tier): Response {
        $user = $request->user();
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        if (!$user->hasSubscription($tier)) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Upgrade required'], 403);
            }
            return redirect()->route('billing.index')->with('warning', 'Access Restricted.');
        }
        
        // Log access for auditing
        \\Log::info("Access granted to {user->id} for tier {tier}");
        
        return $next($request);
    }
}`,
    buggyCode: `namespace App\\Http\\Middleware;

class SubscriptionGuard {
    public function handle($request, $next) {
        # Bug: Missing tier parameter from route definition
        if ($request->user()->tier != 'PRO') {
            return redirect('login');
        }
        
        # Bug: Missing return next request
        $next($request);
    }
}`,
    expectedOutput: 'Laravel Middleware Class',
    validationRule: ValidationRule.REQUIRES_SEMICOLON,
    genericHint: 'Check middleware handle parameters and return flow.'
  },
  {
    languageTrack: LanguageTrack.LARAVEL,
    difficulty: Difficulty.VERY_HARD,
    title: 'Repository Pattern Implementation',
    prompt: 'Implement a Repository method that performs a complex search on orders, filtering by status and customer email using Eloquent relations.',
    participantCode: `namespace App\\Repositories;

use App\\Models\\Order;
use Illuminate\\Support\\Collection;

class OrderRepository {
    public function searchOrders(array $criteria): Collection {
        $query = Order::query();
        
        if (!empty($criteria['status'])) {
            $query->where('status', $criteria['status']);
        }
        
        if (!empty($criteria['email'])) {
            $query->whereHas('customer', function($q) use ($criteria) {
                $q->where('email', 'LIKE', '%' . $criteria['email'] . '%');
            });
        }
        
        return $query->with(['items', 'customer'])
            ->latest()
            ->limit(50)
            ->get();
    }
    
    public function findOrderById(int $id): ?Order {
        return Order::with('items')->find($id);
    }
}`,
    correctCode: `namespace App\\Repositories;

use App\\Models\\Order;
use Illuminate\\Support\\Collection;

class OrderRepository {
    public function searchOrders(array $criteria): Collection {
        $query = Order::query();
        
        if (!empty($criteria['status'])) {
            $query->where('status', $criteria['status']);
        }
        
        if (!empty($criteria['email'])) {
            $query->whereHas('customer', function($q) use ($criteria) {
                $q->where('email', 'LIKE', '%' . $criteria['email'] . '%');
            });
        }
        
        return $query->with(['items', 'customer'])
            ->latest()
            ->limit(50)
            ->get();
    }
    
    public function findOrderById(int $id): ?Order {
        return Order::with('items')->find($id);
    }
}`,
    buggyCode: `namespace App\\Repositories;

class OrderRepository {
    public function searchOrders($criteria) {
        # Bug: Logic error in whereHas closure - missing 'use' for criteria
        return Order::whereHas('customer', function($q) {
            $q->where('email', $criteria['email']);
        })->get();
    }
}`,
    expectedOutput: 'Laravel Repository Class',
    validationRule: ValidationRule.REQUIRES_SEMICOLON,
    genericHint: 'Ensure closures have access to parent scope variables.'
  },

  // --- VUE ---
  {
    languageTrack: LanguageTrack.VUE,
    difficulty: Difficulty.HARD,
    title: 'Composable State Manager',
    prompt: 'Implement a custom composable (useAuth) that manages a global user state and provides login/logout methods.',
    participantCode: `import { ref, readonly } from 'vue';

const user = ref(null);
const loading = ref(false);

export function useAuth() {
    const login = async (credentials) => {
        loading.value = true;
        try {
            const response = await api.post('/login', credentials);
            user.value = response.data;
            localStorage.setItem('token', response.token);
        } finally {
            loading.value = false;
        }
    };
    
    const logout = () => {
        user.value = null;
        localStorage.removeItem('token');
    };
    
    return {
        user: readonly(user),
        loading: readonly(loading),
        login,
        logout
    };
}`,
    correctCode: `import { ref, readonly } from 'vue';

const user = ref(null);
const loading = ref(false);

export function useAuth() {
    const login = async (credentials) => {
        loading.value = true;
        try {
            const response = await api.post('/login', credentials);
            user.value = response.data;
            localStorage.setItem('token', response.token);
        } finally {
            loading.value = false;
        }
    };
    
    const logout = () => {
        user.value = null;
        localStorage.removeItem('token');
    };
    
    return {
        user: readonly(user),
        loading: readonly(loading),
        login,
        logout
    };
}`,
    buggyCode: `import { ref } from 'vue';

export function useAuth() {
    const user = ref(null); # Bug: Local state instead of shared module state
    
    return {
        user, # Bug: Directly exposing mutable ref
        login: (data) => { user = data; } # Bug: Missing .value
    };
}`,
    expectedOutput: 'Vue Composable Pattern',
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: 'Check state scope (module vs function) and reactivity rules.'
  },
  {
    languageTrack: LanguageTrack.VUE,
    difficulty: Difficulty.VERY_HARD,
    title: 'Advanced Filter Component',
    prompt: 'Implement the logic for a component that dynamically filters a large dataset using multiple computed properties and watcher synchronization.',
    participantCode: `<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps(['items']);
const filter = ref({ search: '', category: 'all', sort: 'name' });

const sortedItems = computed(() => {
    return [...props.items].sort((a, b) => {
        const key = filter.value.sort;
        return a[key].localeCompare(b[key]);
    });
});

const filteredResults = computed(() => {
    return sortedItems.value.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(
            filter.value.search.toLowerCase()
        );
        const matchesCat = filter.value.category === 'all' || 
                         item.category === filter.value.category;
        return matchesSearch && matchesCat;
    });
});

// Emit analytics on change
watch(filter, (newVal) => {
    emit('filter-changed', newVal);
}, { deep: true });
</script>`,
    correctCode: `<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps(['items']);
const filter = ref({ search: '', category: 'all', sort: 'name' });

const sortedItems = computed(() => {
    return [...props.items].sort((a, b) => {
        const key = filter.value.sort;
        return a[key].localeCompare(b[key]);
    });
});

const filteredResults = computed(() => {
    return sortedItems.value.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(
            filter.value.search.toLowerCase()
        );
        const matchesCat = filter.value.category === 'all' || 
                         item.category === filter.value.category;
        return matchesSearch && matchesCat;
    });
});

// Emit analytics on change
watch(filter, (newVal) => {
    emit('filter-changed', newVal);
}, { deep: true });
</script>`,
    buggyCode: `<script setup>
const sortedItems = computed(() => {
    # Bug: Directly mutating props.items
    return props.items.sort();
});

watch(filter, () => {
    # Bug: Missing deep: true for object observation
    emit('change');
});
</script>`,
    expectedOutput: 'Vue SFC Logic Block',
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: 'Verify deep observation rules and immutability when sorting.'
  },

  // --- JAVASCRIPT ---
  {
    languageTrack: LanguageTrack.JAVASCRIPT,
    difficulty: Difficulty.HARD,
    title: 'Async Multi-Source Loader',
    prompt: 'Implement a function that fetches data from three different endpoints in parallel and merges the results into a unified dashboard object.',
    participantCode: `async function loadDashboardData(userId) {
    const endpoints = [
        \`/api/profile/\${userId}\`,
        \`/api/stats/\${userId}\`,
        \`/api/notifications/\${userId}\`
    ];
    
    try {
        const responses = await Promise.all(
            endpoints.map(url => fetch(url).then(res => res.json()))
        );
        
        const [profile, stats, notifications] = responses;
        
        return {
            id: userId,
            summary: \`Welcome, \${profile.name}\`,
            activePoints: stats.total || 0,
            unreadCount: notifications.filter(n => !n.read).length,
            lastUpdated: new Date().getTime()
        };
    } catch (error) {
        console.error("Dashboard sync failed", error);
        throw new Error("UNABLE_TO_LOAD");
    }
}`,
    correctCode: `async function loadDashboardData(userId) {
    const endpoints = [
        \`/api/profile/\${userId}\`,
        \`/api/stats/\${userId}\`,
        \`/api/notifications/\${userId}\`
    ];
    
    try {
        const responses = await Promise.all(
            endpoints.map(url => fetch(url).then(res => res.json()))
        );
        
        const [profile, stats, notifications] = responses;
        
        return {
            id: userId,
            summary: \`Welcome, \${profile.name}\`,
            activePoints: stats.total || 0,
            unreadCount: notifications.filter(n => !n.read).length,
            lastUpdated: new Date().getTime()
        };
    } catch (error) {
        console.error("Dashboard sync failed", error);
        throw new Error("UNABLE_TO_LOAD");
    }
}`,
    buggyCode: `async function loadDashboardData(userId) {
    # Bug: Sequential loading instead of parallel
    const p = await fetch(\`/api/profile/\${userId}\`).json();
    const s = await fetch(\`/api/stats/\${userId}\`).json();
    
    # Bug: Missing try/catch and template literal syntax
    return {
        points: s.total
    };
}`,
    expectedOutput: 'Unified dashboard data object with aggregated notifications.',
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: 'Check concurrency methods and result destructuring.'
  },
  {
    languageTrack: LanguageTrack.JAVASCRIPT,
    difficulty: Difficulty.VERY_HARD,
    title: 'Custom Event Emitter Kernel',
    prompt: 'Implement a minimal Event Emitter class with on, off, and emit methods supporting multiple listeners per event.',
    participantCode: `class TinyEmitter {
    constructor() {
        this.events = {};
    }
    
    on(name, callback) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(callback);
    }
    
    off(name, callback) {
        if (!this.events[name]) return;
        this.events[name] = this.events[name].filter(
            fn => fn !== callback
        );
    }
    
    emit(name, ...args) {
        if (!this.events[name]) return;
        this.events[name].forEach(fn => {
            fn.apply(null, args);
        });
    }
}

const bus = new TinyEmitter();
export default bus;`,
    correctCode: `class TinyEmitter {
    constructor() {
        this.events = {};
    }
    
    on(name, callback) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(callback);
    }
    
    off(name, callback) {
        if (!this.events[name]) return;
        this.events[name] = this.events[name].filter(
            fn => fn !== callback
        );
    }
    
    emit(name, ...args) {
        if (!this.events[name]) return;
        this.events[name].forEach(fn => {
            fn.apply(null, args);
        });
    }
}

const bus = new TinyEmitter();
export default bus;`,
    buggyCode: `class TinyEmitter {
    # Bug: Using a single variable instead of an array/set for listeners
    on(name, cb) {
        this.events[name] = cb;
    }
    
    # Bug: Missing rest parameters for emit
    emit(name, args) {
        this.events[name](args);
    }
}`,
    expectedOutput: 'Exported Emitter Instance',
    validationRule: ValidationRule.NORMALIZED_EXACT_MATCH,
    genericHint: 'Check listener storage structure and argument propagation.'
  }
];
