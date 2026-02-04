import { ITrack } from "@/audio/audio.types";

export enum REPEAT_MODE {
  TRACK_LOOP = "single-loop",
  QUEUE_LOOP = "queue-loop",
  OFF = "off"
}

export enum STATUS {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error"
}

export interface ITrackResponse {
  count: number;
  tracks: ITrack[];
}
