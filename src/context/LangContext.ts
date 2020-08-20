import { createContext } from "react";

const fallbackTranslator: Function = (key: string) => `{${key}}`;
const LangContext = createContext(fallbackTranslator);

export default LangContext;
