import Image from 'next/image';
import Link from 'next/link';
import vendors from '../data/vendors.json';

export default function HomePage() {
  return (
    <div className="px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Discover</h1>
        <p className="text-gray-600">Food and groceries from top vendors</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['All', 'Food', 'Grocery', 'Pharmacy', 'Deals'].map((f) => (
          <button key={f} className="pill whitespace-nowrap">{f}</button>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-4">
        {vendors.map((v) => (
          <Link href={`/vendor/${v.id}`} key={v.id} className="card flex gap-4 p-4">
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
              <Image src={`https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&auto=format&fit=crop`} alt={v.name} fill sizes="96px" className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{v.name}</h3>
              <p className="text-gray-600 text-sm">{v.category} • {v.delivery_time}</p>
              <p className="text-gray-500 text-sm">{v.location}</p>
            </div>
            <div className="self-start text-sm bg-yellow-100 text-yellow-900 px-2 py-1 rounded-lg">★ {v.rating}</div>
          </Link>
        ))}
      </section>

      <Link href="/cart" className="fixed right-6 bottom-24 btn-primary shadow-soft">Cart</Link>
    </div>
  );
}

