import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Client } from '@/types/client';

interface RecentClientsProps {
  clients: Client[];
}

export default function RecentClients({ clients }: RecentClientsProps) {
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  // Get the three most recent clients
  const recentClients = [...clients]
    .sort((a, b) => {
      const dateA = new Date(a.joinedDate).getTime();
      const dateB = new Date(b.joinedDate).getTime();
      // Handle invalid dates by putting them at the end
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateB - dateA;
    })
    .slice(0, 3);

  const toggleExpand = (clientId: string) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  // Define background colors for each card
  const getCardBackground = (index: number) => {
    switch (index) {
      case 0: return "bg-[#E85E30]";
      case 1: return "bg-[#FEB852]";
      case 2: return "bg-[#A3A375]";
      default: return "bg-[#E85E30]";
    }
  };

  // Helper function to get the assignment date
  const getAssignmentDate = (guard: any, client: Client) => {
    // Try different possible date fields
    if (guard.assignedDate) return guard.assignedDate;
    if (guard.createdAt) return guard.createdAt;
    if (guard.dateAssigned) return guard.dateAssigned;
    
    // Try to get the earliest date from the guard's schedule
    if (guard.schedule && Array.isArray(guard.schedule)) {
      const scheduleDates = guard.schedule
        .map((s: any) => s.date)
        .filter((date: string) => date && !isNaN(new Date(date).getTime()))
        .sort();
      
      if (scheduleDates.length > 0) {
        return scheduleDates[0];
      }
    }
    
    // Fall back to client's creation date or joined date
    if (client.createdAt) return client.createdAt;
    if (client.joinedDate) return client.joinedDate;
    
    // If nothing else, return null to show "Date not set"
    return null;
  };

  return (
    <>
      <h2 className="text-xl font-bold text-white mb-4">RECENT CLIENTS</h2>
      <div className="space-y-3">
        {recentClients.map((client, index) => {
          const clientKey = client._id || `client-${client.name}-${index}`;
          return (
            <div key={clientKey} className={`border border-white/20 rounded-xl overflow-hidden ${getCardBackground(index)} transition-all duration-300 hover:opacity-90`}>
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpand(clientKey)}
              >
                <div>
                  <h3 className="font-semibold text-white text-lg">{client.name}</h3>
                  <p className="text-sm text-white/80">
                    Joined: {client.joinedDate && !isNaN(new Date(client.joinedDate).getTime()) ? 
                      new Date(client.joinedDate).toLocaleDateString() : 
                      'Date not set'
                    }
                  </p>
                </div>
                {expandedClient === clientKey ? 
                  <FiChevronUp className="text-white text-xl" /> : 
                  <FiChevronDown className="text-white text-xl" />
                }
              </div>
              
              {expandedClient === clientKey && (
                <div className="border-t border-white/20 p-4 bg-black/20">
                  <h4 className="font-semibold text-white mb-3 text-lg">Assigned Guards</h4>
                  {client.assignedGuards.length > 0 ? (
                    <div className="space-y-2">
                      {/* Show only the first guard */}
                      {client.assignedGuards.slice(0, 1).map((guard, guardIndex) => {
                        const guardKey = guard._id || guard.guardId || `guard-${clientKey}-${guardIndex}`;
                        const assignmentDate = getAssignmentDate(guard, client);
                        return (
                          <div key={guardKey} className="flex justify-between items-center text-sm bg-black/20 rounded-lg p-3 border border-white/20">
                            <span className="text-white font-medium">{guard.name}</span>
                            <span className="text-white/80">
                              {assignmentDate ? new Date(assignmentDate).toLocaleDateString() : 'Date not set'}
                            </span>
                          </div>
                        );
                      })}
                      {/* Show "view more guards" message if there are more than 1 guard */}
                      {client.assignedGuards.length > 1 && (
                        <div className="text-center text-sm bg-black/20 rounded-lg p-3 border border-white/20">
                          <span className="text-white/60 italic break-words">
                            view more at guards table
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-white/80 text-sm bg-black/20 rounded-lg p-3 border border-white/20">No guards assigned yet</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
} 