export interface Client {
    _id: string;
    name: string;
    email: string;
    joinedDate: string;
    status: "Active" | "Standby" | "Issue Reported";
    guardType: string;
    numberOfGuards: number;
    progress: number; // in %
    selectedGuards?: string[];
    assignedGuards: {
      _id?: string;
      guardId?: string;
      name: string;
      email?: string;
      type?: string;
      days?: number;
      schedule?: any[];
      assignedDate?: string;
    }[];
    startDate?: string;  // Add this line
    endDate?: string;
  }
  