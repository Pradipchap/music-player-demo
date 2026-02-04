import { ITrack } from "@/audio/audio.types";
import { BASE_URL } from "@/constants/endpoints";
import { ITrackResponse, STATUS } from "@/types";
import { useEffect, useState } from "react";

export const useGetTracks = () => {
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [tracks, setTracks] = useState<ITrack[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      setStatus(STATUS.PENDING);
      try {
        const response = await fetch(`${BASE_URL}/tracks`);
        if (!response.ok) {
          throw "Something went wrong";
        }
        const data: ITrackResponse = await response.json();
        setTracks(data.tracks);
        setStatus(STATUS.SUCCESS);
      } catch (error) {
        console.log("error is", error);
        setStatus(STATUS.ERROR);
      } finally {
        setTimeout(() => {
          setStatus(STATUS.IDLE);
        }, 2000);
      }
    };

    fetchTracks();
  }, []);

  return { status, tracks };
};
