import React from "react";
import Header from "./header";
import SideNavs from "./side_navs";

// Component to render a script tag
function Script({ src, type }) {
  return <script src={src} type={type} />;
}

// Component to render a style tag
function Style({ children }) {
  return <style>{children}</style>;
}

// Component to render a div with specific ID
function DivWithId({ id, children }) {
  return <div id={id}>{children}</div>;
}

// Component to render header content
function HeaderContent() {
  return (
    <>
      <meta charSet="utf-8" />
      <title>backtesting plot</title>
    </>
  );
}

// Main component
export default function Photo() {
  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <br />
          <h1>Hello World!</h1>
          {/* Render header content as a separate component */}
          <HeaderContent />
          {/* Render script and style tags using dedicated components */}
          <Script src="https://cdn.bokeh.org/bokeh/release/bokeh-3.3.0.min.js" type="text/javascript" />
          <Style>
            {
              `html, body {
                box-sizing: border-box;
                display: flow-root;
                height: 100%;
                margin: 0;
                padding: 0;
              }`
            }
          </Style>
          {/* Render div with specific ID */}
          <DivWithId id="cc99dbab-4732-4caa-bfb9-5df616583c4f" />
        </div>
      </div>
    </div>
  );
}
