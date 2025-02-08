const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    let coins = [];
    if (fs.existsSync('coins.json')) {
      coins = JSON.parse(fs.readFileSync('coins.json', 'utf-8'));
    } else {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: 'omisego, filecoin, axie-infinity, spell-token, audius, terra-luna-v2, flow, enjincoin, holo, neo, gala, the-graph, synthetix-network-token, fantom, eos, loopring, uma, amp, worldcoin, decentraland, kava, optimism, holo, ocean-protocol, iexec-rlc, arpa, algorand, aave, lido-dao, superfarm, move-network, sushi',
          order: 'market_cap_desc',
          per_page: 30,
          page: 1,
          sparkline: false,
        },
      });
      coins = response.data;
      fs.writeFileSync('coins.json', JSON.stringify(coins, null, 2), 'utf-8');
    }

    res.render('index', { coins });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
