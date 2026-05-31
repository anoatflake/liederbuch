import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";

describe("Home", () => {
  it("", async () => {
    //arrange
    render(<Home />);
    //act
    //assert
    expect(screen.getByRole("main")).toBeTruthy();
  });
});
