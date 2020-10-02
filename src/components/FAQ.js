import React from "react";
import "../styles/Home.scss";
import "../styles/FAQ.scss";
import home from "../assets/home.png";
import search from "../assets/search.png";
import favourites from "../assets/favourites.png";
import schedule from "../assets/schedule.png";
import messages from "../assets/messages.png";

function FAQ() {
  return (
    <div className="faq">
      <h1 className="favourite-title">Frequently Asked Questions</h1>
      <h2>Who created Toronto City Guide?</h2>
      <h3>
        Toronto City Guide was created by
        <a
          href="https://github.com/kguertin"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          Kevin Guertin
        </a>
        ,
        <a
          href="https://github.com/victorcwyu"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          Victor Yu
        </a>
        ,
        <a
          href="https://github.com/Pulse6"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          Marco Siu
        </a>
        , and
        <a
          href="https://github.com/neethu-ms"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          Neethu M S
        </a>
        .<br></br>
        The server code deployed on Heroku can be found
        <a
          href="https://github.com/kguertin/toronto-city-guide-server"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          here{" "}
        </a>
        and the client code deployed on Netlify can be found
        <a
          href="https://github.com/victorcwyu/Toronto-City-Guide-Client"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          here
        </a>
        .
      </h3>
      <h2>What is Toronto City Guide?</h2>
      <h3>
        Toronto City Guide is a MongoDB, Express, React.js and Node.js (MERN)
        stack application that allows users to search locations around the city
        and find accommodation, tourist attractions and convenience stores
        nearby. The application also has a schedule feature as well as a
        real-time chat to facilitate planning while travelling.
      </h3>
      <h2>Application Screenshots</h2>
      <h3>Home</h3>
      <br></br>
      <img src={home} alt="Preview of what the homepage looks like." />
      <br></br>
      <br></br>
      <br></br>
      <h3>Search</h3>
      <br></br>
      <img src={search} alt="Preview of what the search feature looks like." />
      <br></br>
      <br></br>
      <br></br>
      <h3>Favourites</h3>
      <br></br>
      <img
        src={favourites}
        alt="Preview of what the favourites feature looks like."
      />
      <br></br>
      <br></br>
      <br></br>
      <h3>Schedule</h3>
      <br></br>
      <img
        src={schedule}
        alt="Preview of what the schedule feature looks like."
      />
      <br></br>
      <br></br>
      <br></br>
      <h3>Messages</h3>
      <br></br>
      <img
        src={messages}
        alt="Preview of what the messages feature looks like."
      />
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}

export default FAQ;
