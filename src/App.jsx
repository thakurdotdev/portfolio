import React from "react";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import "./App.css";
import Skills from "./Components/Skills";
import Social from "./Components/Social";
import About from "./Components/About";
import Footer from "./Components/Footer";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Projects from "./Components/Projects/Projects";

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
    element: <App />,

    children: [
      {
        path: "/",
        element: <Hero />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/skills",
        element: <Skills />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
    ],
  },
]);

const Root = () => {
  return <RouterProvider router={appRouter} />;
};

export default Root;
