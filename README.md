# Memory Master 🃏✨💎

An addictive, visually stunning memory card game with amazing animations, particle effects, and **blockchain-powered Play-to-Earn** mechanics. Built with pure HTML, CSS, JavaScript, and Web3 integration!

## How to Play

1. **Select Difficulty**: Choose between Easy (4x4), Medium (4x5), or Hard (6x6)
2. **Match Cards**: Click cards to reveal emojis and find matching pairs
3. **Build Combos**: Match cards consecutively to build combo multipliers for higher scores
4. **Beat Your Record**: Try to achieve the highest score with the fewest moves and fastest time
5. **Keyboard Shortcuts**:
   - `R` - Reset game
   - `P` or `Space` - Pause/Resume

## Features

### 🎮 Gameplay Modes

#### Free Mode
- Play unlimited games without any cost
- Track your best scores locally
- Perfect for practice and skill building

#### 💎 Play-to-Earn Mode (Blockchain)
- Connect your Web3 wallet (MetaMask)
- Pay entry fees in ETH (0.001 - 0.05 ETH)
- Win cryptocurrency rewards based on your score
- Compete on the on-chain leaderboard
- Claim your earnings anytime
- Transparent, blockchain-verified rewards

### Gameplay Features
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

### 🔗 Blockchain Features
- **Web3 Wallet Integration**: Connect via MetaMask or compatible wallets
- **Cryptocurrency Payments**: Pay entry fees in ETH
- **Smart Rewards System**: Win up to 2x-4x your entry fee based on performance
- **On-Chain Leaderboard**: Compete with players worldwide
- **Earnings Tracking**: View accumulated rewards in your wallet panel
- **One-Click Claim**: Withdraw earnings to your wallet anytime
- **Transaction History**: View all transactions on block explorer
- **Real-Time Balance**: Live ETH balance display
- **Secure**: All transactions verified on the blockchain
- **Transparent**: Open-source smart contract integration

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
- **Blockchain & Web3**:
  - Ethers.js v5 for Web3 integration
  - MetaMask wallet connectivity
  - Ethereum blockchain (testnet compatible)
  - Smart contract interaction (extensible architecture)
  - Cryptocurrency transaction handling

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

## Blockchain Setup (Optional)

To use the Play-to-Earn features:

1. **Install MetaMask**:
   - Download from [metamask.io](https://metamask.io/)
   - Create a wallet or import existing one
   - **IMPORTANT**: Use testnet for testing (Sepolia, Goerli, etc.)

2. **Get Test ETH**:
   - Switch to a testnet in MetaMask
   - Get free test ETH from faucets:
     - [Sepolia Faucet](https://sepoliafaucet.com/)
     - [Goerli Faucet](https://goerlifaucet.com/)

3. **Connect Wallet**:
   - Click "Connect Wallet" button in the game
   - Approve connection in MetaMask
   - Your balance and address will appear

4. **Play to Earn**:
   - Switch to "Play to Earn" mode
   - Select entry fee amount
   - Click "Start Game (Pay Entry)"
   - Confirm transaction in MetaMask
   - Play and win rewards!

5. **Claim Rewards**:
   - Accumulated earnings shown in wallet panel
   - Click "Claim Earnings" to withdraw
   - Confirm transaction in MetaMask

### Production Deployment

For production use with real ETH:
- Deploy smart contract to mainnet
- Update `contractAddress` in `web3-integration.js`
- Add contract ABI
- Test thoroughly on testnet first
- **Never use mainnet funds without proper security audits**

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (Chromium-based) - **Recommended for Web3**
- Firefox
- Safari
- Opera
- Brave - **Built-in Web3 support**

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

### 💎 Blockchain Rewards Formula
- **Base Reward**: 2x entry fee
- **Score Multiplier**: Up to 2x based on final score (score/1000)
- **Total Reward**: Base Reward × Score Multiplier
- **Example**: 0.01 ETH entry with 1500 score = 0.01 × 2 × 1.5 = 0.03 ETH reward
- **Leaderboard Ranking**: Top scores earn recognition on global leaderboard

## Performance

- Zero dependencies - lightweight and fast
- Smooth 60 FPS animations
- Optimized particle effects
- Efficient DOM manipulation
- LocalStorage for instant score retrieval

## Security & Disclaimer

⚠️ **IMPORTANT SECURITY NOTICE**:
- This is a demonstration/educational project
- Current implementation uses simulated blockchain transactions for demo purposes
- For production use, deploy and audit a proper smart contract
- Never use real funds without thorough security audits
- Test extensively on testnets before mainnet deployment
- Be aware of gas fees and network congestion
- Smart contract code should be audited by professionals

## Credits

Created with passion for:
- Fun, addictive gameplay
- Beautiful visual design
- Blockchain innovation
- Play-to-Earn gaming revolution

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve smart contract security
- Add more blockchain networks

## License

MIT License - Feel free to use and modify for your own projects!

---

**Enjoy the game, earn crypto rewards, and challenge your friends to beat your high scores!** 🏆💎
