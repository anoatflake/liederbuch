import { create } from "zustand";

interface SongState {
  songs: string;
  inviteCode: string;
  actions: {
    addSong: (song: string) => void;
    removeSong: (song: string) => void;
  };
}

const useSongStore = create<SongState>((set) => ({
  songs: "",
  inviteCode: "",
  actions: {
    addSong: (song) => set((state) => ({ songs: state.songs + ", " + song })),
    removeSong: (song) =>
      set((state) => ({ songs: state.songs.replace(", " + song, "") })),
  },
}));

export const useSongs = () => useSongStore((state) => state.songs);
export const useInviteCode = () => useSongStore((state) => state.inviteCode);
export const useSongActions = () => useSongStore((state) => state.actions);
