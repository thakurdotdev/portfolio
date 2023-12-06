import React, { useState, useEffect } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Hero from "./Components/Hero";
import Skills from "./Components/Skills/Skills";
import Social from "./Components/Social";
import About from "./Components/About";
import Projects from "./Components/Projects/Projects";
import Contact from "./Components/Contact";
import Experience from "./Components/Experience/Experience";
import Navigation from "./Components/Navigation";
import Loader from "./Components/Loader";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  return (
    <div className="Hero">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Social />
          <Outlet />
          <Navigation />
        </>
      )}
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
