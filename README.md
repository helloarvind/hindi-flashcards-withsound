# Hindi Flashcards

A modern, interactive web application for learning and practicing Hindi vocabulary with English translations. Designed for ease of use and maximum engagement, this app lets you review, search, create, and track flashcards, complete with sound and statistics.

---

## ✨ Features

- **Review Flashcards**: Practice Hindi words with a 3D flip animation. Cards are shuffled and may show correct or incorrect translations for challenge.
- **Sound Support**: Click the sound icon to hear the Hindi or English word spoken aloud using the Web Speech API. Toggle sound on/off as needed.
- **Search**: Instantly search your flashcards by Hindi or English text.
- **Statistics**: View your review history, accuracy, and a chart of your learning progress. Stats are stored locally and updated in real time.
- **Create Cards**: Add new flashcards using a custom virtual Hindi keyboard for accurate input.
- **Responsive Design**: Optimized for both desktop and mobile, with a sidebar on desktop and overlay menu on mobile.
- **Persistent Storage**: All flashcards and stats are saved in your browser (localStorage).
- **Accessibility**: Keyboard navigation for review and card flipping; visually clear icons and feedback.

---

## 🖥️ Screens & Navigation

- **Review**: Play through flashcards, flip to check answers, mark correct/incorrect, and listen to pronunciations.
- **Search**: Filter cards by Hindi or English. Results update as you type.
- **Stats**: See total reviews, accuracy, and a chart (powered by Chart.js) of your progress. Review history table included.
- **Create**: Add new cards. The Hindi field supports a virtual keyboard for easy input.

---

## 🔊 Sound Icon & Speech Synthesis
- The sound icon toggles text-to-speech for the current card (Hindi or English, depending on flip state).
- Uses browser's Web Speech API. Works in Chrome, Edge, Safari, and most modern browsers.
- Sound can be enabled/disabled and persists between sessions.

---

## 🗂️ Project Structure

- `src/App.jsx` - Main React component, routing, state, and logic for all screens.
- `src/keyboard.jsx` - Virtual Hindi keyboard for card creation.
- `src/data.js` - Preloaded flashcards.
- `src/App.css` - Custom styles for layout, animation, and responsive design.
- `public/` - Static assets.
- `index.html` - App entry point.

---

## 🚀 Getting Started (Local Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app locally:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` by default.

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment

- The app is deployed on GitHub Pages:
  [https://helloarvind.github.io/hindi-flashcards-withsound](https://helloarvind.github.io/hindi-flashcards-withsound)
- To deploy your own version, push to a GitHub repo and use GitHub Pages or any static hosting service.

---

## ⚙️ Configuration & Customization

- **Add/Edit Flashcards:** Use the Create screen. All data is stored in your browser.
- **Sound:** Toggle sound using the icon in the Review screen. Requires browser support for Web Speech API.
- **Stats Reset:** Clear browser localStorage to reset all progress and cards.

---

## 🧪 Testing

- No automated tests are included by default. For best results, test in Chrome and Safari for full speech support.
- Manual testing: Try all screens, add/search/review cards, and check stats.

---

## 🛠️ Contributing & Issues

- Contributions are welcome! Fork the repo, make changes, and submit a pull request.
- For issues or feature requests, open an issue on GitHub.

---

## 📋 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Chart.js](https://www.chartjs.org/)
- [MDN Web Docs - Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

Enjoy learning Hindi! 🇮🇳
