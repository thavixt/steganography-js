import React from "react";

const fallbackTranslator = (key) => `{${key}}`;

const LangContext = React.createContext(fallbackTranslator);

export default LangContext;
