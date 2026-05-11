export type RequestedRideVehicleType = "car" | "motorcycle";

export interface RequestedRideRecord {
  requestId: number;
  externalRideId: number;
  from: string;
  to: string;
  date: string;
  time: string;
  vehicleType: RequestedRideVehicleType;
  totalSeats: number;
  availableSeats: number[];
  price: number;
  notes?: string;
  requestedAt: string;
}

const REQUESTED_RIDES_STORAGE_KEY = "ugo-requested-rides";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getRequestedRides(): RequestedRideRecord[] {
  if (!isBrowser()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(REQUESTED_RIDES_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? (parsedValue as RequestedRideRecord[]) : [];
  } catch {
    window.localStorage.removeItem(REQUESTED_RIDES_STORAGE_KEY);
    return [];
  }
}

export function saveRequestedRide(
  ride: Omit<RequestedRideRecord, "requestId" | "requestedAt">,
) {
  if (!isBrowser()) {
    return { created: false, ride: null as RequestedRideRecord | null };
  }

  const currentRides = getRequestedRides();
  const existingRide = currentRides.find(
    (currentRide) => currentRide.externalRideId === ride.externalRideId,
  );

  if (existingRide) {
    return { created: false, ride: existingRide };
  }

  const nextRide: RequestedRideRecord = {
    ...ride,
    requestId: Date.now(),
    requestedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    REQUESTED_RIDES_STORAGE_KEY,
    JSON.stringify([nextRide, ...currentRides]),
  );

  return { created: true, ride: nextRide };
}