import orders from '../../data/orders.json';

export default function WalletPage() {
  const balance = 124.5;
  return (
    <div className="px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-gray-600">Manage your payments</p>
      </div>

      <div className="card p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-gray-600">Available Balance</span>
          <span className="pill bg-yellow-100 text-yellow-900">Test Mode</span>
        </div>
        <div className="mt-1 text-3xl font-bold">${balance.toFixed(2)}</div>
        <div className="mt-4 flex gap-3">
          <button className="btn-primary">Add Funds</button>
          <button className="btn-secondary">Withdraw</button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        {orders.map((o) => (
          <div key={o.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Order {o.id}</div>
              <div className="text-gray-600 text-sm">{o.items.length} items • {new Date(o.created_at).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">${o.total.toFixed(2)}</div>
              <div className="text-sm text-gray-500 capitalize">{o.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

