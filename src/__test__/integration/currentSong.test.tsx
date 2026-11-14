import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import Current from "../../pages/currentSong/[id]";

const mocks = vi.hoisted(() => ({
  currentSong: undefined as string | undefined,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ query: { id: "invite-1" } }),
}));

vi.mock("../../utils/trpc", () => ({
  trpc: {
    repertoire: {
      getRepertoireViaInviteCode: {
        useQuery: () => ({ data: { currentSong: mocks.currentSong } }),
      },
    },
  },
}));

describe("current song query integration", () => {
  beforeEach(() => {
    mocks.currentSong = undefined;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function renderCurrent() {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });

    return render(<Current />, {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });
  }

  it("waits for a selected song before fetching its content", () => {
    const fetchSong = vi.fn();
    vi.stubGlobal("fetch", fetchSong);

    renderCurrent();

    expect(fetchSong).not.toHaveBeenCalled();
    expect(screen.getByRole("main")).toHaveTextContent(/^$/);
  });

  it("fetches and displays new content when the shared song changes", async () => {
    const fetchSong = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ content: "<h1>First song</h1>" }))
      .mockResolvedValueOnce(
        Response.json({ content: "<h1>Second song</h1>" }),
      );
    vi.stubGlobal("fetch", fetchSong);
    mocks.currentSong = "First_Song";

    const { rerender } = renderCurrent();

    expect(
      await screen.findByRole("heading", { name: "First song" }),
    ).toBeInTheDocument();
    expect(fetchSong).toHaveBeenNthCalledWith(1, "/api/song/First_Song");

    mocks.currentSong = "Second_Song";
    rerender(<Current />);

    expect(
      await screen.findByRole("heading", { name: "Second song" }),
    ).toBeInTheDocument();
    expect(fetchSong).toHaveBeenNthCalledWith(2, "/api/song/Second_Song");
    expect(screen.queryByText("First song")).not.toBeInTheDocument();
  });
});
