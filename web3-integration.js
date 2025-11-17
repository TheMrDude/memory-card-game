// Web3 Integration for Memory Game
// Blockchain payment and rewards system

class MemoryGameBlockchain {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.userAddress = null;
        this.contract = null;
        this.currentEntryFee = 0.001;
        this.gameMode = 'free'; // 'free' or 'paid'
        this.gamePaid = false;
        this.earnings = 0;

        // Contract configuration (mock for demo - in production, deploy actual smart contract)
        this.contractAddress = '0x0000000000000000000000000000000000000000'; // Placeholder
        this.contractABI = []; // Would contain actual ABI

        // Simulated prize pool (in production this would be from smart contract)
        this.prizePool = 0;
        this.leaderboard = [];

        this.init();
    }

    init() {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            this.setupEventListeners();
            this.checkWalletConnection();
        } else {
            console.log('Please install MetaMask!');
            this.showMetaMaskWarning();
        }
    }

    setupEventListeners() {
        // Wallet connection buttons
        document.getElementById('connect-wallet-btn').addEventListener('click', () => this.connectWallet());
        document.getElementById('disconnect-wallet-btn').addEventListener('click', () => this.disconnectWallet());

        // Game mode buttons
        document.getElementById('free-mode-btn').addEventListener('click', () => this.setGameMode('free'));
        document.getElementById('paid-mode-btn').addEventListener('click', () => this.setGameMode('paid'));

        // Entry fee selection
        document.querySelectorAll('.entry-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectEntryFee(e.target));
        });

        // Start paid game
        document.getElementById('start-paid-game').addEventListener('click', () => this.startPaidGame());

        // Claim earnings
        const claimBtn = document.getElementById('claim-earnings-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => this.claimEarnings());
        }

        // Account change detection
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnectWallet();
                } else {
                    this.userAddress = accounts[0];
                    this.updateWalletDisplay();
                    this.loadUserData();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }

    async checkWalletConnection() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    this.userAddress = accounts[0];
                    await this.setupProvider();
                    this.updateWalletDisplay();
                    this.loadUserData();
                }
            } catch (error) {
                console.error('Error checking wallet connection:', error);
            }
        }
    }

    async connectWallet() {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask to use blockchain features!');
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.userAddress = accounts[0];

            await this.setupProvider();
            this.updateWalletDisplay();
            this.loadUserData();

            // Show success notification
            this.showNotification('Wallet connected successfully! 🎉', 'success');

        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.showNotification('Failed to connect wallet. Please try again.', 'error');
        }
    }

    async setupProvider() {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();

        // Get balance
        await this.updateBalance();

        // In production, initialize contract here
        // this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);
    }

    async updateBalance() {
        if (!this.provider || !this.userAddress) return;

        try {
            const balance = await this.provider.getBalance(this.userAddress);
            const balanceInEth = ethers.utils.formatEther(balance);
            document.getElementById('wallet-balance').textContent = parseFloat(balanceInEth).toFixed(4);
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    }

    updateWalletDisplay() {
        if (this.userAddress) {
            // Show connected wallet UI
            document.getElementById('wallet-info').style.display = 'none';
            document.getElementById('wallet-connected').style.display = 'block';

            // Display shortened address
            const shortAddress = `${this.userAddress.slice(0, 6)}...${this.userAddress.slice(-4)}`;
            document.getElementById('wallet-address').textContent = shortAddress;

            // Show leaderboard in paid mode
            if (this.gameMode === 'paid') {
                document.getElementById('leaderboard-panel').style.display = 'block';
            }
        } else {
            // Show connect wallet button
            document.getElementById('wallet-info').style.display = 'block';
            document.getElementById('wallet-connected').style.display = 'none';
            document.getElementById('leaderboard-panel').style.display = 'none';
        }
    }

    disconnectWallet() {
        this.userAddress = null;
        this.provider = null;
        this.signer = null;
        this.earnings = 0;
        this.updateWalletDisplay();
        this.setGameMode('free');
        this.showNotification('Wallet disconnected', 'info');
    }

    setGameMode(mode) {
        this.gameMode = mode;

        // Update button states
        document.getElementById('free-mode-btn').classList.toggle('active', mode === 'free');
        document.getElementById('paid-mode-btn').classList.toggle('active', mode === 'paid');

        // Show/hide entry fee panel
        const entryPanel = document.getElementById('entry-fee-panel');
        const leaderboardPanel = document.getElementById('leaderboard-panel');

        if (mode === 'paid') {
            if (!this.userAddress) {
                this.showNotification('Please connect your wallet first!', 'warning');
                this.setGameMode('free');
                return;
            }
            entryPanel.style.display = 'block';
            leaderboardPanel.style.display = 'block';
            this.updatePrizePool();
        } else {
            entryPanel.style.display = 'none';
            leaderboardPanel.style.display = 'none';
        }
    }

    selectEntryFee(button) {
        // Update active state
        document.querySelectorAll('.entry-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Set entry fee
        this.currentEntryFee = parseFloat(button.dataset.fee);
        document.getElementById('your-stake').textContent = this.currentEntryFee.toFixed(3);
    }

    async startPaidGame() {
        if (!this.userAddress) {
            this.showNotification('Please connect your wallet first!', 'warning');
            return;
        }

        if (this.gamePaid) {
            this.showNotification('You already paid for this game! Finish it first.', 'info');
            return;
        }

        try {
            // Show transaction modal
            this.showTransactionModal('Sending entry fee...');

            // In production, this would interact with smart contract
            // For demo, we'll simulate a transaction
            await this.simulateTransaction(this.currentEntryFee);

            this.gamePaid = true;
            this.prizePool += this.currentEntryFee;
            this.updatePrizePool();

            this.hideTransactionModal();
            this.showNotification(`Entry fee paid! Good luck! 🍀`, 'success');

            // Trigger game start in main script
            if (typeof window.startGameWithEntry === 'function') {
                window.startGameWithEntry();
            }

        } catch (error) {
            console.error('Error starting paid game:', error);
            this.hideTransactionModal();
            this.showNotification('Transaction failed. Please try again.', 'error');
        }
    }

    async simulateTransaction(amount) {
        // Simulate blockchain transaction delay
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    // In production, actual transaction would be:
                    /*
                    const tx = await this.signer.sendTransaction({
                        to: this.contractAddress,
                        value: ethers.utils.parseEther(amount.toString())
                    });
                    await tx.wait();
                    */

                    // Update balance
                    await this.updateBalance();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 2000);
        });
    }

    async handleGameWin(score, moves, time) {
        if (this.gameMode === 'paid' && this.gamePaid) {
            // Calculate reward based on score
            const baseReward = this.currentEntryFee * 2; // 2x entry fee
            const scoreMultiplier = Math.min(score / 1000, 2); // Up to 2x based on score
            const reward = baseReward * scoreMultiplier;

            // Show blockchain reward in win modal
            document.getElementById('blockchain-reward').style.display = 'block';
            document.getElementById('reward-amount').textContent = `+${reward.toFixed(4)} ETH`;
            document.getElementById('reward-status').textContent = 'Processing reward...';

            try {
                // Simulate sending reward
                await this.simulateReward(reward);

                this.earnings += reward;
                document.getElementById('wallet-earnings').textContent = this.earnings.toFixed(4);

                // Update reward status
                document.getElementById('reward-status').textContent = '✅ Reward received!';

                // Mock transaction hash
                const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
                document.getElementById('tx-hash').style.display = 'block';
                document.getElementById('tx-link').href = `https://etherscan.io/tx/${mockTxHash}`;
                document.getElementById('tx-link').textContent = `${mockTxHash.slice(0, 10)}...`;

                // Add to leaderboard
                this.addToLeaderboard(score, reward);

                // Show claim button if earnings > 0
                if (this.earnings > 0) {
                    document.getElementById('claim-earnings-btn').style.display = 'block';
                }

                this.gamePaid = false;

            } catch (error) {
                console.error('Error sending reward:', error);
                document.getElementById('reward-status').textContent = '❌ Reward failed';
            }
        }
    }

    async simulateReward(amount) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // In production, smart contract would send reward
                resolve();
            }, 3000);
        });
    }

    async claimEarnings() {
        if (this.earnings <= 0) {
            this.showNotification('No earnings to claim!', 'info');
            return;
        }

        try {
            this.showTransactionModal(`Claiming ${this.earnings.toFixed(4)} ETH...`);

            // Simulate withdrawal
            await this.simulateTransaction(this.earnings);

            const claimedAmount = this.earnings;
            this.earnings = 0;
            document.getElementById('wallet-earnings').textContent = '0.00';
            document.getElementById('claim-earnings-btn').style.display = 'none';

            this.hideTransactionModal();
            this.showNotification(`Successfully claimed ${claimedAmount.toFixed(4)} ETH! 💰`, 'success');

            await this.updateBalance();

        } catch (error) {
            console.error('Error claiming earnings:', error);
            this.hideTransactionModal();
            this.showNotification('Failed to claim earnings. Please try again.', 'error');
        }
    }

    updatePrizePool() {
        // In production, get from smart contract
        document.getElementById('prize-pool').textContent = this.prizePool.toFixed(3);
        document.getElementById('your-stake').textContent = this.currentEntryFee.toFixed(3);
    }

    addToLeaderboard(score, earnings) {
        const entry = {
            address: this.userAddress,
            score: score,
            earnings: earnings,
            timestamp: Date.now()
        };

        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.score - a.score);

        // Save to localStorage for demo
        localStorage.setItem('memoryGame_leaderboard', JSON.stringify(this.leaderboard));

        this.updateLeaderboardDisplay();
    }

    loadUserData() {
        // Load leaderboard from localStorage
        const stored = localStorage.getItem('memoryGame_leaderboard');
        if (stored) {
            this.leaderboard = JSON.parse(stored);
            this.updateLeaderboardDisplay();
        }

        // Load user earnings
        const userEarnings = localStorage.getItem(`memoryGame_earnings_${this.userAddress}`);
        if (userEarnings) {
            this.earnings = parseFloat(userEarnings);
            document.getElementById('wallet-earnings').textContent = this.earnings.toFixed(4);

            if (this.earnings > 0) {
                document.getElementById('claim-earnings-btn').style.display = 'block';
            }
        }
    }

    updateLeaderboardDisplay() {
        const listElement = document.getElementById('leaderboard-list');
        listElement.innerHTML = '';

        const topEntries = this.leaderboard.slice(0, 10);

        if (topEntries.length === 0) {
            listElement.innerHTML = '<div class="no-entries">No entries yet. Be the first to play!</div>';
            return;
        }

        topEntries.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            if (entry.address === this.userAddress) {
                item.classList.add('user-entry');
            }

            const shortAddress = `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`;

            item.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="player-address">${shortAddress}</span>
                <span class="player-score">${entry.score}</span>
                <span class="player-earnings">${entry.earnings.toFixed(4)} ETH</span>
            `;

            listElement.appendChild(item);
        });
    }

    showTransactionModal(message) {
        const modal = document.getElementById('tx-modal');
        const messageEl = document.getElementById('tx-message');
        messageEl.textContent = message;
        modal.classList.add('active');
    }

    hideTransactionModal() {
        const modal = document.getElementById('tx-modal');
        modal.classList.remove('active');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showMetaMaskWarning() {
        const warning = document.createElement('div');
        warning.className = 'metamask-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">⚠️</span>
                <span class="warning-text">MetaMask not detected. Install MetaMask to use blockchain features!</span>
                <button class="warning-btn" onclick="window.open('https://metamask.io/download/', '_blank')">
                    Install MetaMask
                </button>
            </div>
        `;
        document.body.appendChild(warning);
    }

    getGameMode() {
        return this.gameMode;
    }

    isGamePaid() {
        return this.gamePaid;
    }

    resetGamePaid() {
        this.gamePaid = false;
    }
}

// Initialize blockchain integration
const blockchain = new MemoryGameBlockchain();

// Export for use in main script
window.memoryGameBlockchain = blockchain;
