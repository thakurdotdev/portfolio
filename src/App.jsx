import React from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";

import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Skills from "./Components/Skills/Skills";
import Social from "./Components/Social";
import About from "./Components/About";
import Footer from "./Components/Footer";
import Projects from "./Components/Projects/Projects";
import Contact from "./Components/Contact";
import Experience from "./Components/Experience/Experience";

const App = () => {
  return (
    <div className="Hero">
      <Header />
      <Social />
      <Outlet />
      <Footer />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    exact: true,
    element: <App />,

    children: [
      {
        path: "/",
        exact: true,
        element: <Hero />,
      },
      {
        path: "/about",
        exact: true,
        element: <About />,
      },
      {
        path: "/skills",
        exact: true,
        element: <Skills />,
      },
      {
        path: "/projects",
        exact: true,
        element: <Projects />,
      },
      {
        path: "/experience",
        exact: true,
        element: <Experience />,
      },
      {
        path: "/contact",
        exact: true,
        element: <Contact />,
      },
    ],
  },
]);

const Root = () => {
  return <RouterProvider router={appRouter} />;
};

export default Root;
