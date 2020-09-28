import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = (props: any) => {
  let pathname = props.location.pathname.slice(1);

  let paths = ["new", "top", "best", "ask", "show", "job"];

  if (!paths.includes(pathname) && pathname === "news") {
    pathname = "top";
  }

  let links = [];

  for (const path of paths) {
    let className = "nav-link gray";
    if (pathname == path) {
      className = className + " br2 bg-light-gray hover-black";
    }
    let link = (
      <Link className={className} to={"/" + path}>
        {path[0].toUpperCase() + path.slice(1)}
      </Link>
    );
    links.push(link);
  }

  return (
    <header className="">
      <nav className="nav py-3">{links}</nav>
    </header>
  );
};

export const HNHeadline = (props:{
  setRedirect: any,
  title: string,
  url?: string,
}) => {

  let createHeadelineElement = (variablePropName: string, variablePropValue: any, headlineTitle: string) => {
    const variableAttribute = { [variablePropName]: variablePropValue };
    return (
      <a className="text-reset text-decoration-none"
        {...variableAttribute} >
        {headlineTitle}
      </a>
    );
  };

  let headlineElement;

  if (props.url === undefined) {
    headlineElement = createHeadelineElement("onClick", () => props.setRedirect(true), props.title);
  }
  else {
    headlineElement = createHeadelineElement("href", props.url, props.title)
  }

  return headlineElement;
}