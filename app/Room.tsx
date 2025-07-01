"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider publicApiKey={"pk_prod_WG2fZ2rLM7LPQJFJ-uBEcal6lO3EnQE92Pz6Chagu9Kargi6xEhrL97ohefvpDuB"}
    resolveMentionSuggestions={async ({ text, roomId }) => {
    // The text the user is searching for, e.g. "mar"
    console.log(text);

    // Return a list of user IDs that match the query
    return ["marc@example.com", "marissa@example.com"]}}
    >
      <RoomProvider id="my-room">
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}