"use client";

import {
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

import VideoPanel from "./VideoPanel";
import CodeEditor from "./CodeEditor";
import AIAssistantSidebar from "./AIAssistantSidebar";

function MeetingRoom() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const [isAISidebarCollapsed, setIsAISidebarCollapsed] = useState(false);

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem-1px)] relative">

      {/* 🔘 FLOATING TOGGLE BUTTON */}
      <button
        onClick={() => setIsAISidebarCollapsed(!isAISidebarCollapsed)}
        className="absolute right-2 top-2 z-50 bg-green-600 text-white px-3 py-1 rounded text-xs"
      >
        {isAISidebarCollapsed ? "Show AI" : "Hide AI"}
      </button>

      <ResizablePanelGroup direction="horizontal">

        {/* LEFT: VIDEO */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <VideoPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* CENTER: CODE */}
        <ResizablePanel
          defaultSize={isAISidebarCollapsed ? 75 : 50}
          minSize={30}
        >
          <CodeEditor />
        </ResizablePanel>

        {/* RIGHT: AI SIDEBAR */}
        {!isAISidebarCollapsed && (
          <>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <AIAssistantSidebar />
            </ResizablePanel>
          </>
        )}

      </ResizablePanelGroup>
    </div>
  );
}

export default MeetingRoom;