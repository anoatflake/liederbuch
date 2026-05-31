import { render, screen } from "@testing-library/react";
import Songs from "@/pages/songs";

const mocks = vi.hoisted(() => ({
  query: {} as Record<string, string>,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({
    query: mocks.query,
  }),
}));

vi.mock("@/components/sidebar", () => ({
  default: () => <nav>Sidebar</nav>,
}));

vi.mock("@/components/letterGroup", () => ({
  default: ({
    letter,
    hidden,
    selected,
    searchQuery,
  }: {
    letter: string;
    hidden: boolean;
    selected?: boolean;
    searchQuery?: string;
  }) =>
    hidden ? null : (
      <div data-testid={`letter-${letter}`}>
        {letter}:{selected ? "selected" : "plain"}:{searchQuery}
      </div>
    ),
}));

describe("Songs index", () => {
  beforeEach(() => {
    mocks.query = {};
  });

  it("renders all letter groups by default", () => {
    render(<Songs />);

    expect(screen.getByTestId("letter-A")).toBeTruthy();
    expect(screen.getByTestId("letter-Z")).toBeTruthy();
  });

  it("filters to the selected letter and forwards search query", () => {
    mocks.query = { letter: "B", q: "ballade" };

    render(<Songs />);

    expect(screen.queryByTestId("letter-A")).toBeNull();
    expect(screen.getByTestId("letter-B").textContent).toBe(
      "B:selected:ballade",
    );
    expect(screen.getByText("Suche nach:")).toBeTruthy();
    expect(screen.getByText("ballade")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Reset search" })).toHaveAttribute(
      "href",
      "/songs?letter=B",
    );
  });

  it("resets search back to the full songs list when no letter is selected", () => {
    mocks.query = { q: "republik" };

    render(<Songs />);

    expect(screen.getByRole("link", { name: "Reset search" })).toHaveAttribute(
      "href",
      "/songs",
    );
  });
});
