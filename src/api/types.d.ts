export interface RapidStatsResult {
	defaultKeyStatistics: DefaultKeyStatistics;
	financialsTemplate: FinancialsTemplate;
	price: Price;
	financialData: FinancialData;
	quoteType: QuoteType;
	calendarEvents: CalendarEvents;
	summaryDetail: SummaryDetail;
	symbol: string;
	pageViews: PageViews;
	quoteData: QuoteData;
	mktmData: MktmData;
	facScore?: string | number;
}

export interface CalendarEvents {
	maxAge: number;
	earnings: Earnings;
	exDividendDate: MktmData;
	dividendDate: MktmData;
}

type MktmData = {};

export interface Earnings {
	earningsDate: RawFmt[];
	earningsAverage: RawFmt;
	earningsLow: RawFmt;
	earningsHigh: RawFmt;
	revenueAverage: EnterpriseValue;
	revenueLow: EnterpriseValue;
	revenueHigh: EnterpriseValue;
}

export interface RawFmt {
	raw: number;
	fmt: string;
}

export interface EnterpriseValue {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface DefaultKeyStatistics {
	annualHoldingsTurnover: MktmData;
	enterpriseToRevenue: RawFmt;
	beta3Year: MktmData;
	profitMargins: RawFmt;
	enterpriseToEbitda: RawFmt;
	'52WeekChange': RawFmt;
	morningStarRiskRating: MktmData;
	forwardEps: RawFmt;
	revenueQuarterlyGrowth: MktmData;
	sharesOutstanding: EnterpriseValue;
	fundInceptionDate: MktmData;
	annualReportExpenseRatio: MktmData;
	totalAssets: MktmData;
	bookValue: RawFmt;
	sharesShort: EnterpriseValue;
	sharesPercentSharesOut: RawFmt;
	fundFamily: null;
	lastFiscalYearEnd: RawFmt;
	heldPercentInstitutions: RawFmt;
	netIncomeToCommon: EnterpriseValue;
	trailingEps: RawFmt;
	lastDividendValue: MktmData;
	SandP52WeekChange: RawFmt;
	priceToBook: RawFmt;
	heldPercentInsiders: RawFmt;
	nextFiscalYearEnd: RawFmt;
	yield: MktmData;
	mostRecentQuarter: RawFmt;
	shortRatio: RawFmt;
	sharesShortPreviousMonthDate: RawFmt;
	floatShares: EnterpriseValue;
	beta: RawFmt;
	enterpriseValue: EnterpriseValue;
	priceHint: EnterpriseValue;
	threeYearAverageReturn: MktmData;
	lastSplitDate: RawFmt;
	lastSplitFactor: string;
	legalType: null;
	morningStarOverallRating: MktmData;
	earningsQuarterlyGrowth: RawFmt;
	priceToSalesTrailing12Months: MktmData;
	dateShortInterest: RawFmt;
	pegRatio: RawFmt;
	ytdReturn: MktmData;
	forwardPE: RawFmt;
	maxAge: number;
	lastCapGain: MktmData;
	shortPercentOfFloat: RawFmt;
	sharesShortPriorMonth: EnterpriseValue;
	category: null;
	fiveYearAverageReturn: MktmData;
}

export interface FinancialData {
	ebitdaMargins: RawFmt;
	profitMargins: RawFmt;
	grossMargins: RawFmt;
	operatingCashflow: EnterpriseValue;
	revenueGrowth: RawFmt;
	operatingMargins: RawFmt;
	ebitda: EnterpriseValue;
	targetLowPrice: RawFmt;
	recommendationKey: string;
	grossProfits: EnterpriseValue;
	freeCashflow: EnterpriseValue;
	targetMedianPrice: RawFmt;
	currentPrice: RawFmt;
	earningsGrowth: RawFmt;
	currentRatio: RawFmt;
	returnOnAssets: RawFmt;
	numberOfAnalystOpinions: EnterpriseValue;
	targetMeanPrice: RawFmt;
	debtToEquity: RawFmt;
	returnOnEquity: RawFmt;
	targetHighPrice: RawFmt;
	totalCash: EnterpriseValue;
	totalDebt: EnterpriseValue;
	totalRevenue: EnterpriseValue;
	totalCashPerShare: RawFmt;
	financialCurrency: string;
	maxAge: number;
	revenuePerShare: RawFmt;
	quickRatio: RawFmt;
	recommendationMean: RawFmt;
}

export interface FinancialsTemplate {
	code: string;
	maxAge: number;
}

export interface PageViews {
	shortTermTrend: string;
	midTermTrend: string;
	longTermTrend: string;
	maxAge: number;
}

export interface Price {
	quoteSourceName: string;
	regularMarketOpen: RawFmt;
	averageDailyVolume3Month: EnterpriseValue;
	exchange: string;
	regularMarketTime: number;
	volume24Hr: MktmData;
	regularMarketDayHigh: RawFmt;
	shortName: string;
	averageDailyVolume10Day: EnterpriseValue;
	longName: string;
	regularMarketChange: RawFmt;
	currencySymbol: string;
	regularMarketPreviousClose: RawFmt;
	postMarketTime: number;
	preMarketPrice: RawFmt;
	preMarketTime: number;
	exchangeDataDelayedBy: number;
	toCurrency: null;
	postMarketChange: RawFmt;
	postMarketPrice: RawFmt;
	exchangeName: string;
	preMarketChange: RawFmt;
	circulatingSupply: MktmData;
	regularMarketDayLow: RawFmt;
	priceHint: EnterpriseValue;
	currency: string;
	regularMarketPrice: RawFmt;
	regularMarketVolume: EnterpriseValue;
	lastMarket: null;
	regularMarketSource: string;
	openInterest: MktmData;
	marketState: string;
	underlyingSymbol: null;
	marketCap: EnterpriseValue;
	quoteType: string;
	preMarketChangePercent: RawFmt;
	volumeAllCurrencies: MktmData;
	postMarketSource: string;
	strikePrice: MktmData;
	symbol: string;
	postMarketChangePercent: RawFmt;
	preMarketSource: string;
	maxAge: number;
	fromCurrency: null;
	regularMarketChangePercent: RawFmt;
}

export interface QuoteData {
	sourceInterval: number;
	quoteSourceName: string;
	regularMarketOpen: RawFmt;
	exchange: string;
	regularMarketTime: RawFmt;
	fiftyTwoWeekRange: Range;
	sharesOutstanding: EnterpriseValue;
	regularMarketDayHigh: RawFmt;
	shortName: string;
	longName: string;
	exchangeTimezoneName: string;
	regularMarketChange: RawFmt;
	regularMarketPreviousClose: RawFmt;
	fiftyTwoWeekHighChange: RawFmt;
	exchangeTimezoneShortName: string;
	fiftyTwoWeekLowChange: RawFmt;
	exchangeDataDelayedBy: number;
	regularMarketDayLow: RawFmt;
	priceHint: number;
	currency: string;
	regularMarketPrice: RawFmt;
	regularMarketVolume: EnterpriseValue;
	isLoading: boolean;
	triggerable: boolean;
	gmtOffSetMilliseconds: number;
	firstTradeDateMilliseconds: number;
	region: string;
	marketState: string;
	marketCap: EnterpriseValue;
	quoteType: string;
	invalid: boolean;
	symbol: string;
	language: string;
	fiftyTwoWeekLowChangePercent: RawFmt;
	regularMarketDayRange: Range;
	messageBoardId: string;
	fiftyTwoWeekHigh: RawFmt;
	fiftyTwoWeekHighChangePercent: RawFmt;
	uuid: string;
	market: string;
	fiftyTwoWeekLow: RawFmt;
	regularMarketChangePercent: RawFmt;
	fullExchangeName: string;
	tradeable: boolean;
}

export interface Range {
	raw: string;
	fmt: string;
}

export interface QuoteType {
	exchange: string;
	shortName: string;
	longName: string;
	exchangeTimezoneName: string;
	exchangeTimezoneShortName: string;
	isEsgPopulated: boolean;
	gmtOffSetMilliseconds: string;
	quoteType: string;
	symbol: string;
	messageBoardId: string;
	market: string;
}

export interface SummaryDetail {
	previousClose: RawFmt;
	regularMarketOpen: RawFmt;
	twoHundredDayAverage: RawFmt;
	trailingAnnualDividendYield: MktmData;
	payoutRatio: RawFmt;
	volume24Hr: MktmData;
	regularMarketDayHigh: RawFmt;
	navPrice: MktmData;
	averageDailyVolume10Day: EnterpriseValue;
	totalAssets: MktmData;
	regularMarketPreviousClose: RawFmt;
	fiftyDayAverage: RawFmt;
	trailingAnnualDividendRate: MktmData;
	open: RawFmt;
	toCurrency: null;
	averageVolume10days: EnterpriseValue;
	expireDate: MktmData;
	yield: MktmData;
	algorithm: null;
	dividendRate: MktmData;
	exDividendDate: MktmData;
	beta: RawFmt;
	circulatingSupply: MktmData;
	startDate: MktmData;
	regularMarketDayLow: RawFmt;
	priceHint: EnterpriseValue;
	currency: string;
	trailingPE: RawFmt;
	regularMarketVolume: EnterpriseValue;
	lastMarket: null;
	maxSupply: MktmData;
	openInterest: MktmData;
	marketCap: EnterpriseValue;
	volumeAllCurrencies: MktmData;
	strikePrice: MktmData;
	averageVolume: EnterpriseValue;
	priceToSalesTrailing12Months: RawFmt;
	dayLow: RawFmt;
	ask: RawFmt;
	ytdReturn: MktmData;
	askSize: EnterpriseValue;
	volume: EnterpriseValue;
	fiftyTwoWeekHigh: RawFmt;
	forwardPE: RawFmt;
	maxAge: number;
	fromCurrency: null;
	fiveYearAvgDividendYield: MktmData;
	fiftyTwoWeekLow: RawFmt;
	bid: RawFmt;
	tradeable: boolean;
	dividendYield: MktmData;
	bidSize: EnterpriseValue;
	dayHigh: RawFmt;
}
