import React from "react";
import {
  AirVentIcon,
  AlarmCheck,
  BrickWall,
  CarIcon,
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

const icons: { [key: string]: JSX.Element } = {
  bathroom: <ShowerHead width={16} height={16} />,
  ac: <AirVentIcon width={16} height={16} />,
  garage: <House width={16} height={16} />,
  elevator: <DoorClosed />,
  alart: <AlarmCheck />,
  protectionDoor: <DoorOpen />,
  spajz: <DoorOpen />,
  terace: <Fence />,
  facade: <BrickWall />,
};

export const featureIcons = {
  parking: <CarIcon className="h-4 w-4" />,
  elevator: <AlarmCheck className="h-4 w-4" />,
};
