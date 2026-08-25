import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function ProviderLocations() {
  const providers = [
    {
      id: 1,
      name: "Bamenda Regional Hospital",
      position: [5.9631, 10.1591],
      address: "Commercial Avenue, Bamenda",
    },
    {
      id: 2,
      name: "Mile 2 Health Center",
      position: [5.9615, 10.1515],
      address: "Mile 2, Bamenda",
    },
    {
      id: 3,
      name: "Pharmacy de la Paix",
      position: [5.9585, 10.1625],
      address: "Nkwen Street, Bamenda",
    },
  ];

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Provider Locations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Find providers offering this medication or service.
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-emerald-600 hover:underline"
        >
          Open Full Map
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <MapContainer
          center={[5.9631, 10.1591]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-96 w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {providers.map((provider) => (
            <Marker
              key={provider.id}
              position={provider.position}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold">
                    {provider.name}
                  </h3>

                  <p className="mt-1 text-sm">
                    {provider.address}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default ProviderLocations;