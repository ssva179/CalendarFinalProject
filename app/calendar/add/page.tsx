//tonitos part this is the page that displays on the add event page it is styled and displays text
//boxes to create an event of name, dates, and notes, and also connects it to the user when creating it, 
//it then uses the createNewEvent.ts to create the new event and then redirects you to the calendar 
//page once you have created the event by clicking the button 
//this page does not talk to mongodb directly but it calles createnewevent() which is a server action that inserts the 
//event into mongodb, keeps database logic seperate from ui
"use client";

import { useState } from "react";
import createNewEvent from "@/lib/createNewEvent";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation"


import Nav from "@/components/Nav";
import Header from "@/components/Header";

import { Box, TextField, Button, Typography } from "@mui/material";
import styled from "styled-components";

//styled container and box 
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3E3D0;
`;

const FormBox = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 400px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
`;

export default function AddEventPage() {
  //gets logged in user session 
  const { data: session } = useSession();

  //this is the local state to store from inputs before sending it to backend
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [notes, setNotes] = useState("");

  //when click create event button, makes sure user is logged in and makes sure fields are filled out
  async function handleSubmit() {
    const userEmail = session?.user?.email;
    if (!userEmail) {
      alert("You must be logged in");
      return;
    }

    if (!name || !start || !end) {
      alert("Please fill all required fields");
      return;
    }

    //calls the server function to store event in mongodb
    await createNewEvent(
      name,
      new Date(start),
      new Date(end),
      notes ? [notes] : [],
      userEmail
    );

    //redirects to reloaded main calendar page 
    redirect("/calendar")
  }

  //displaying the create event box with all the text boxes and button (ui)
  return (
      <>
        <Header />
        <Nav/>
        <Container>
          <FormBox>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#81A6C6" }}>
              Add New Event
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

              <TextField
                  label="Event Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
              />

              <TextField
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
              />

              <TextField
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
              />

              <TextField
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={3}
              />

              <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    mt: 2,
                    background: "linear-gradient(45deg, #81A6C6, #81A6C6)",
                    fontWeight: 600,
                  }}
              >
                Create Event
              </Button>
            </Box>
          </FormBox>
        </Container>
      </>

  );
}