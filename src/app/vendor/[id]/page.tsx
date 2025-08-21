import vendors from '../../../data/vendors.json';
import Image from 'next/image';

export default function VendorPage({ params }: { params: { id: string } }) {
  const vendor = vendors.find((v) => v.id === params.id);
  if (!vendor) return <div className="p-6">Vendor not found.</div>;
  return (
    <div className="px-4 pt-6 space-y-6">
      <div className="relative h-40 w-full rounded-2xl overflow-hidden">
        <Image src={`https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&auto=format&fit=crop`} alt={vendor.name} fill className="object-cover" />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <p className="text-gray-600">{vendor.category} • {vendor.delivery_time}</p>
        </div>
        <div className="pill bg-yellow-100 text-yellow-900">★ {vendor.rating}</div>
      </div>

      <div className="space-y-3">
        {[1,2,3,4].map((i) => (
          <div key={i} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Menu Item {i}</div>
              <div className="text-gray-600 text-sm">Delicious and fresh</div>
            </div>
            <button className="btn-primary">Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}

