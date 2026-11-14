import { act, renderHook } from "@testing-library/react";
import {
  useInviteCode,
  useSongActions,
  useSongs,
} from "../../utils/zustand/songStore";

describe("song store", () => {
  it("updates subscribers when songs are added and removed", () => {
    const { result } = renderHook(() => ({
      songs: useSongs(),
      inviteCode: useInviteCode(),
      actions: useSongActions(),
    }));
    const actions = result.current.actions;

    expect(result.current.songs).toBe("");

    act(() => {
      actions.addSong("A_Song");
      actions.addSong("Another_Song");
    });

    expect(result.current.songs).toBe(", A_Song, Another_Song");
    expect(result.current.actions).toBe(actions);
    expect(result.current.inviteCode).toBe("");

    act(() => actions.removeSong("A_Song"));

    expect(result.current.songs).toBe(", Another_Song");

    act(() => actions.removeSong("Another_Song"));

    expect(result.current.songs).toBe("");
  });
});
