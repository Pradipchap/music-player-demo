import { ITrack } from "@/audio/audio.types";
import { REPEAT_MODE } from "@/types";
import { create } from "zustand";

interface QueueState {
  queue: ITrack[];
  index: number;
  setQueue: (tracks: ITrack[], startIndex?: number) => void;
  next: () => ITrack | null;
  prev: () => ITrack | null;
  insertNext: (track: ITrack) => void;
  insertLast: (track: ITrack) => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  index: 0,
  repeatMode: REPEAT_MODE.OFF,

  setQueue: (tracks, startIndex = 0) =>
    set({
      queue: tracks,
      index: Math.max(0, Math.min(startIndex, tracks.length - 1))
    }),

  next: (): ITrack | null => {
    const { index, queue } = get();

    if (!queue.length) return null;
    let nextIndex = index;

    if (index + 1 < queue.length) {
      nextIndex = index + 1;
    } else {
      nextIndex = 0;
    }
    set({ index: nextIndex });
    return queue[nextIndex] ?? null;
  },

  prev: (): ITrack | null => {
    const { index, queue } = get();
    const prevIndex = index > 0 ? index - 1 : index;

    set({ index: prevIndex });
    return queue[prevIndex] ?? null;
  },

  insertNext: track => {
    const { queue } = get();

    const existingIndex = findTrackIndex(queue, track);

    if (existingIndex !== -1) {
      set(state => {
        const newQueue = [...state.queue];
        newQueue.splice(existingIndex, 1);
        const adjustedCurrentIndex = existingIndex < state.index ? state.index - 1 : state.index;
        const insertIndex = adjustedCurrentIndex + 1;
        newQueue.splice(insertIndex, 0, track);
        const newIndex = state.index >= newQueue.length ? newQueue.length - 1 : state.index;

        return {
          queue: newQueue,
          index: newIndex
        };
      });
    } else {
      set(state => {
        const newQueue = [...state.queue];
        const insertIndex = state.index + 1;
        newQueue.splice(insertIndex, 0, track);

        return { queue: newQueue };
      });
    }
  },

  insertLast: track => {
    const { queue } = get();
    const existingIndex = findTrackIndex(queue, track);

    if (existingIndex !== -1) {
      set(state => {
        const newQueue = [...state.queue];

        newQueue.splice(existingIndex, 1);
        newQueue.push(track);
        let newIndex = state.index;
        if (existingIndex < state.index) {
          newIndex = state.index - 1;
        } else if (existingIndex === state.index && state.index >= newQueue.length) {
          newIndex = newQueue.length - 1;
        }

        return {
          queue: newQueue,
          index: newIndex
        };
      });
    } else {
      set(state => ({
        queue: [...state.queue, track]
      }));
    }
  }
}));

export const useQueueNext = () => useQueueStore(state => state.next);
export const useQueuePrev = () => useQueueStore(state => state.prev);
export const useInsertNext = () => useQueueStore(state => state.insertNext);
export const useInsertLast = () => useQueueStore(state => state.insertNext);

export const useGetCurrentQueue = () => useQueueStore(state => state.queue);
export const useSetQueue = () => useQueueStore(state => state.setQueue);
export const useGetCurrentQueueTrack = () => useQueueStore(state => state.queue[state.index]);
export const useGetNextQueueTrack = () =>
  useQueueStore(state => {
    if (state.index + 1 >= state.queue.length) {
      return state.queue[0];
    } else {
      return state.queue[state.index + 1];
    }
  });
const findTrackIndex = (queue: ITrack[], track: ITrack): number => {
  return queue.findIndex(t => t.id === track.id);
};
