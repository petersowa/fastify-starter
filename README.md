# Investment Tracking App using Fastify and Svelte

.env file is needed for private settings to run app.

Sample format for .env file:

'''
MONGODB_NAME = 'mongodb+srv://xxx'
SESSION_SECRET = 'xxx'
IEX_TOKEN = 'xxx'
IEX_URL = 'https://cloud.iexapis.com/v1'
'''

After .env file is added run dev server with 'npm run dev', it is configured to run on localhost:3999 by default.

Test server side app with svelte client code and handlebar templates.

<p align='center'>
<img src='https://i.ibb.co/pLyHRB3/Inv-App-Screen-Shot.jpg' width='600' alt='investment app'>
</p>

Backend is using fastify.
Connecting to mongo db via mongoose.

Client is responsive with mobile and desktop views.
Uses CSS for styling core server html.

# Using IEX data:

```
avgTotalVolume: 8377844
calculationPrice: "tops"
change: -0.65
changePercent: -0.00487
close: null
closeSource: "official"
closeTime: null
companyName: "Beyond Meat, Inc."
delayedPrice: null
delayedPriceTime: null
extendedChange: null
extendedChangePercent: null
extendedPrice: null
extendedPriceTime: null
high: null
highSource: "15 minute delayed price"
highTime: 1589221310913
iexAskPrice: 141
iexAskSize: 100
iexBidPrice: 125.57
iexBidSize: 1100
iexClose: 132.86
iexCloseTime: 1589222196898
iexLastUpdated: 1589222196898
iexMarketPercent: 0.0082049016523041
iexOpen: null
iexOpenTime: null
iexRealtimePrice: 132.86
iexRealtimeSize: 100
iexVolume: 108686
isUSMarketOpen: true
lastTradeTime: 1589222196898
latestPrice: 132.86
latestSource: "IEX real time price"
latestTime: "2:36:36 PM"
latestUpdate: 1589222196898
latestVolume: null
low: null
lowSource: "15 minute delayed price"
lowTime: 1589203801716
marketCap: 8217258140
oddLotDelayedPrice: null
oddLotDelayedPriceTime: null
open: null
openSource: "official"
openTime: null
peRatio: -875.81
previousClose: 133.51
previousVolume: 22524851
primaryExchange: "NASDAQ"
symbol: "BYND"
volume: null
week52High: 239.71
week52Low: 48.18
ytdChange: 0.7465299999999999
```

# RESOURCES

-   https://codechips.me/how-to-use-typescript-with-svelte/

# TODO

-   [ ] Add Sapper
-   [x] Implement modal for buy transaction when selected
-   [ ] Use svelte routing
-   [x] Create a modal store to fix issue with buy modal display
-   [x] test

# IDEAS

-   USE WEBSOCKET to register data updates from server
-   Server will monitor connection and send updates to client when data changes
-   Server will also be able to update db with any updates or calculations
-   Create Admin Monitor for user list, db usage, stats
