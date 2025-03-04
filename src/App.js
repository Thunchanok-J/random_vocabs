import React from "react";
import axios from "axios";
import "./App.css";
import catGif from "./image/cat.gif";

/*class App extends React.Component {
  state = { word: "", definition: "", partOfSpeech: "" };

  /*fetchWord = () => {
    axios
      .get("https://random-word-api.herokuapp.com/word?lang=en")
      .then((res) => {
        const randomWord = res.data[0]; // ได้คำศัพท์แบบสุ่ม
        return axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`
        );
      })
      .then((response) => {
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
      .catch((error) => {
        console.error("Error fetching word:", error);
        this.fetchWord();
      });
  };*/

/*render() {
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
            <button type="button" className="button" onClick={this.fetchWord}>
              <img src={catGif} alt="Cat" />
              <span className="thaifont">random</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}*/

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      word: "",
      definition: "",
      partOfSpeech: "",
    };
    this.wordCache = new Map(); // ใช้ Map เก็บคำศัพท์ที่เคยเรียก
  }

  fetchWord = () => {
    axios
      .get("https://random-word-api.herokuapp.com/word?lang=en")
      .then((res) => {
        const randomWord = res.data?.[0];
        if (!randomWord) throw new Error("Invalid word received");

        // ถ้ามีคำนี้อยู่ใน Cache แล้ว ใช้ค่าที่เก็บไว้เลย
        if (this.wordCache.has(randomWord)) {
          console.log("Using cached word:", randomWord);
          this.setState(this.wordCache.get(randomWord));
          return;
        }

        return axios
          .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`)
          .then((response) => ({ response, randomWord }));
      })
      .then(({ response, randomWord }) => {
        if (!response || !response.data || response.data.length === 0) {
          throw new Error("Word not found in dictionary");
        }

        const wordData = response.data[0];
        const word = wordData.word || "Unknown";
        const definition =
          wordData.meanings?.[0]?.definitions?.[0]?.definition ||
          "No definition found.";
        const partOfSpeech = wordData.meanings?.[0]?.partOfSpeech || "N/A";

        console.log(word, definition, partOfSpeech);

        // บันทึกคำนี้ลง Cache
        this.wordCache.set(word, { word, definition, partOfSpeech });

        this.setState({ word, definition, partOfSpeech });
      })
      .catch((error) => {
        console.error("Error fetching word:", error);
        this.fetchWord();
      });
  };

  render() {
    const { word, definition, partOfSpeech } = this.state;

    return (
      <div className="app">
        <h1 className="title">Random Vocabulary</h1>
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h1 className="card-title">{word}</h1>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              {partOfSpeech}
            </h6>
            <p className="card-text">{definition}</p>
            <button type="button" className="button" onClick={this.fetchWord}>
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
