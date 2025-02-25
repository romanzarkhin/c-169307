
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NetworkIcon, Menu } from "lucide-react";
import { NetworkSidebar } from "./NetworkSidebar";

export const MobileNavigation = () => {
  return (
    <Sheet>
      <div className="flex md:hidden items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <NetworkIcon className="h-6 w-6 text-primary" />
          <span className="font-semibold">CollabGraph</span>
        </div>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
        <div className="h-full flex flex-col">
          <div className="border-b px-6 py-3">
            <div className="flex items-center gap-2">
              <NetworkIcon className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">CollabGraph</h1>
            </div>
          </div>
          <NetworkSidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
};
