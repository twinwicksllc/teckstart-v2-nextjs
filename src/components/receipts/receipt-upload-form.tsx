"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadResult {
  success: boolean;
  receiptId?: number;
  message?: string;
  error?: string;
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: string;
}

export function ReceiptUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setProcessingStatus("");

      // Show preview if image
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
      setProcessingStatus("");

      if (droppedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const pollReceiptStatus = async (receiptId: number) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max
    const pollInterval = 1000; // Check every second

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/expenses/${receiptId}/status`);
        const data = await response.json();

        if (data.status === "completed") {
          setProcessingStatus("✅ Receipt parsed successfully!");
          setResult({
            success: true,
            message: `Merchant: ${data.data?.merchantName || "Unknown"}`,
          });
          return true;
        } else if (data.status === "failed") {
          setProcessingStatus(`❌ Parsing failed: ${data.error}`);
          setResult({
            success: false,
            error: data.error || "Parsing failed",
          });
          return true;
        } else {
          setProcessingStatus(`⏳ Processing... (${attempts}s)`);
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(checkStatus, pollInterval);
          } else {
            setProcessingStatus("⚠️ Processing is taking longer than expected. Check back soon.");
          }
        }
      } catch (error) {
        console.error("Status check error:", error);
        setProcessingStatus("❌ Failed to check status");
        return true;
      }
    };

    checkStatus();
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);
    setProcessingStatus("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/expenses/upload-receipt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setProcessingStatus("⏳ Analyzing receipt...");

        // Start polling for status
        if (data.receiptId) {
          pollReceiptStatus(data.receiptId);
        }
      } else {
        setResult({
          success: false,
          error: data.error || "Upload failed",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setResult({
        success: false,
        error: "Failed to upload receipt. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="receipt">Upload Receipt</Label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              ref={fileInputRef}
              id="receipt"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  Drag & drop receipt here or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports: JPG, PNG, GIF, WebP (max 50MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {preview && (
          <div className="mt-4">
            <Label>Preview</Label>
            <img
              src={preview}
              alt="Receipt preview"
              className="mt-2 max-w-full max-h-64 rounded border"
            />
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload & Parse Receipt"}
        </Button>

        {result && (
          <div
            className={`mt-4 p-4 rounded ${
              result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            <p className="font-medium">
              {result.success ? "Upload Successful" : "Upload Failed"}
            </p>
            {result.message && <p className="text-sm mt-1">{result.message}</p>}
            {result.error && <p className="text-sm mt-1">{result.error}</p>}
            {result.compressionRatio && (
              <p className="text-xs mt-2">
                File compressed by {result.compressionRatio}% ({(result.originalSize! / 1024).toFixed(0)}KB →{" "}
                {(result.compressedSize! / 1024).toFixed(0)}KB)
              </p>
            )}
          </div>
        )}

        {processingStatus && (
          <div className="mt-4 p-4 rounded bg-blue-50 text-blue-800">
            <p className="text-sm">{processingStatus}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
