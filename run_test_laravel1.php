<?php
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

echo "COMPLETED REVENUE: $" . number_format($completedSum, 2) . "\n";
echo "HIGH VALUE ORDER IDs: " . implode(", ", $ids) . "\n";
