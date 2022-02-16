import React, { useState } from 'react';
import { Encouragement } from './Encouragement';

// Read in from Config file
// Render Encouraging words
export const EncouragementGenerator = (props) => {
    // Declare a new state variable, which we'll call "count"
    const characterCount = Object.keys(Encouragement).length;

    const generateRandomInteger = (min : number, max : number) : number => {
        return Math.floor(Math.random()*(max - min + 1)) + min;
    }

    const getRandomCharacter = () => {
        console.log(characterCount);
        const characterIndex = generateRandomInteger(1, characterCount) - 1;
        const characterId = Object.keys(Encouragement)[characterIndex];
        const character = Encouragement[characterId];

        // Generate random phrase
        console.log(characterId);
        console.log(character);
        const phrasesCount = character.phrases.length;

        let phraseObjIndex = 0;
        if (phrasesCount > 1) {
            phraseObjIndex = generateRandomInteger(1, phrasesCount) - 1;
        }
        const phraseObj = character.phrases[phraseObjIndex];

        // Set name, portrait, text
        const dataObj = {
            characterName: character.name,
            characterPortrait: character.portrait,
            characterText: phraseObj.text,
        }
        return dataObj;
    }

    const [characterData, setCharacterData] = useState(getRandomCharacter());

    const updateCharacter = () => {
        const dataObj = getRandomCharacter();
        setCharacterData(dataObj);
    }

    return (
        <section className="encouragement-popup">
            <figure>
                <img src={characterData.characterPortrait} alt="Character Portrait"></img>
                <span>{characterData.characterName}</span>
            </figure>
            <p>{characterData.characterText}</p>
        </section>
    );
}