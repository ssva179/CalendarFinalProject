/*
    Amir job - import;
    page lets a user upload .ics file;
    the file is being read in the browser and sent to a server action that imports the events into database;
*/

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import styled from "styled-components";

import Header from "@/components/Header";
import Nav from "@/components/Nav";
import { deleteImportedEvents, importIcsEvents } from "@/lib/importIcsEvents";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3e3d0;
  padding: 24px;
`;

const Card = styled.div`
  background: #fff7eb;
  border: 2px solid #c98f48;
  padding: 32px;
  border-radius: 16px;
  width: min(100%, 520px);
  box-shadow: 0px 12px 30px rgba(83, 54, 24, 0.18);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FilePickerButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 14px 22px;
  border-radius: 12px;
  border: 2px solid #8f4311;
  background: #fffaf5;
  color: #6a3d10;
  font-weight: 700;
  font-size: 0.98rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(143, 67, 17, 0.12);
`;

export default function ImportPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  // reads a selected file and sends text to server action;
  // refreshes after importing with new data
  const handleImport = async () => {
    if (!selectedFile) {
      alert("Please choose a .ics file first.");
      return;
    }

    const icsText = await selectedFile.text();

    startTransition(async () => {
      const result = await importIcsEvents(icsText);

      if (result.error) {
        setStatusMessage(result.error);
        alert(result.error);
        return;
      }

      const message =
        result.sourceEventCount === result.importedCount
          ? `Imported ${result.sourceEventCount} event${
              result.sourceEventCount === 1 ? "" : "s"
            }.`
          : `Imported ${result.sourceEventCount} calendar event${
              result.sourceEventCount === 1 ? "" : "s"
            } as ${result.importedCount} occurrence${
              result.importedCount === 1 ? "" : "s"
            }.`;
      setStatusMessage(message);
      alert(message);
      router.refresh();
    });
  };

  // deletes all imported events
  const handleDeleteImported = () => {
    if (!confirm("Delete all imported events?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteImportedEvents();

      if (result.error) {
        setStatusMessage(result.error);
        alert(result.error);
        return;
      }

      const message = `Deleted ${result.deletedCount} imported event${
        result.deletedCount === 1 ? "" : "s"
      }.`;
      setStatusMessage(message);
      alert(message);
      router.refresh();
    });
  };

  return (
    <>
      <Header />
      <Nav />
      <Container>
        <Card>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#6a3d10" }}>
            Import `.ics` File
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#2f2417", lineHeight: 1.6 }}
          >
            Upload a calendar file to add its events. Recurring events are
            expanded and imported through their end date.
          </Typography>

          <Box>
            <HiddenFileInput
              id="ics-file-upload"
              type="file"
              accept=".ics,text/calendar"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setSelectedFile(file);
                setStatusMessage(file ? `Selected: ${file.name}` : "");
              }}
            />
            <FilePickerButton htmlFor="ics-file-upload">
              Choose `.ics` File
            </FilePickerButton>
          </Box>

          {statusMessage && (
            <Typography
              variant="body2"
              sx={{ color: "#4f3419", fontWeight: 500 }}
            >
              {statusMessage}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleImport}
              disabled={isPending || !selectedFile}
              sx={{
                background: "#b45d22",
                color: "#fffaf5",
                fontWeight: 700,
                fontSize: "0.95rem",
                px: 2.5,
                py: 1.1,
                minWidth: 170,
                boxShadow: "0 4px 10px rgba(143, 67, 17, 0.18)",
              }}
            >
              {isPending ? "Working..." : "Import Events"}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteImported}
              disabled={isPending}
              sx={{
                fontWeight: 700,
                px: 2.25,
                py: 1.1,
                minWidth: 170,
              }}
            >
              Delete Imported Events
            </Button>
          </Box>
        </Card>
      </Container>
    </>
  );
}
