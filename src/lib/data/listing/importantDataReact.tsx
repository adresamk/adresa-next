import React from "react";
import {
  AirVentIcon,
  AlarmCheck,
  BrickWall,
  DoorClosed,
  DoorOpen,
  Fence,
  House,
  ShowerHead,
  Wifi,
} from "lucide-react";
export const allInternalFeatures: { [key: string]: JSX.Element } = {
  wifi: <Wifi />,
  bathroom: <ShowerHead />,
  ac: <AirVentIcon />,
  elevator: <DoorClosed />,
  alart: <AlarmCheck />,
  protectionDoor: <DoorOpen />,
  spajz: <DoorOpen />,
  terace: <Fence />,
  facade: <BrickWall />,
} as const;
export const allExternalFeatures: { [key: string]: JSX.Element } = {
  garage: <House />,
} as const;
