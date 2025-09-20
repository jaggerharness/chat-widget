import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders header and assistant status", () => {
    render(<App />);

    const header = screen.getByRole("header");
    expect(header).toHaveTextContent("AI Assistant");
    expect(header).toHaveTextContent("Online");
  });

  it("renders greeting", () => {
    render(<App />);

    const messageBox = screen.getByRole("messages");
    expect(messageBox).toHaveTextContent("Hello! I'm your AI assistant. How can I help you today?");
  });

  it("allows user to send a message", () => {
    render(<App />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Hello, AI!" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    const messageBox = screen.getByRole("messages");
    expect(messageBox).toHaveTextContent("Hello, AI!");
  });

  it("receives and displays response from backend", async () => {
    render(<App />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Hello, AI!" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    const messageBox = await screen.findByText("This is an example.", {}, { timeout: 5000 });
    expect(messageBox).toBeInTheDocument();
  });
});