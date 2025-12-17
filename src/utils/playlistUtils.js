export const getTotalSeconds = (songs = []) =>
  songs.reduce((sum, song) => sum + (Number(song?.duration) || 0), 0);

export const formatHoursMinutes = (totalSeconds = 0) => {
  const secs = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);

  return hours > 0 ? `${hours} h. ${minutes} min.` : `${minutes} min`;
};

export const formatDuration = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
