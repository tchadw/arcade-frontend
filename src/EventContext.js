import React, { useState, createContext } from "react";
import { useLocalState } from "./LocalStorageHook";

export const EventContext = createContext();

export const EventProvider = props => {
  const [eventSelected, setEvent] = useLocalState("eventSelected");
  return (
    <EventContext.Provider value={[eventSelected, setEvent]}>
      {props.children}
    </EventContext.Provider>
  );
};
