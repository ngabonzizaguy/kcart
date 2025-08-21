import Image from 'next/image';

const collections = [
  {
    id: 'c1',
    title: 'Trending Dishes',
    image: 'https://images.unsplash.com/photo-1604908812010-3182ee3370fa?w=800&auto=format&fit=crop'
  },
  {
    id: 'c2',
    title: 'Groceries Near You',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&auto=format&fit=crop'
  },
  {
    id: 'c3',
    title: 'Healthy Picks',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop'
  }
];

export default function ExplorePage() {
  return (
    <div className="px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="text-gray-600">Collections curated for you</p>
      </div>

      <div className="grid gap-4">
        {collections.map((c) => (
          <div key={c.id} className="card overflow-hidden">
            <div className="relative h-40 w-full">
              <Image src={c.image} alt={c.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{c.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

