import { Button, styled } from "@mui/material";
import {
  Lightbulb,
  LightbulbOutlined,
  Power,
  PowerOff,
  PowerOffOutlined,
  QuestionMark,
} from "@mui/icons-material";
import { FC, ReactNode } from "react";
import { useMQTTBoolean } from "../mqtt-wrapper/Hooks";

const BigButton = styled(Button)<{ turnedOn: boolean }>`
  height: 120px;
  width: 120px;
  display: inline-block;
  color: white;
  ${({ turnedOn }) =>
    turnedOn
        ? `background-color: green;
    &:hover { background-color: green; }`
        : `background-color: red;
    &:hover { background-color: red; }`}
`;

export enum Variant {
  LIGHT = "light",
  POWER = "power",
}

interface LightButtonProps {
  label: string;
  topic: string;
  variant: Variant;
}

const LightButton: FC<LightButtonProps> = (props) => {
  const { label, topic, variant } = props;

  const [turnedOn, setActive] = useMQTTBoolean(topic);

  let IconComponent = QuestionMark;
  switch (variant) {
    case Variant.LIGHT:
      IconComponent = turnedOn ? Lightbulb : LightbulbOutlined;
      break;
    case Variant.POWER:
      IconComponent = turnedOn ? Power : PowerOffOutlined;
      break;
  }

  return (
    <BigButton turnedOn={turnedOn!} onClick={()=>setActive(!turnedOn)}>
      <div>
        <IconComponent fontSize="large" />
      </div>
      {label}
    </BigButton>
  );
};
export default LightButton;
