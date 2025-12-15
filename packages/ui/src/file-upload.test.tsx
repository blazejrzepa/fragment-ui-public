import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FileUpload } from "./file-upload";

describe("FileUpload", () => {
  beforeEach(() => {
    // Mock FileReader
    global.FileReader = class FileReader {
      result: string | null = null;
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
      readAsDataURL(file: Blob) {
        setTimeout(() => {
          this.result = "data:image/png;base64,test";
          if (this.onload) {
            this.onload({ target: this } as ProgressEvent<FileReader>);
          }
        }, 0);
      }
    } as any;
  });

  it("renders file upload component", () => {
    render(<FileUpload onUpload={vi.fn()} />);
    expect(screen.getByText(/click to upload or drag and drop/i)).toBeInTheDocument();
  });

  it("handles file selection via input", async () => {
    const handleUpload = vi.fn();
    render(<FileUpload onUpload={handleUpload} />);

    const input = screen.getByLabelText("File input") as HTMLInputElement;
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
    } as FileList;

    fireEvent.change(input, { target: { files: fileList } });

    await waitFor(() => {
      expect(handleUpload).toHaveBeenCalled();
    });
  });

  it("handles drag and drop", async () => {
    const handleUpload = vi.fn();
    const { container } = render(<FileUpload onUpload={handleUpload} />);

    const dropZone = container.querySelector('[role="button"]');
    expect(dropZone).toBeInTheDocument();

    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const dataTransfer = {
      files: [file],
    };

    fireEvent.dragOver(dropZone!, { dataTransfer });
    fireEvent.drop(dropZone!, { dataTransfer });

    await waitFor(() => {
      expect(handleUpload).toHaveBeenCalled();
    });
  });

  it("validates file size", async () => {
    const handleUpload = vi.fn();
    render(<FileUpload onUpload={handleUpload} maxSize={1000} />);

    const input = screen.getByLabelText("File input") as HTMLInputElement;
    const largeFile = new File(["x".repeat(2000)], "large.txt", {
      type: "text/plain",
    });
    const fileList = {
      0: largeFile,
      length: 1,
      item: (index: number) => (index === 0 ? largeFile : null),
    } as FileList;

    fireEvent.change(input, { target: { files: fileList } });

    await waitFor(() => {
      expect(screen.getByText(/file size exceeds/i)).toBeInTheDocument();
    });

    expect(handleUpload).not.toHaveBeenCalled();
  });

  it("validates file type", async () => {
    const handleUpload = vi.fn();
    render(<FileUpload onUpload={handleUpload} accept="image/*" />);

    const input = screen.getByLabelText("File input") as HTMLInputElement;
    const textFile = new File(["test"], "test.txt", { type: "text/plain" });
    const fileList = {
      0: textFile,
      length: 1,
      item: (index: number) => (index === 0 ? textFile : null),
    } as FileList;

    fireEvent.change(input, { target: { files: fileList } });

    await waitFor(() => {
      expect(screen.getByText(/file type not accepted/i)).toBeInTheDocument();
    });

    expect(handleUpload).not.toHaveBeenCalled();
  });

  it("enforces max files limit", async () => {
    const handleUpload = vi.fn();
    render(<FileUpload onUpload={handleUpload} multiple maxFiles={2} />);

    const input = screen.getByLabelText("File input") as HTMLInputElement;
    const file1 = new File(["test1"], "test1.txt", { type: "text/plain" });
    const file2 = new File(["test2"], "test2.txt", { type: "text/plain" });
    const file3 = new File(["test3"], "test3.txt", { type: "text/plain" });
    const fileList = {
      0: file1,
      1: file2,
      2: file3,
      length: 3,
      item: (index: number) => [file1, file2, file3][index] || null,
    } as FileList;

    fireEvent.change(input, { target: { files: fileList } });

    await waitFor(() => {
      expect(screen.getByText(/maximum 2 file/i)).toBeInTheDocument();
    });
  });

  it("prevents multiple files when multiple is false", async () => {
    const handleUpload = vi.fn();
    render(<FileUpload onUpload={handleUpload} multiple={false} />);

    const input = screen.getByLabelText("File input") as HTMLInputElement;
    const file1 = new File(["test1"], "test1.txt", { type: "text/plain" });
    const file2 = new File(["test2"], "test2.txt", { type: "text/plain" });
    const fileList = {
      0: file1,
      1: file2,
      length: 2,
      item: (index: number) => [file1, file2][index] || null,
    } as FileList;

    fireEvent.change(input, { target: { files: fileList } });

    await waitFor(() => {
      expect(screen.getByText(/only one file allowed/i)).toBeInTheDocument();
    });
  });

  it("disables interaction when disabled", () => {
    render(<FileUpload onUpload={vi.fn()} disabled />);
    const input = screen.getByLabelText("File input") as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("removes file when remove button is clicked", async () => {
    const handleFileChange = vi.fn();
    render(<FileUpload onFileChange={handleFileChange} />);

    const input = screen.getByLabelText("File input") as HTMLInputElement;
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
    } as FileList;

    fireEvent.change(input, { target: { files: fileList } });

    await waitFor(() => {
      expect(screen.getByText("test.txt")).toBeInTheDocument();
    });

    const removeButton = screen.getByLabelText(/remove test.txt/i);
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(handleFileChange).toHaveBeenCalledWith([]);
    });
  });
});

