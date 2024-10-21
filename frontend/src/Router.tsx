import { createBrowserRouter } from "react-router-dom";

import { Applayout } from "./components/layouts/AppLayout";

import NoMatch from "./pages/NoMatch";
import Dashboard from "./pages/Dashboard"; 
import { EnhancedLandingPage } from "./pages/Home";
import { UrlTabs } from "./pages/MyUrls";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Applayout />,
        children: [
            {
                path: "",
                element: <EnhancedLandingPage />,
            },
            {
                path: "list/:email",
                element: <Dashboard />,
            },
            {
                path: "all-urls",
                element: <UrlTabs />,
            },
        ],
    },
    {
        path: "*",
        element: <NoMatch />,
    },
], {
    basename: global.basename
})
