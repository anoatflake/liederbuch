import { fireEvent, render, screen } from "@testing-library/react";
import SideBar from "@/components/sidebar";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  query: {} as Record<string, string>,
  signIn: vi.fn(),
  signOut: vi.fn(),
  session: null as unknown,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({
    query: mocks.query,
    push: mocks.push,
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: mocks.session }),
  signIn: mocks.signIn,
  signOut: mocks.signOut,
}));

describe("SideBar", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.signIn.mockReset();
    mocks.signOut.mockReset();
    mocks.query = {};
    mocks.session = null;
    document.documentElement.classList.remove("dark");
    window.localStorage.clear();
  });

  it("renders navigation with icons and login action", () => {
    render(<SideBar />);

    expect(screen.getByRole("link", { name: "Folgen (WIP)" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Liste" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "SUGGEST SONG" })).toHaveAttribute(
      "href",
      expect.stringContaining("labels=NEW_SONG"),
    );
    expect(screen.getByRole("link", { name: "REPORT BUG" })).toHaveAttribute(
      "href",
      expect.stringContaining("labels=BUG"),
    );

    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(mocks.signIn).toHaveBeenCalledWith("discord");
  });

  it("submits title search to the songs page", () => {
    render(<SideBar />);

    fireEvent.change(screen.getByPlaceholderText("Song suchen"), {
      target: { value: "abend" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search songs" }));

    expect(mocks.push).toHaveBeenCalledWith({
      pathname: "/songs",
      query: { q: "abend" },
    });
  });

  it("toggles dark mode on the document element", () => {
    render(<SideBar />);

    fireEvent.click(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    );

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });
});
