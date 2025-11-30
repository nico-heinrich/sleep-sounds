import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from "expo-audio";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { sets } from "../data/sets";

interface SoundContextType {
  currentSoundId: string | null;
  isPlaying: boolean;
  isFadingOut: boolean;
  playSound: (soundId: string) => Promise<void>;
  pauseSound: () => void;
  togglePlay: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const fadeInDuration = 2000;
  const fadeOutDuration = 1000;
  const crossfadeDuration = 2000;

  const [currentSoundId, setCurrentSoundId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const soundRef = useRef<AudioPlayer | null>(null);
  const nextSoundRef = useRef<AudioPlayer | null>(null);
  const durationRef = useRef<number | null>(null);
  const currentSoundIdRef = useRef<string | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isCrossfadingRef = useRef<boolean>(false);
  const activeFadeIntervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const positionCheckIntervalsRef = useRef<Map<AudioPlayer, NodeJS.Timeout>>(
    new Map(),
  );
  const preloadedSoundsRef = useRef<Map<string, AudioPlayer>>(new Map());

  // Keep refs in sync with state
  useEffect(() => {
    currentSoundIdRef.current = currentSoundId;
  }, [currentSoundId]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize audio mode once for optimal playback
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionModeAndroid: "duckOthers",
      interruptionMode: "mixWithOthers",
      allowsRecording: false,
    }).catch((error) => {
      console.error("Error setting audio mode:", error);
    });
  }, []);

  // Preload all sounds on app start
  useEffect(() => {
    const preloadSounds = async () => {
      const preloadPromises = sets.map(async (soundData) => {
        try {
          const player = createAudioPlayer(soundData.audio, {
            updateInterval: 16,
          });

          // Wait for sound to load
          return new Promise<void>((resolve, reject) => {
            const checkLoaded = setInterval(() => {
              if (player.isLoaded && player.duration > 0) {
                clearInterval(checkLoaded);
                clearTimeout(timeoutId);
                // Store preloaded player - pause it so it doesn't play
                player.volume = 0.0;
                try {
                  player.pause();
                } catch (error) {
                  // Ignore pause errors
                }
                preloadedSoundsRef.current.set(soundData.id, player);
                resolve();
              }
            }, 50);

            const timeoutId = setTimeout(() => {
              clearInterval(checkLoaded);
              if (!player.isLoaded) {
                console.warn(
                  `Failed to preload sound "${soundData.id}" within timeout (10s). It will be loaded on-demand.`,
                );
                try {
                  player.remove();
                } catch (error) {
                  // Ignore errors
                }
                reject(new Error(`Preload timeout for ${soundData.id}`));
              }
            }, 10000);

            // Start loading by calling play (but volume is 0 so it's silent)
            try {
              player.play();
            } catch (error) {
              clearInterval(checkLoaded);
              clearTimeout(timeoutId);
              reject(error);
            }
          });
        } catch (error) {
          console.error(`Error preloading sound "${soundData.id}":`, error);
        }
      });

      await Promise.allSettled(preloadPromises);
      console.log(
        `Preloaded ${preloadedSoundsRef.current.size} of ${sets.length} sounds`,
      );
    };

    preloadSounds();
  }, []);

  const cancelAllFadeIntervals = () => {
    activeFadeIntervalsRef.current.forEach((interval) => {
      clearInterval(interval);
    });
    activeFadeIntervalsRef.current.clear();
  };

  const fadeSound = async (
    player: AudioPlayer,
    fromVolume: number,
    toVolume: number,
    duration: number,
  ): Promise<void> => {
    return new Promise((resolve) => {
      const steps = 60;
      const stepDuration = duration / steps;
      const volumeStep = (toVolume - fromVolume) / steps;
      let currentStep = 0;
      let isResolved = false;

      const interval = setInterval(() => {
        try {
          // Check if player is still valid and loaded
          if (!player.isLoaded || isResolved) {
            if (!isResolved) {
              isResolved = true;
              activeFadeIntervalsRef.current.delete(interval);
              clearInterval(interval);
              resolve();
            }
            return;
          }

          currentStep++;
          const volume = Math.max(
            0,
            Math.min(1.0, fromVolume + volumeStep * currentStep),
          );

          // Set volume directly (synchronous in expo-audio)
          player.volume = volume;

          if (currentStep >= steps) {
            if (!isResolved) {
              isResolved = true;
              activeFadeIntervalsRef.current.delete(interval);
              clearInterval(interval);
              resolve();
            }
          }
        } catch (error: any) {
          // Ignore errors (player might be removed)
          if (!isResolved) {
            isResolved = true;
            activeFadeIntervalsRef.current.delete(interval);
            clearInterval(interval);
            resolve();
          }
        }
      }, stepDuration);

      activeFadeIntervalsRef.current.add(interval);
    });
  };

  const setupSeamlessLoop = (
    currentSound: AudioPlayer,
    soundData: any,
    soundId: string,
  ) => {
    if (!durationRef.current) return;

    const duration = durationRef.current;
    const crossfadeStartTime = duration - crossfadeDuration * 1.5; // Start crossfade before end

    // Remove any existing interval for this player
    const existingInterval =
      positionCheckIntervalsRef.current.get(currentSound);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Use interval to check position frequently
    const positionCheckInterval = setInterval(() => {
      // Check if we should continue monitoring
      if (
        !currentSound.isLoaded ||
        !isPlayingRef.current ||
        currentSoundIdRef.current !== soundId ||
        isCrossfadingRef.current ||
        soundRef.current !== currentSound
      ) {
        clearInterval(positionCheckInterval);
        positionCheckIntervalsRef.current.delete(currentSound);
        return;
      }

      const currentTime = currentSound.currentTime ?? 0;
      const position = currentTime * 1000; // Convert seconds to milliseconds

      // Track previous position to detect if playback stopped
      const prevPosition = (currentSound as any)._prevPosition ?? 0;
      (currentSound as any)._prevPosition = position;

      // If position isn't advancing and we're supposed to be playing, restart
      // But only if we're not crossfading and position has been stable for a bit
      if (
        position === prevPosition &&
        position > 100 &&
        isPlayingRef.current &&
        !isCrossfadingRef.current &&
        !nextSoundRef.current
      ) {
        try {
          currentSound.play();
        } catch (error) {
          // Ignore errors
        }
      }

      // When we reach the crossfade start point, create and start next instance
      if (
        position >= crossfadeStartTime &&
        position < duration - 50 && // Make sure we're not past the end
        !nextSoundRef.current
      ) {
        clearInterval(positionCheckInterval);
        positionCheckIntervalsRef.current.delete(currentSound);
        try {
          // Create next sound instance with volume 0 (silent)
          const nextSound = createAudioPlayer(soundData.audio, {
            updateInterval: 16, // High frequency updates for smooth crossfade
          });

          // Wait for sound to load before starting
          let nextSoundLoaded = false;
          const waitForLoad = setInterval(() => {
            if (nextSound.isLoaded) {
              nextSoundLoaded = true;
              clearInterval(waitForLoad);
              nextSound.volume = 0.0;
              nextSound.play();
              // Ensure it's actually playing
              const status = nextSound.currentStatus;
              if (status?.isLoaded && !status?.playing) {
                nextSound.play();
              }
              nextSoundRef.current = nextSound;

              // Start crossfade
              crossfadeSounds(currentSound, nextSound, soundData, soundId);
            }
          }, 50);

          setTimeout(() => {
            clearInterval(waitForLoad);
            if (!nextSoundLoaded && !nextSound.isLoaded) {
              console.error(
                `Next sound for crossfade failed to load within timeout (2s). Sound ID: ${soundId}`,
              );
              try {
                nextSound.remove();
              } catch (error) {
                // Ignore errors if already removed
              }
              // Clean up reference if this was the next sound
              if (nextSoundRef.current === nextSound) {
                nextSoundRef.current = null;
              }
            }
          }, 2000);
        } catch (error) {
          console.error("Error setting up next loop:", error);
        }
      }

      // Also check if sound finished (fallback)
      if (
        currentSound.duration > 0 &&
        currentTime >= currentSound.duration - 0.05 &&
        !nextSoundRef.current
      ) {
        clearInterval(positionCheckInterval);
        positionCheckIntervalsRef.current.delete(currentSound);
        // Sound finished but we didn't crossfade - create next instance immediately
        try {
          const nextSound = createAudioPlayer(soundData.audio, {
            updateInterval: 16,
          });
          nextSound.volume = 1.0; // Start at full volume since we missed the crossfade
          nextSound.play();
          nextSoundRef.current = nextSound;

          // Swap immediately
          currentSound.remove();

          soundRef.current = nextSoundRef.current;
          nextSoundRef.current = null;

          // Set up loop for new sound
          const waitForDuration = setInterval(() => {
            if (soundRef.current?.isLoaded && soundRef.current.duration > 0) {
              clearInterval(waitForDuration);
              durationRef.current = soundRef.current.duration * 1000;
              if (
                soundRef.current &&
                isPlayingRef.current &&
                currentSoundIdRef.current === soundId
              ) {
                setupSeamlessLoop(soundRef.current, soundData, soundId);
              }
            }
          }, 50);
          setTimeout(() => clearInterval(waitForDuration), 2000);
        } catch (error) {
          console.error("Error handling sound finish:", error);
        }
      }
    }, 50); // Check every 50ms

    // Store interval for cleanup
    positionCheckIntervalsRef.current.set(currentSound, positionCheckInterval);
  };

  const crossfadeSounds = async (
    currentSound: AudioPlayer,
    nextSound: AudioPlayer,
    soundData: any,
    soundId: string,
  ) => {
    if (isCrossfadingRef.current) return;
    isCrossfadingRef.current = true;

    try {
      // Ensure next sound is actually playing before crossfade
      if (!nextSound.isLoaded) {
        // Wait for it to load
        let crossfadeSoundLoaded = false;
        const waitForLoad = setInterval(() => {
          if (nextSound.isLoaded) {
            crossfadeSoundLoaded = true;
            clearInterval(waitForLoad);
            nextSound.play();
          }
        }, 50);
        setTimeout(() => {
          clearInterval(waitForLoad);
          if (!crossfadeSoundLoaded && !nextSound.isLoaded) {
            console.error(
              "Next sound for crossfade failed to load within timeout (2s)",
            );
            // Don't proceed with crossfade if sound didn't load
            isCrossfadingRef.current = false;
          }
        }, 2000);
      } else {
        // Make sure it's playing
        try {
          nextSound.play();
        } catch (error) {
          // Ignore errors
        }
      }

      // Get current volume of next sound (should be 0.0)
      const nextVolume = nextSound.volume;

      // Fade out current and fade in next simultaneously with equal durations
      // This ensures the combined volume stays near 1.0 throughout the crossfade
      await Promise.all([
        fadeSound(
          currentSound,
          currentSound.volume,
          0.0,
          crossfadeDuration,
        ).catch(() => {}),
        fadeSound(nextSound, nextVolume, 1.0, crossfadeDuration).catch(
          () => {},
        ),
      ]);

      // Crossfade complete - only proceed if we're still supposed to be playing
      if (isPlayingRef.current && currentSoundIdRef.current === soundId) {
        try {
          // Remove old player
          const oldInterval =
            positionCheckIntervalsRef.current.get(currentSound);
          if (oldInterval) {
            clearInterval(oldInterval);
            positionCheckIntervalsRef.current.delete(currentSound);
          }
          currentSound.remove();
        } catch (error: any) {
          // Ignore errors if player is already removed
        }

        // Swap references: next becomes current
        soundRef.current = nextSoundRef.current;
        nextSoundRef.current = null;
        isCrossfadingRef.current = false;

        // Update duration and set up loop for the new current sound
        const newCurrentSound = soundRef.current;
        if (
          newCurrentSound &&
          isPlayingRef.current &&
          currentSoundIdRef.current === soundId
        ) {
          // Ensure the sound is playing - it should already be playing from crossfade
          try {
            const newStatus = newCurrentSound.currentStatus;
            if (newStatus?.isLoaded) {
              // Always ensure it's playing after crossfade
              newCurrentSound.play();
              // Reset position tracking
              (newCurrentSound as any)._prevPosition = 0;
            }
          } catch (error) {
            console.error("Error ensuring new sound is playing:", error);
          }

          // Check if duration is already available
          if (newCurrentSound.isLoaded && newCurrentSound.duration > 0) {
            durationRef.current = newCurrentSound.duration * 1000;
            setupSeamlessLoop(newCurrentSound, soundData, soundId);
          } else {
            // Update duration - wait for it to be available
            const waitForDuration = setInterval(() => {
              if (newCurrentSound.isLoaded && newCurrentSound.duration > 0) {
                clearInterval(waitForDuration);
                durationRef.current = newCurrentSound.duration * 1000;

                // Set up next loop for the new current sound
                if (
                  soundRef.current === newCurrentSound &&
                  isPlayingRef.current &&
                  currentSoundIdRef.current === soundId
                ) {
                  setupSeamlessLoop(newCurrentSound, soundData, soundId);
                }
              }
            }, 50);

            // Timeout after 2 seconds
            setTimeout(() => {
              clearInterval(waitForDuration);
              if (newCurrentSound.isLoaded && newCurrentSound.duration > 0) {
                durationRef.current = newCurrentSound.duration * 1000;
                if (
                  soundRef.current === newCurrentSound &&
                  isPlayingRef.current &&
                  currentSoundIdRef.current === soundId
                ) {
                  setupSeamlessLoop(newCurrentSound, soundData, soundId);
                }
              }
            }, 2000);
          }
        }
      } else {
        // We're no longer playing this sound, clean up
        isCrossfadingRef.current = false;
      }
    } catch (error: any) {
      console.error("Error during crossfade:", error);
      isCrossfadingRef.current = false;
    }
  };

  const playSound = async (soundId: string) => {
    try {
      // If same sound is fading out, reverse the fade
      if (currentSoundId === soundId && isFadingOut && soundRef.current) {
        // Cancel fade out intervals
        cancelAllFadeIntervals();

        // Get current volume and fade to 1.0
        const currentVolume = soundRef.current.volume;
        setIsFadingOut(false);
        setIsPlaying(true);

        // Resume playback if paused
        try {
          soundRef.current.play();
        } catch (error) {
          // Ignore errors
        }

        // Find the sound data for setting up loop
        const soundData = sets.find((set) => set.id === soundId);
        if (soundData) {
          // Fade from current volume to 1.0
          await fadeSound(soundRef.current, currentVolume, 1.0, fadeInDuration);

          // Set up seamless looping after fade in completes
          if (
            soundRef.current &&
            isPlayingRef.current &&
            currentSoundIdRef.current === soundId
          ) {
            // Wait for duration if needed
            if (soundRef.current.isLoaded && soundRef.current.duration > 0) {
              durationRef.current = soundRef.current.duration * 1000;
              setupSeamlessLoop(soundRef.current, soundData, soundId);
            } else {
              const waitForDuration = setInterval(() => {
                if (
                  soundRef.current?.isLoaded &&
                  soundRef.current.duration > 0
                ) {
                  clearInterval(waitForDuration);
                  durationRef.current = soundRef.current.duration * 1000;
                  if (
                    soundRef.current &&
                    isPlayingRef.current &&
                    currentSoundIdRef.current === soundId
                  ) {
                    setupSeamlessLoop(soundRef.current, soundData, soundId);
                  }
                }
              }, 50);
              setTimeout(() => clearInterval(waitForDuration), 2000);
            }
          }
        }
        return;
      }

      // If switching sounds, stop current immediately
      if (soundRef.current && currentSoundId !== soundId) {
        try {
          // Stop any active crossfade
          isCrossfadingRef.current = false;

          // Clear all active fade intervals
          cancelAllFadeIntervals();

          // Stop and remove nextSound if it exists (from crossfade)
          if (nextSoundRef.current) {
            const nextInterval = positionCheckIntervalsRef.current.get(
              nextSoundRef.current,
            );
            if (nextInterval) {
              clearInterval(nextInterval);
              positionCheckIntervalsRef.current.delete(nextSoundRef.current);
            }
            nextSoundRef.current.remove();
            nextSoundRef.current = null;
          }

          // Set volume to 0 and remove current sound
          soundRef.current.volume = 0.0;
          const currentInterval = positionCheckIntervalsRef.current.get(
            soundRef.current,
          );
          if (currentInterval) {
            clearInterval(currentInterval);
            positionCheckIntervalsRef.current.delete(soundRef.current);
          }
          soundRef.current.remove();
          soundRef.current = null;
        } catch (error) {
          // Ignore errors
        }
      }

      // If already playing the same sound, do nothing
      if (currentSoundId === soundId && isPlaying && soundRef.current) {
        return;
      }

      // Find the sound data
      const soundData = sets.find((set) => set.id === soundId);
      if (!soundData) {
        console.error(`Sound with id ${soundId} not found`);
        return;
      }

      // Try to use preloaded sound if available, otherwise create new instance
      let sound: AudioPlayer;
      const preloadedSound = preloadedSoundsRef.current.get(soundId);
      
      if (preloadedSound && preloadedSound.isLoaded) {
        // Use preloaded sound
        sound = preloadedSound;
        // Remove from preloaded map since we're using it
        preloadedSoundsRef.current.delete(soundId);
        // Reset volume and position for fresh playback
        sound.volume = 0.0;
        try {
          sound.seekTo(0);
        } catch (error) {
          // Ignore seek errors
        }
      } else {
        // Create new sound instance if not preloaded
        sound = createAudioPlayer(soundData.audio, {
          updateInterval: 16, // High frequency updates for smooth crossfade
        });
        sound.volume = 0.0;
      }

      sound.play();

      // Track if sound loaded successfully
      let soundLoaded = false;
      const timeoutDuration = 10000; // Increased to 10 seconds for larger files

      // Timeout if sound doesn't load
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      // If sound is already loaded (from preload), proceed immediately
      if (sound.isLoaded && sound.duration > 0) {
        soundLoaded = true;
        durationRef.current = sound.duration * 1000; // Convert seconds to milliseconds
        soundRef.current = sound;
        setCurrentSoundId(soundId);
        setIsPlaying(true);

        // Fade in the sound
        fadeSound(sound, 0.0, 1.0, fadeInDuration).then(() => {
          // Set up seamless looping after fade in completes
          if (
            soundRef.current === sound &&
            isPlayingRef.current &&
            currentSoundIdRef.current === soundId
          ) {
            setupSeamlessLoop(sound, soundData, soundId);
          }
        });
      } else {
        // Wait for sound to load and get duration
        const checkLoaded = setInterval(() => {
          if (sound.isLoaded && sound.duration > 0) {
            soundLoaded = true;
            clearInterval(checkLoaded);
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            durationRef.current = sound.duration * 1000; // Convert seconds to milliseconds
            soundRef.current = sound;
            setCurrentSoundId(soundId);
            setIsPlaying(true);

            // Fade in the sound
            fadeSound(sound, 0.0, 1.0, fadeInDuration).then(() => {
              // Set up seamless looping after fade in completes
              if (
                soundRef.current === sound &&
                isPlayingRef.current &&
                currentSoundIdRef.current === soundId
              ) {
                setupSeamlessLoop(sound, soundData, soundId);
              }
            });
          }
        }, 50);

        // Set timeout if sound doesn't load
        timeoutId = setTimeout(() => {
          clearInterval(checkLoaded);
          if (!soundLoaded && !sound.isLoaded) {
            // Check sound status for more diagnostic info
            const status = sound.currentStatus;
            const diagnosticInfo = {
              soundId,
              isLoaded: sound.isLoaded,
              duration: sound.duration,
              status: status ? JSON.stringify(status) : "unknown",
            };

            console.error(
              `Sound "${soundId}" failed to load within timeout (${timeoutDuration / 1000}s).`,
              diagnosticInfo,
            );

            try {
              sound.remove();
            } catch (error) {
              // Ignore errors if already removed
            }
            // Reset state if this was the sound we were trying to play
            if (
              soundRef.current === sound ||
              (!soundRef.current && currentSoundId === soundId)
            ) {
              soundRef.current = null;
              if (currentSoundId === soundId) {
                setCurrentSoundId(null);
                setIsPlaying(false);
              }
            }
          }
        }, timeoutDuration);
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const pauseSound = async () => {
    try {
      // Update UI immediately for responsive feel
      setIsPlaying(false);
      setIsFadingOut(true);

      // Clear any active crossfade
      isCrossfadingRef.current = false;

      // Clear all position check intervals
      positionCheckIntervalsRef.current.forEach((interval) => {
        clearInterval(interval);
      });
      positionCheckIntervalsRef.current.clear();

      // Clear all active fade intervals
      cancelAllFadeIntervals();

      // Fade out and pause both instances
      const fadePromises = [];
      if (soundRef.current) {
        const currentVolume = soundRef.current.volume;
        fadePromises.push(
          fadeSound(soundRef.current, currentVolume, 0.0, fadeOutDuration)
            .then(() => {
              try {
                soundRef.current?.pause();
              } catch (error) {
                // Ignore errors
              }
            })
            .catch(() => {}),
        );
      }
      if (nextSoundRef.current) {
        const nextVolume = nextSoundRef.current.volume;
        fadePromises.push(
          fadeSound(nextSoundRef.current, nextVolume, 0.0, fadeOutDuration)
            .then(() => {
              try {
                nextSoundRef.current?.pause();
              } catch (error) {
                // Ignore errors
              }
            })
            .catch(() => {}),
        );
      }

      await Promise.all(fadePromises);

      // Only update state if we're still fading out (not interrupted by playSound)
      // Check isPlayingRef to see if playSound was called during fade out
      if (!isPlayingRef.current) {
        setIsFadingOut(false);

        // Clean up after fade completes
        if (soundRef.current) {
          soundRef.current.remove();
          soundRef.current = null;
        }
        if (nextSoundRef.current) {
          nextSoundRef.current.remove();
          nextSoundRef.current = null;
        }
      }
    } catch (error) {
      console.error("Error pausing sound:", error);
      setIsPlaying(false);
      setIsFadingOut(false);
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      await pauseSound();
    } else if (currentSoundId) {
      await playSound(currentSoundId);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all active fade intervals
      cancelAllFadeIntervals();

      // Clear all position check intervals
      positionCheckIntervalsRef.current.forEach((interval) => {
        clearInterval(interval);
      });
      positionCheckIntervalsRef.current.clear();

      if (soundRef.current) {
        soundRef.current.remove();
      }
      if (nextSoundRef.current) {
        nextSoundRef.current.remove();
      }

      // Clean up preloaded sounds
      preloadedSoundsRef.current.forEach((player) => {
        try {
          player.remove();
        } catch (error) {
          // Ignore errors
        }
      });
      preloadedSoundsRef.current.clear();
    };
  }, []);

  return (
    <SoundContext.Provider
      value={{
        currentSoundId,
        isPlaying,
        isFadingOut,
        playSound,
        pauseSound,
        togglePlay,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}
