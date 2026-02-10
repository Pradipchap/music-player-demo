import { audioManager } from "@/audio/audioManager";
import { pinkFloydTracks } from "@/services/audioLibrary";
import { useEffect, useRef, useState } from "react";

export const usePreLoadAllTracks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let isMounted = true;

    async function loadAll() {
      try {
        setIsLoading(true);

        const results = await Promise.allSettled(
          pinkFloydTracks.slice(0, 1).map(async item => {
            await audioManager.preloadAudio({
              id: item.id,
              audioUrl: item.url
            });

            if (isMounted) {
              setLoadedCount(c => c + 1);
            }
          })
        );

        const failed = results.filter(r => r.status === "rejected");
        if (failed.length) {
          console.warn("Some tracks failed to preload:", failed);
        }
      } catch (err) {
        console.error("Error while preloading tracks", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAll();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isLoading,
    loadedCount,
    total: pinkFloydTracks.length,
    progress: pinkFloydTracks.length ? loadedCount / pinkFloydTracks.length : 0
  };
};
