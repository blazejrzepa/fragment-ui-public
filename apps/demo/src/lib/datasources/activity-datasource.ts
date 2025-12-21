/**
 * Activity Feed Data Source
 * 
 * Generates realistic activity feed data
 */

export interface ActivityItem {
  id: string;
  type: "action" | "update" | "create" | "delete" | "comment";
  title: string;
  timestamp: Date;
  user: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

export interface ActivityData {
  items: ActivityItem[];
  total: number;
}

/**
 * Generate realistic activity feed data
 */
export function generateActivityData(count: number = 10): ActivityData {
  const types: Array<"action" | "update" | "create" | "delete" | "comment"> = [
    "action", "update", "create", "delete", "comment"
  ];
  
  const users = [
    "John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown",
    "Diana Prince", "Eve Adams", "Frank Miller", "Grace Lee", "Henry Davis",
  ];
  
  const actions = [
    "created a new project",
    "updated settings",
    "commented on a ticket",
    "deleted a file",
    "assigned a task",
    "completed a review",
    "started a new session",
    "uploaded a document",
    "shared a link",
    "updated profile",
  ];
  
  const items: ActivityItem[] = Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const user = users[i % users.length];
    const action = actions[i % actions.length];
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    return {
      id: `activity-${i + 1}`,
      type,
      title: `${user} ${action}`,
      timestamp,
      user: {
        name: user,
      },
    };
  });
  
  // Sort by timestamp (newest first)
  items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return {
    items,
    total: items.length,
  };
}

/**
 * Mock API function for activity data
 * In production, this would fetch from a real API
 */
export async function fetchActivityData(maxItems: number = 10): Promise<ActivityData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return generateActivityData(maxItems);
}

