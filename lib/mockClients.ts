import { Client } from "@/types/client";

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Walmart",
    email: "ops@walmart.com",
    joinedDate: "2025-06-01",
    status: "Active",
    guardType: "Armed",
    numberOfGuards: 3,
    progress: 65,
  },
  {
    id: "2",
    name: "BestBuy",
    email: "security@bestbuy.com",
    joinedDate: "2025-05-20",
    status: "Standby",
    guardType: "Unarmed",
    numberOfGuards: 2,
    progress: 0,
  },
];
