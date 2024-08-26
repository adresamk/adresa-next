import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";

interface ControllableDrawerProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
  footerJSX?: React.ReactNode;
}

export default function ControllableDrawer({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  children,
  footerJSX,
}: ControllableDrawerProps) {
  return (
    <>
      <Drawer
        modal
        shouldScaleBackground
        open={isOpen}
        onClose={onClose}
        onOpenChange={(e) => {
          if (e === false) {
            onClose();
          }
        }}
      >
        {/* <DrawerTrigger>Open</DrawerTrigger> */}
        <DrawerContent className="max-h-[90%] transition-all duration-300 ">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 overflow-y-auto">{children}</div>
          {(onConfirm || footerJSX) && (
            <>
              <DrawerFooter>
                {footerJSX && footerJSX}
                {!footerJSX && (
                  <>
                    <Button onClick={onConfirm}>Submit</Button>
                    <DrawerClose asChild>
                      <Button variant="ghost" onClick={onClose}>
                        Cancel
                      </Button>
                    </DrawerClose>
                  </>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
