export interface TaskQueueKpiVisual {
  delta: string;
  trend: 'up' | 'down';
  sparkline: number[];
  isMock: true;
}

export interface TaskQueueRowMockMeta {
  offers: number;
  views: number;
  location: string;
  fallbackCategory: string;
  isMock: true;
}

const LOCATION_POOL = ['Baghdad, Iraq', 'Erbil, Iraq', 'Najaf, Iraq', 'Basra, Iraq', 'Remote'];
const CATEGORY_POOL = ['Web Development', 'Design', 'Backend', 'Data', 'Mobile'];

function hashString(value: string): number {
  return value.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
}

export function getTaskQueueRowMockMeta(taskId: string): TaskQueueRowMockMeta {
  const hash = hashString(taskId);
  return {
    offers: (hash % 5) + 1,
    views: 30 + (hash % 190),
    location: LOCATION_POOL[hash % LOCATION_POOL.length],
    fallbackCategory: CATEGORY_POOL[hash % CATEGORY_POOL.length],
    isMock: true,
  };
}

export const TASK_QUEUE_KPI_VISUAL: Record<'total' | 'open' | 'inProgress' | 'budget', TaskQueueKpiVisual> = {
  total: { delta: '+18%', trend: 'up', sparkline: [28, 30, 32, 31, 35, 36], isMock: true },
  open: { delta: '+3', trend: 'down', sparkline: [24, 26, 23, 28, 25, 27], isMock: true },
  inProgress: { delta: '+2', trend: 'up', sparkline: [15, 18, 17, 20, 18, 19], isMock: true },
  budget: { delta: '+24%', trend: 'up', sparkline: [48, 52, 50, 56, 54, 58], isMock: true },
};

export const TASK_QUEUE_HERO_SERIES = {
  posted: [34, 41, 38, 46, 44, 48, 42],
  completed: [22, 24, 21, 27, 23, 28, 26],
} as const;
