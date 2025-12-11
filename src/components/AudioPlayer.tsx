import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface AudioPlayerProps {
  trackName: string;
  audioUrl?: string;
  color?: string;
}

export default function AudioPlayer({ trackName, audioUrl, color = 'primary' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(204);
  const [volume, setVolume] = useState(75);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      if (!audioUrl) {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return isPlaying ? prev + 0.1 : prev;
        });
        if (isPlaying) {
          animationRef.current = requestAnimationFrame(updateProgress);
        }
      }
    };

    if (isPlaying && !audioUrl) {
      animationRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, duration, audioUrl]);

  return (
    <div className="space-y-4">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="p-4 bg-muted/50 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              onClick={togglePlay}
              className={`bg-${color} hover:bg-${color}/90 glow-purple h-12 w-12`}
            >
              <Icon name={isPlaying ? 'Pause' : 'Play'} size={20} />
            </Button>
            <div>
              <p className="font-medium">{trackName}</p>
              <p className="text-sm text-foreground/60">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 min-w-[120px]">
            <Icon 
              name={volume === 0 ? 'VolumeX' : volume < 50 ? 'Volume1' : 'Volume2'} 
              size={18} 
              className="text-foreground/60"
            />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            onValueChange={handleSeek}
            max={duration}
            step={0.1}
            className="w-full"
          />
          
          <div className="h-20 flex items-end gap-0.5 rounded overflow-hidden">
            {[...Array(100)].map((_, i) => {
              const height = Math.sin(i * 0.5 + currentTime) * 30 + 50 + Math.random() * 20;
              const isActive = (currentTime / duration) * 100 > i;
              return (
                <div
                  key={i}
                  className={`flex-1 transition-all duration-100 rounded-sm ${
                    isActive ? `bg-${color}` : 'bg-${color}/20'
                  }`}
                  style={{ 
                    height: `${height}%`,
                    backgroundColor: isActive 
                      ? color === 'primary' ? '#8B5CF6' 
                        : color === 'secondary' ? '#D946EF' 
                        : '#0EA5E9'
                      : color === 'primary' ? 'rgba(139, 92, 246, 0.2)'
                        : color === 'secondary' ? 'rgba(217, 70, 239, 0.2)'
                        : 'rgba(14, 165, 233, 0.2)'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" variant="outline">
          <Icon name="Download" size={18} className="mr-2" />
          Скачать MP3
        </Button>
        <Button className="flex-1" variant="outline">
          <Icon name="Download" size={18} className="mr-2" />
          Скачать WAV
        </Button>
      </div>
    </div>
  );
}
