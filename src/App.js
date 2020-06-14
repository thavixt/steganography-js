import React from "react";
import i18next from "i18next";
import { BrowserRouter, Route } from "react-router-dom";
import "noty/lib/noty.css";
import "noty/lib/themes/nest.css";
import "./App.scss";
import HomePage from "./pages/Home";
import ComparisonPage from "./pages/Comparison";
import InfoPage from "./pages/Info";
import Header from "./compontens/Header/Header";
import Footer from "./compontens/Footer/Footer";
import LangContext from "./context/LangContext";
import translations from "./translations/translations.json";

const pages = [
    { name: "stego", path: "" },
    { name: "compare", path: "compare" },
    { name: "info", path: "info" },
];

export default function App(props) {
    const [translator, setTranslator] = React.useState(null);

    React.useEffect(() => {
        i18next.init({
            lng: "en",
            // debug: true,
            resources: translations,
        }).then((t) => {
            setTranslator(() => t);
        });
    }, []);

    if (!translator) {
        return <p>loading...</p>;
    }

    return (
        <LangContext.Provider value={translator}>
            <BrowserRouter>
                <div className="App">
                    <Header links={pages} basePath={props.basePath} />
                    <main className="App-main">
                        <Route
                            exact
                            path={props.basePath + ""}
                            render={() => <HomePage />}
                        />
                        <Route
                            path={props.basePath + "compare"}
                            render={() => <ComparisonPage />}
                        />
                        <Route
                            path={props.basePath + "info"}
                            render={() => <InfoPage />}
                        />
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </LangContext.Provider>
    );
}
