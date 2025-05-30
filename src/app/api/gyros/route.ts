import { NextRequest, NextResponse } from 'next/server';

// Define the response type
export type Place = {
  id: string;
  name: string;
  address: string;
  distanceM: number;
};

// Define the Foursquare API response type
type FoursquareResult = {
  fsq_id: string;
  name: string;
  location: {
    formatted_address: string;
  };
  distance: number;
};

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lon = req.nextUrl.searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat & lon required' }, { status: 400 });
  }

  const qs = new URLSearchParams({
    ll: `${lat},${lon}`,
    query: 'gyros',
    radius: '1609',          // 1 mile in metres
    sort: 'DISTANCE',
    limit: '3'
  });

  const fsq = await fetch(
    `https://api.foursquare.com/v3/places/search?${qs}`,
    {
      headers: {
        Authorization: process.env.FSQ_API_KEY ?? '',
        Accept: 'application/json'
      },
      // cache result for 1 min to spare your quota
      next: { revalidate: 60 }
    }
  );

  if (!fsq.ok) {
    const body = await fsq.text();
    return NextResponse.json({ error: body }, { status: fsq.status });
  }

  const { results } = await fsq.json();

  const trimmed: Place[] = (results as FoursquareResult[])
    .filter(p => p.distance <= 3218)           // defensive cutoff
    .map(p => ({
      id:           p.fsq_id,
      name:         p.name,
      address:      p.location.formatted_address,
      distanceM:    p.distance
    }));

  return NextResponse.json(trimmed);
}
