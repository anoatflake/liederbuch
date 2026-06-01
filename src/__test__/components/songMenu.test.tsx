import { render, screen } from "@testing-library/react";
import SongMenu from "@/components/songMenu";

const mocks = vi.hoisted(() => ({
  session: null as unknown,
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: mocks.session }),
}));

vi.mock("@/components/buttons/addToRepButton", () => ({
  default: ({ id }: { id: string }) => <button>Add {id}</button>,
}));

vi.mock("@/components/buttons/currentSongButton", () => ({
  default: ({ id }: { id: string }) => <button>Share {id}</button>,
}));

describe("SongMenu", () => {
  beforeEach(() => {
    mocks.session = null;
  });

  it("renders nothing for anonymous users", () => {
    const { container } = render(<SongMenu id="A_Song" />);

    expect(container.textContent).toBe("");
  });

  it("renders repertoire and sharing actions for logged-in users", () => {
    mocks.session = { user: { id: "user-1" } };

    render(<SongMenu id="A_Song" />);

    expect(screen.getByText("Repertoire")).toBeTruthy();
    expect(screen.getByText("Mit Sängern teilen")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add A_Song" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Share A_Song" })).toBeTruthy();
  });
});
