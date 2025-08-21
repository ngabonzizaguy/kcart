export default function ProfilePage() {
  return (
    <div className="px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">Account settings & preferences</p>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Test User</div>
            <div className="text-gray-600 text-sm">test@example.com</div>
          </div>
          <button className="btn-secondary">Edit</button>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span>Notifications</span>
          <span className="pill">Enabled</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Address</span>
          <span className="text-gray-600 text-sm">Add</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Payment Methods</span>
          <span className="text-gray-600 text-sm">Stripe • MoMo (test)</span>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <button className="w-full btn-primary">Switch to Live (requires creds)</button>
      </div>
    </div>
  );
}

