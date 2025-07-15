interface Activity {
  id: string;
  action: string;
  time: string;
  timestamp: number;
  icon: string;
}

class ActivityTracker {
  private activities: Activity[] = [];
  private listeners: ((activities: Activity[]) => void)[] = [];
  private maxActivities = 5;

  addActivity(action: string, iconType: string = 'user') {
    const activity: Activity = {
      id: Date.now().toString(),
      action,
      time: this.getTimeAgo(Date.now()),
      timestamp: Date.now(),
      icon: iconType
    };

    console.log("Adding activity:", activity);
    this.activities.unshift(activity);
    if (this.activities.length > this.maxActivities) {
      this.activities = this.activities.slice(0, this.maxActivities);
    }

    console.log("Current activities:", this.activities);
    this.notifyListeners();
    this.updateTimestamps();
  }

  private getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  private updateTimestamps() {
    this.activities = this.activities.map(activity => ({
      ...activity,
      time: this.getTimeAgo(activity.timestamp)
    }));
  }

  subscribe(listener: (activities: Activity[]) => void) {
    this.listeners.push(listener);
    
    // Start updating timestamps every minute
    const intervalId = setInterval(() => {
      this.updateTimestamps();
      this.notifyListeners();
    }, 60000);

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
      if (this.listeners.length === 0) {
        clearInterval(intervalId);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.activities]));
  }

  getActivities(): Activity[] {
    this.updateTimestamps();
    return [...this.activities];
  }

  // Initialize with some sample activities
  init() {
    if (this.activities.length === 0) {
      this.addActivity("Assigned g4 to dev2", 'user');
      // Simulate these happening at different times
      setTimeout(() => this.addActivity("Deleted client cap@gmail", 'user'), 100);
      setTimeout(() => this.addActivity("Added new client Tarun Sai Bro", 'user'), 200);
    }
  }
}

export const activityTracker = new ActivityTracker();

// Helper functions to track activities from existing components
export const trackClientAdded = (clientName: string) => {
  activityTracker.addActivity(`Added new client ${clientName}`, 'user');
};

export const trackClientDeleted = (clientEmail: string) => {
  activityTracker.addActivity(`Deleted client ${clientEmail}`, 'user');
};

export const trackClientEdited = (clientName: string) => {
  activityTracker.addActivity(`Updated client ${clientName}`, 'user');
};

export const trackGuardAssigned = (guardName: string, clientName: string) => {
  activityTracker.addActivity(`Assigned ${guardName} to ${clientName}`, 'user');
};

export const trackGuardAdded = (guardName: string) => {
  activityTracker.addActivity(`Added new guard ${guardName}`, 'user');
};

export const trackGuardDeleted = (guardName: string) => {
  activityTracker.addActivity(`Deleted guard ${guardName}`, 'user');
}; 