import React from "react";
import "./App.css";

// Hindi Virtual Keyboard Component
const HindiKeyboard = ({ onKeyPress }) => {
  // Hindi consonants (vyanjan)
  const hindiConsonants = [
    'क', 'ख', 'ग', 'घ', 'ङ',
    'च', 'छ', 'ज', 'झ', 'ञ',
    'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म',
    'य', 'र', 'ल', 'व', 'श',
    'ष', 'स', 'ह',
  ];

  // Hindi vowels (swar)
  const hindiVowels = [
    'अ', 'आ', 'इ', 'ई', 'उ',
    'ऊ', 'ए', 'ऐ', 'ओ', 'औ',
    'अं', 'अः',
  ];

  // Hindi vowel signs (matra)
  const hindiMatras = [
    'ा', 'ि', 'ी', 'ु', 'ू',
    'े', 'ै', 'ो', 'ौ', 'ं', 'ः',
    '्',
  ];

  // Hindi numerals
  const hindiNumerals = [
    '०', '१', '२', '३', '४',
    '५', '६', '७', '८', '९',
  ];

  // Special characters
  const specialChars = [
    '।', '॥', ',', '.', '?', '!',
    '-', '(', ')', ' '
  ];

  const renderKeys = (keys, rowClass) => (
    <div className={rowClass}>
      {keys.map((key, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onKeyPress(key)}
          className="keyboard-key"
        >
          {key}
        </button>
      ))}
    </div>
  );

  return (
    <div className="keyboard-container">
      <div className="keyboard-section">
        <h4 className="keyboard-title">Vowels (स्वर)</h4>
        {renderKeys(hindiVowels, "keyboard-row")}
      </div>
      <div className="keyboard-section">
        <h4 className="keyboard-title">Vowel Signs (मात्रा)</h4>
        {renderKeys(hindiMatras, "keyboard-row")}
      </div>
      <div className="keyboard-section">
        <h4 className="keyboard-title">Consonants (व्यंजन)</h4>
        <div className="consonant-grid">
          {hindiConsonants.map((key, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onKeyPress(key)}
              className="keyboard-key"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <div className="keyboard-section">
        <h4 className="keyboard-title">Numerals & Special</h4>
        <div className="keyboard-row">
          {renderKeys(hindiNumerals.concat(specialChars), "keyboard-row")}
        </div>
      </div>
      <div className="keyboard-actions">
        <button
          type="button"
          onClick={() => onKeyPress('BACKSPACE')}
          className="keyboard-key keyboard-action-btn"
        >
          Backspace
        </button>
        <button
          type="button"
          onClick={() => onKeyPress('SPACE')}
          className="keyboard-key keyboard-action-btn"
        >
          Space
        </button>
      </div>
    </div>
  );
};

export default HindiKeyboard;
