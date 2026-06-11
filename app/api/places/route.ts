import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')
  if (!query || query.length < 3) return NextResponse.json([])

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1&extratags=1`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'LocalCompetitorTracker/1.0',
      'Accept-Language': 'sv,en',
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) return NextResponse.json([])

  const data = await res.json()

  const results = data
    .filter((item: any) => item.type !== 'administrative' && item.class !== 'boundary')
    .map((item: any) => ({
      name: item.namedetails?.name || item.display_name.split(',')[0],
      display: item.display_name,
      website: item.extratags?.website || item.extratags?.url || '',
      lat: item.lat,
      lon: item.lon,
    }))

  return NextResponse.json(results)
}
