// Mock fleet data for the fleet tracking page

export type VehicleStatus = "on_trip" | "available" | "on_maintenance" | "in_shop";

export type DriverStatus = "available" | "on_trip" | "off_duty" | "suspended";

export interface FleetVehicle {
  id: string;
  registrationNumber: string;
  name: string;
  type: string;
  status: VehicleStatus;
  odometer: number;
  maxLoadCapacity: number;
  capacity: number;
  driver: {
    id: string;
    name: string;
    phone: string;
    email: string;
    licenseNumber: string;
    licenseCategory: string;
    licenseExpiryDate: string;
    safetyScore: number;
    status: DriverStatus;
    experience: number;
  } | null;
  activeTrip: {
    id: string;
    source: string;
    destination: string;
    cargoWeight: number;
    plannedDistance: number;
    status: "dispatched" | "draft" | "completed" | "cancelled";
  } | null;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export const MOCK_FLEET: FleetVehicle[] = [
  {
    id: "v-001",
    registrationNumber: "KL-01-AB-1234",
    name: "Volvo FH16",
    type: "Heavy Truck",
    status: "on_trip",
    odometer: 142500,
    maxLoadCapacity: 25000,
    capacity: 40,
    driver: {
      id: "d-001",
      name: "Rahul Menon",
      phone: "+91 9876543210",
      email: "rahul.menon@fleet.com",
      licenseNumber: "KL-01-20140012345",
      licenseCategory: "HMV",
      licenseExpiryDate: "2027-08-15",
      safetyScore: 94,
      status: "on_trip",
      experience: 12,
    },
    activeTrip: {
      id: "t-001",
      source: "Kochi, Kerala",
      destination: "Bengaluru, Karnataka",
      cargoWeight: 18000,
      plannedDistance: 580,
      status: "dispatched",
    },
    location: {
      lat: 10.8505,
      lng: 76.2711,
      address: "NH-544, Thrissur, Kerala",
    },
  },
  {
    id: "v-002",
    registrationNumber: "KL-07-CD-5678",
    name: "Tata Prima 4928.S",
    type: "Heavy Truck",
    status: "on_trip",
    odometer: 89300,
    maxLoadCapacity: 28000,
    capacity: 45,
    driver: {
      id: "d-002",
      name: "Suresh Kumar",
      phone: "+91 9876543211",
      email: "suresh.kumar@fleet.com",
      licenseNumber: "KL-07-20160023456",
      licenseCategory: "HMV",
      licenseExpiryDate: "2026-11-20",
      safetyScore: 88,
      status: "on_trip",
      experience: 8,
    },
    activeTrip: {
      id: "t-002",
      source: "Kozhikode, Kerala",
      destination: "Chennai, Tamil Nadu",
      cargoWeight: 22000,
      plannedDistance: 740,
      status: "dispatched",
    },
    location: {
      lat: 11.2588,
      lng: 75.7804,
      address: "NH-66, Kozhikode Bypass",
    },
  },
  {
    id: "v-003",
    registrationNumber: "KL-14-EF-9012",
    name: "Ashok Leyland 2518",
    type: "Medium Truck",
    status: "available",
    odometer: 54200,
    maxLoadCapacity: 15000,
    capacity: 25,
    driver: {
      id: "d-003",
      name: "Biju Thomas",
      phone: "+91 9876543212",
      email: "biju.thomas@fleet.com",
      licenseNumber: "KL-14-20180034567",
      licenseCategory: "LMV-TR",
      licenseExpiryDate: "2028-03-10",
      safetyScore: 97,
      status: "available",
      experience: 6,
    },
    activeTrip: null,
    location: {
      lat: 9.9312,
      lng: 76.2673,
      address: "Fleet Depot, Ernakulam, Kerala",
    },
  },
  {
    id: "v-004",
    registrationNumber: "KL-02-GH-3456",
    name: "Mahindra Blazo X 28",
    type: "Light Truck",
    status: "on_trip",
    odometer: 31700,
    maxLoadCapacity: 12000,
    capacity: 20,
    driver: {
      id: "d-004",
      name: "Ajith Nair",
      phone: "+91 9876543213",
      email: "ajith.nair@fleet.com",
      licenseNumber: "KL-02-20200045678",
      licenseCategory: "LMV-TR",
      licenseExpiryDate: "2025-09-05",
      safetyScore: 82,
      status: "on_trip",
      experience: 4,
    },
    activeTrip: {
      id: "t-003",
      source: "Thiruvananthapuram, Kerala",
      destination: "Madurai, Tamil Nadu",
      cargoWeight: 9500,
      plannedDistance: 310,
      status: "dispatched",
    },
    location: {
      lat: 8.7139,
      lng: 77.7567,
      address: "NH-44, Nagercoil, Tamil Nadu",
    },
  },
  {
    id: "v-005",
    registrationNumber: "KL-09-IJ-7890",
    name: "BharatBenz 1617",
    type: "Medium Truck",
    status: "on_maintenance",
    odometer: 118900,
    maxLoadCapacity: 16000,
    capacity: 28,
    driver: null,
    activeTrip: null,
    location: {
      lat: 10.5276,
      lng: 76.2144,
      address: "Service Center, Palakkad, Kerala",
    },
  },
  {
    id: "v-006",
    registrationNumber: "KL-11-KL-2345",
    name: "Eicher Pro 6028",
    type: "Light Truck",
    status: "available",
    odometer: 22100,
    maxLoadCapacity: 9000,
    capacity: 15,
    driver: {
      id: "d-005",
      name: "Vineeth Pillai",
      phone: "+91 9876543214",
      email: "vineeth.pillai@fleet.com",
      licenseNumber: "KL-11-20220056789",
      licenseCategory: "LMV-TR",
      licenseExpiryDate: "2029-01-25",
      safetyScore: 100,
      status: "available",
      experience: 2,
    },
    activeTrip: null,
    location: {
      lat: 10.0159,
      lng: 76.3419,
      address: "Fleet Depot, Alappuzha, Kerala",
    },
  },
  {
    id: "v-007",
    registrationNumber: "KL-03-MN-6789",
    name: "Volvo FM 440",
    type: "Heavy Truck",
    status: "in_shop",
    odometer: 203400,
    maxLoadCapacity: 30000,
    capacity: 48,
    driver: null,
    activeTrip: null,
    location: {
      lat: 9.5916,
      lng: 76.5222,
      address: "Repair Workshop, Kottayam, Kerala",
    },
  },
];

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  on_trip: "On Trip",
  available: "Available",
  on_maintenance: "Maintenance",
  in_shop: "In Shop",
};

export const STATUS_COLORS: Record<VehicleStatus, string> = {
  on_trip: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  available: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  on_maintenance: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  in_shop: "bg-red-500/10 text-red-600 border-red-500/20",
};

export const MARKER_COLORS: Record<VehicleStatus, string> = {
  on_trip: "#3b82f6",
  available: "#10b981",
  on_maintenance: "#f59e0b",
  in_shop: "#ef4444",
};
