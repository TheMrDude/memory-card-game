# Memory Master 🃏✨

An addictive, visually stunning memory card game with amazing animations, particle effects, and engaging gameplay mechanics. Built with pure HTML, CSS, and JavaScript - no frameworks required!

## How to Play

1. **Select Difficulty**: Choose between Easy (4x4), Medium (4x5), or Hard (6x6)
2. **Match Cards**: Click cards to reveal emojis and find matching pairs
3. **Build Combos**: Match cards consecutively to build combo multipliers for higher scores
4. **Beat Your Record**: Try to achieve the highest score with the fewest moves and fastest time
5. **Keyboard Shortcuts**:
   - `R` - Reset game
   - `P` or `Space` - Pause/Resume

## Features

### Gameplay
- **3 Difficulty Levels**: Easy (16 cards), Medium (20 cards), Hard (36 cards)
- **Scoring System**: Earn points with combo bonuses and efficiency multipliers
- **Combo System**: Build streaks for massive score multipliers
- **Timer**: Track how fast you complete each game
- **Move Counter**: Monitor your efficiency
- **Pause/Resume**: Take breaks without losing progress
- **Best Score Tracking**: Records saved locally for each difficulty level

### Visual Effects
- **Stunning Gradient Backgrounds**: Beautiful purple-pink color schemes
- **Animated Title**: Bouncing letter animations
- **3D Card Flip Animations**: Smooth, perspective-based card flips
- **Particle Explosions**: Sparkling effects when you match cards
- **Floating Background Particles**: Ambient animated particles
- **Glassmorphism UI**: Modern frosted glass effect on panels
- **Smooth Transitions**: Polished animations throughout
- **Responsive Design**: Works perfectly on mobile and desktop

### Audio
- **Sound Effects**: Card flip, match, wrong, combo, and victory sounds
- **Web Audio API**: Synthesized sounds using pure JavaScript
- **Multiple Tones**: Different musical notes for various actions

### UI/UX Features
- **Beautiful Win Modal**: Celebration screen with confetti animation
- **Record Tracking**: "NEW RECORD" notification when you beat your best
- **Visual Feedback**: Cards shake on wrong matches, pulse on correct matches
- **Hover Effects**: Interactive card animations on hover
- **Combo Progress Bar**: Visual indicator of combo streak
- **Stats Dashboard**: Real-time display of score, moves, time, and combo

## Technologies Used

- **HTML5**: Semantic markup with modern structure
- **CSS3**:
  - CSS Grid & Flexbox for layouts
  - CSS Animations & Transitions
  - Gradients & Backdrop Filters
  - CSS Variables
  - Responsive Media Queries
- **Vanilla JavaScript (ES6+)**:
  - Web Audio API for sound synthesis
  - LocalStorage for score persistence
  - Event Delegation
  - DOM Manipulation
  - CSS-in-JS for dynamic styling

## Play Online

Simply open `index.html` in any modern web browser!

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/memory-card-game.git
   ```

2. Navigate to the directory:
   ```bash
   cd memory-card-game
   ```

3. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html

   # On Linux
   xdg-open index.html

   # On Windows
   start index.html
   ```

4. Start playing and try to beat your high scores!

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari
- Opera

## Game Mechanics

### Scoring Formula
- **Base Match**: 100 points
- **Combo Bonus**: +50 points per combo level
- **Efficiency Bonus**: Up to +100 points based on moves
- **Wrong Match Penalty**: -10 points

### Combo System
- Build combos by matching cards consecutively
- Combo resets on wrong matches
- Every 3rd combo triggers special sound and visual effects
- Combo bar fills up as you progress (max at 5x combo)

## Performance

- Zero dependencies - lightweight and fast
- Smooth 60 FPS animations
- Optimized particle effects
- Efficient DOM manipulation
- LocalStorage for instant score retrieval

## Credits

Created with passion for fun, addictive gameplay and beautiful visual design!

---

**Enjoy the game and challenge your friends to beat your high scores!** 🏆
