export default function CartPage() {
  const items = [
    { id: '1', name: 'Jollof Rice', qty: 2, price: 6.5 },
    { id: '2', name: 'Plantain', qty: 1, price: 2.0 },
  ];
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  return (
    <div className="px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cart</h1>
        <p className="text-gray-600">Review your order</p>
      </div>
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-gray-600 text-sm">Qty {i.qty} × ${i.price.toFixed(2)}</div>
            </div>
            <div className="font-semibold">${(i.qty * i.price).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
        <button className="w-full btn-primary">Checkout (Test)</button>
      </div>
    </div>
  );
}

