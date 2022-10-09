import { Card, CardContent, Typography } from "@mui/material";
import { FC } from "react";
import LightButton, { Variant } from "./LightButton";

interface RoomCardProps {
    name: string;
}
const RoomCard: FC<RoomCardProps> = ({name}) => {
  return (
    <Card title="Wohnzimmer" variant="outlined" sx={{height: "100%", textAlign: "center"}}>
      <CardContent>
        <Typography  gutterBottom variant="h4" >
            {name}
        </Typography>
        <LightButton
          label="Light 1"
          topic="fnord3"
          variant={Variant.LIGHT}
        />
      </CardContent>
    </Card>
  );
};
export default RoomCard;
