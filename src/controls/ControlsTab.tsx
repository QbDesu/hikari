import { Unstable_Grid2 as Grid, Paper, Typography } from "@mui/material";
import RoomCard from "./RoomCard";

export default () => {
  return (
    <Grid container spacing={2} alignItems="stretch">
      <Grid xs={12} sm={6} md={4} lg={3}>
        <RoomCard name="Wohnzimmer" />
      </Grid>
      <Grid xs={12} sm={6} md={4} lg={3}>
        <RoomCard name="Plenarsaal" />
      </Grid>
      <Grid xs={12} sm={6} md={4} lg={3}>
        <RoomCard name="Fnordcenter" />
      </Grid>
      <Grid xs={12} sm={6} md={4} lg={3}>
        <RoomCard name="Keller" />
      </Grid>
    </Grid>
  );
};
