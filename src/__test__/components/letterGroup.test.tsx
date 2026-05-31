import { render, screen } from "@testing-library/react";
import LetterGroup from "@/components/letterGroup";

vi.mock("@/components/songListElement", () => ({
  default: ({ id }: { id: string }) => <span>{id}</span>,
}));

describe("LetterGroup", () => {
  it("renders songs for a visible letter", () => {
    render(<LetterGroup letter="A" hidden={false} />);

    expect(screen.getByRole("heading", { name: "A" })).toBeTruthy();
    expect(screen.getByText("Ain-t_no_Sunshine")).toBeTruthy();
  });

  it("filters songs by cleaned-up title", () => {
    render(<LetterGroup letter="A" hidden={false} searchQuery="sunshine" />);

    expect(screen.getByText("Ain-t_no_Sunshine")).toBeTruthy();
    expect(screen.queryByText("American_Idiot")).toBeNull();
  });

  it("hides the letter when search has no matches", () => {
    render(<LetterGroup letter="A" hidden={false} searchQuery="republik" />);

    expect(screen.queryByLabelText("Songs A")).toBeNull();
  });

  it("marks the selected letter group", () => {
    render(<LetterGroup letter="A" hidden={false} selected />);

    expect(screen.getByLabelText("Songs A").className).toContain(
      "border-teal-500",
    );
  });
});
