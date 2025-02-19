import React from "react";
import axios from "axios";
import "./App.css";
import catGif from "./image/cat.gif";

class App extends React.Component {
  state = { word: "", definition: "", partOfSpeech: "" };

  // fetchAdvice = () => {
  //   axios
  //     .get("https://api.dictionaryapi.dev/api/v2/entries/en/recognition")
  //     .then((response) => {
  //       const word = response.data[0].word;
  //       const definition =
  //         response.data[0].meanings[0].definitions[0].definition;
  //       let phonetic = response.data[0].phonetic;
  //       if (!phonetic && response.data[0].phonetics.length > 0) {
  //         phonetic =
  //           response.data[0].phonetics.find((p) => p.text)?.text || "N/A";
  //       }
  //       console.log(word);
  //       console.log(definition);
  //       console.log(phonetic);
  //       this.setState({ word, definition, phonetic });
  //     })

  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  componentDidMount() {
    this.fetchAdvice();
  }
  fetchAdvice = () => {
    axios
      .get("https://random-word-api.herokuapp.com/word?lang=en")
      .then((res) => {
        const randomWord = res.data[0]; // ได้คำศัพท์แบบสุ่ม
        return axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`
        );
      })
      .then((response) => {
        if (!response.data || response.data.length === 0) {
          console.warn("Word not found, fetching again...");
          this.fetchAdvice(); // เรียก fetchAdvice ใหม่
          return;
        }
        const word = response.data[0].word;
        const definition =
          response.data[0].meanings[0].definitions[0].definition;
        const partOfSpeech =
          response.data[0].meanings.length > 0
            ? response.data[0].meanings[0].partOfSpeech
            : "N/A";

        console.log(word);
        console.log(definition);
        console.log(partOfSpeech);

        this.setState({ word, definition, partOfSpeech });
      })
      .catch((error) => console.error("Error fetching word:", error));
  };

  render() {
    const { word } = this.state;
    const { definition } = this.state;
    const { partOfSpeech } = this.state;
    return (
      <div className="app">
        <h1 className="title">Random Vocabulary</h1>
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h1 className="card-title">{word}</h1>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              {partOfSpeech}
            </h6>{" "}
            <p className="card-text">{definition}</p>{" "}
            <button type="button" className="button" onClick={this.fetchAdvice}>
              <img src={catGif} alt="Cat" />
              <span className="thaifont">random</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
