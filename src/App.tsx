import { AppBar, Box, CssBaseline } from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import "./App.css";
import ControlsTab from "./controls/ControlsTab";
import { useMQTTJSON, useMQTTString } from "./mqtt-wrapper/Hooks";
import ResponsiveAppBar from "./navigation/AppBar";

function App() {
  return (
    <>
      <CssBaseline />
      <ResponsiveAppBar />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <ControlsTab />
        </Box>
      </Container>
    </>
  );
}

export default App;
