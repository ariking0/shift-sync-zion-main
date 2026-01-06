
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WeeklyRequest } from "@/types";
import { generateEmptyWeeklyRequest } from "@/lib/utils";

interface RequestsContextType {
  requests: WeeklyRequest[];
  getRequestByGuardId: (guardId: string) => WeeklyRequest | undefined;
  saveRequest: (request: WeeklyRequest) => void;
  createEmptyRequest: (guardId: string, guardName: string) => WeeklyRequest;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

// Example initial requests data
const initialRequests: WeeklyRequest[] = [
  // Empty array, will be populated as guards submit requests
];

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<WeeklyRequest[]>(() => {
    const storedRequests = localStorage.getItem("shiftRequests");
    return storedRequests ? JSON.parse(storedRequests) : initialRequests;
  });

  useEffect(() => {
    localStorage.setItem("shiftRequests", JSON.stringify(requests));
  }, [requests]);

  // Get a guard's request by their ID
  const getRequestByGuardId = (guardId: string) => {
    return requests.find(request => request.guardId === guardId);
  };

  // Save or update a request
  const saveRequest = (request: WeeklyRequest) => {
    setRequests(prevRequests => {
      const index = prevRequests.findIndex(r => r.guardId === request.guardId);
      
      if (index >= 0) {
        // Update existing request
        const updatedRequests = [...prevRequests];
        updatedRequests[index] = request;
        return updatedRequests;
      } else {
        // Add new request
        return [...prevRequests, request];
      }
    });
  };

  // Create an empty request for a guard
  const createEmptyRequest = (guardId: string, guardName: string) => {
    return generateEmptyWeeklyRequest(guardId, guardName);
  };

  const value = {
    requests,
    getRequestByGuardId,
    saveRequest,
    createEmptyRequest
  };

  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
}

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
};
