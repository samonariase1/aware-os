export interface QueueItem {
  id: string;
  text: string;
  timestamp: number;
}

const QUEUE_KEY = 'awareos-offline-queue';

export const getQueue = (): QueueItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(QUEUE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveToQueue = (text: string) => {
  const queue = getQueue();
  const newItem: QueueItem = {
    id: crypto.randomUUID(), // Generates a unique ID
    text,
    timestamp: Date.now(),
  };
  queue.push(newItem);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const removeFromQueue = (id: string) => {
  const queue = getQueue();
  const updated = queue.filter((item) => item.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
};

export const clearQueue = () => {
  localStorage.removeItem(QUEUE_KEY);
};