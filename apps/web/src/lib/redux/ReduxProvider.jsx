"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { createSecureBankStore } from "./store";

export function ReduxProvider({ children }) {
  const [store] = useState(createSecureBankStore);

  return <Provider store={store}>{children}</Provider>;
}
