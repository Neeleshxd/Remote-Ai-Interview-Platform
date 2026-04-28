"use client";

import {
  CallControls,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LayoutListIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";

interface VideoPanelProps {
  className?: string;
}

export default function VideoPanel({ className = "" }: VideoPanelProps) {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  return (
    <div className={`relative w-full h-full bg-background ${className}`}>
      {/* VIDEO LAYOUT */}
      <div className="absolute inset-0">
        {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

        {/* PARTICIPANTS LIST OVERLAY */}
        {showParticipants && (
          <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      {/* VIDEO CONTROLS */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center px-4">
            <CallControls onLeave={() => router.push("/")} />

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="size-10">
                    <LayoutListIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLayout("grid")}>
                    Grid View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLayout("speaker")}>
                    Speaker View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                className="size-10"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <UsersIcon className="size-4" />
              </Button>

              <EndCallButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
