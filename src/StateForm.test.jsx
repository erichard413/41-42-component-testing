import { it, describe, expect, vi } from "vitest";
import { StateForm } from "./StateForm";
//react testing library specific
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RefForm } from "./RefForm";

// to easily swap out ref/state forms:
// const StateForm = RefForm;

describe("#Form component", () => {
  it("should render form", () => {
    render(<StateForm onSubmit={() => alert("Success")} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.queryByText("blah")).not.toBeInTheDocument();
  });
  it("should not error when valid form inputs", async () => {
    const user = userEvent.setup();
    const email = "erichard@webdevsimplified.com";
    const password = "Monday@2023";
    const onSubmitMock = vi.fn();
    render(<StateForm onSubmit={onSubmitMock} />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByText("Submit");
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    await user.click(submitBtn);
    expect(onSubmitMock).toHaveBeenCalledOnce();
    expect(onSubmitMock).toHaveBeenCalledWith({ email, password });
  });
  it(`should error when email address does not end in "@webdevsimplified.com"`, async () => {
    const user = userEvent.setup();
    const email = "test@test.com";
    const password = "Monday@2023";
    const onSubmitMock = vi.fn();
    render(<StateForm onSubmit={onSubmitMock} />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByText("Submit");
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    await user.click(submitBtn);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Must end with @webdevsimplified.com")
    ).toBeInTheDocument();
  });
  it(`should not submit if email input not an email address`, async () => {
    const user = userEvent.setup();
    const email = "test";
    const password = "Monday@2023";
    const onSubmitMock = vi.fn();
    render(<StateForm onSubmit={onSubmitMock} />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByText("Submit");
    await user.type(emailInput, email);
    await user.type(passwordInput, password);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    await user.click(submitBtn);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    //fields do not reset
    expect(emailInput.value).toBe(email);
    expect(passwordInput.value).toBe(password);
  });
  it(`should should show "Required" if submitted with no email address`, async () => {
    const user = userEvent.setup();
    const password = "Monday@2023";
    const onSubmitMock = vi.fn();
    render(<StateForm onSubmit={onSubmitMock} />);
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByText("Submit");
    await user.type(passwordInput, password);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    await user.click(submitBtn);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Required, Must end with @webdevsimplified.com")
    ).toBeInTheDocument();
  });
  it(`should show "Required" if submitted with no password`, async () => {
    const user = userEvent.setup();
    const email = "test@webdevsimplified.com";
    const onSubmitMock = vi.fn();
    render(<StateForm onSubmit={onSubmitMock} />);
    const emailInput = screen.getByLabelText("Email");
    const submitBtn = screen.getByText("Submit");
    await user.type(emailInput, email);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    await user.click(submitBtn);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    expect(
      await screen.findByText(
        "Must be at least 10 characters, Must include at least 1 lowercase letter, Must include at least 1 uppercase letter, Must include at least 1 number"
      )
    ).toBeInTheDocument();
  });
  it(`email input should update error message when user types`, async () => {
    const user = userEvent.setup();
    const email = "";
    const password = "Monday@2023";
    const onSubmitMock = vi.fn();
    render(<StateForm onSubmit={onSubmitMock} />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(passwordInput, password);
    const submitBtn = screen.getByText("Submit");
    await user.click(submitBtn);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    expect(
      screen.getByText("Required, Must end with @webdevsimplified.com")
    ).toBeInTheDocument();
    await user.type(emailInput, "test");
    expect(screen.queryByText("Required")).toBe(null);
    expect(screen.queryByText("Required")).not.toBeInTheDocument();
    expect(
      await screen.findByText("Must end with @webdevsimplified.com")
    ).toBeInTheDocument();
  });
  it(`password input should update error message when user types`, async () => {
    const user = userEvent.setup();
    const email = "test@webdevsimplified.com";
    const password = "";
    const onSubmitMock = vi.fn();
    render(<StateForm onSubmit={onSubmitMock} />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, email);
    const submitBtn = screen.getByText("Submit");
    await user.click(submitBtn);
    expect(onSubmitMock).not.toHaveBeenCalledOnce();
    expect(
      screen.getByText(
        "Must be at least 10 characters, Must include at least 1 lowercase letter, Must include at least 1 uppercase letter, Must include at least 1 number"
      )
    ).toBeInTheDocument();
    await user.type(passwordInput, "a");
    expect(
      screen.getByText(
        "Must be at least 10 characters, Must include at least 1 uppercase letter, Must include at least 1 number"
      )
    ).toBeInTheDocument();
    await user.type(passwordInput, "B");
    expect(
      screen.getByText(
        "Must be at least 10 characters, Must include at least 1 number"
      )
    ).toBeInTheDocument();
    await user.type(passwordInput, "1");
    expect(
      screen.getByText("Must be at least 10 characters")
    ).toBeInTheDocument();
    await user.type(passwordInput, "45678901");
    expect(
      screen.queryByText("Must be at least 10 characters")
    ).not.toBeInTheDocument();
  });
});
