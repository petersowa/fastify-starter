export interface RapidStatsResult {
	quoteType: QuoteType;
	symbol: string;
	price: Price;
	summaryDetail: SummaryDetail;
	pageViews: PageViews;
	defaultKeyStatistics: DefaultKeyStatistics;
	financialData: FinancialData;
	calendarEvents: CalendarEvents;
	quoteData: QuoteData;
	mktmData: MktmData;
	facScore: number | string;
}

export interface QuoteType {
	exchange: string;
	shortName: string;
	longName: string;
	exchangeTimezoneName: string;
	exchangeTimezoneShortName: string;
	isEsgPopulated: boolean;
	gmtOffSetMilliseconds: string;
	underlyingSymbol: any;
	quoteType: string;
	symbol: string;
	underlyingExchangeSymbol: any;
	headSymbol: any;
	messageBoardId: string;
	uuid: string;
	market: string;
}

export interface Price {
	quoteSourceName: string;
	regularMarketOpen: RegularMarketOpen;
	averageDailyVolume3Month: AverageDailyVolume3Month;
	exchange: string;
	regularMarketTime: number;
	volume24Hr: Volume24Hr;
	regularMarketDayHigh: RegularMarketDayHigh;
	shortName: string;
	averageDailyVolume10Day: AverageDailyVolume10Day;
	longName: string;
	regularMarketChange: RegularMarketChange;
	currencySymbol: string;
	regularMarketPreviousClose: RegularMarketPreviousClose;
	postMarketTime: number;
	preMarketPrice: PreMarketPrice;
	exchangeDataDelayedBy: number;
	postMarketChange: PostMarketChange;
	postMarketPrice: PostMarketPrice;
	exchangeName: string;
	preMarketChange: PreMarketChange;
	circulatingSupply: CirculatingSupply;
	regularMarketDayLow: RegularMarketDayLow;
	priceHint: PriceHint;
	currency: string;
	regularMarketPrice: RegularMarketPrice;
	regularMarketVolume: RegularMarketVolume;
	lastMarket: any;
	regularMarketSource: string;
	openInterest: OpenInterest;
	marketState: string;
	underlyingSymbol: any;
	marketCap: MarketCap;
	quoteType: string;
	volumeAllCurrencies: VolumeAllCurrencies;
	postMarketSource: string;
	strikePrice: StrikePrice;
	symbol: string;
	postMarketChangePercent: PostMarketChangePercent;
	preMarketSource: string;
	maxAge: number;
	fromCurrency: any;
	regularMarketChangePercent: RegularMarketChangePercent;
}

export interface RegularMarketOpen {
	raw: number;
	fmt: string;
}

export interface AverageDailyVolume3Month {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface Volume24Hr {
	raw: number;
	fmt: string;
}

export interface RegularMarketDayHigh {
	raw: number;
	fmt: string;
}

export interface AverageDailyVolume10Day {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface RegularMarketChange {
	raw: number;
	fmt: string;
}

export interface RegularMarketPreviousClose {
	raw: number;
	fmt: string;
}

export interface PreMarketPrice {
	raw: number;
	fmt: string;
}

export interface PostMarketChange {
	raw: number;
	fmt: string;
}

export interface PostMarketPrice {
	raw: number;
	fmt: string;
}

export interface PreMarketChange {
	raw: number;
	fmt: string;
}

export interface CirculatingSupply {
	raw: number;
	fmt: string;
}

export interface RegularMarketDayLow {
	raw: number;
	fmt: string;
}

export interface PriceHint {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface RegularMarketPrice {
	raw: number;
	fmt: string;
}

export interface RegularMarketVolume {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface OpenInterest {
	raw: number;
	fmt: string;
}

export interface MarketCap {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface VolumeAllCurrencies {
	raw: number;
	fmt: string;
}

export interface StrikePrice {
	raw: number;
	fmt: string;
}

export interface PostMarketChangePercent {
	raw: number;
	fmt: string;
}

export interface RegularMarketChangePercent {
	raw: number;
	fmt: string;
}

export interface SummaryDetail {
	previousClose: PreviousClose;
	regularMarketOpen: RegularMarketOpen2;
	twoHundredDayAverage: TwoHundredDayAverage;
	trailingAnnualDividendYield: TrailingAnnualDividendYield;
	payoutRatio: PayoutRatio;
	volume24Hr: Volume24Hr2;
	regularMarketDayHigh: RegularMarketDayHigh2;
	navPrice: NavPrice;
	averageDailyVolume10Day: AverageDailyVolume10Day2;
	totalAssets: TotalAssets;
	regularMarketPreviousClose: RegularMarketPreviousClose2;
	fiftyDayAverage: FiftyDayAverage;
	trailingAnnualDividendRate: TrailingAnnualDividendRate;
	open: Open;
	averageVolume10days: AverageVolume10days;
	expireDate: ExpireDate;
	yield: Yield;
	algorithm: any;
	dividendRate: DividendRate;
	exDividendDate: ExDividendDate;
	beta: Beta;
	circulatingSupply: CirculatingSupply2;
	startDate: StartDate;
	regularMarketDayLow: RegularMarketDayLow2;
	priceHint: PriceHint2;
	currency: string;
	regularMarketVolume: RegularMarketVolume2;
	lastMarket: any;
	maxSupply: MaxSupply;
	openInterest: OpenInterest2;
	marketCap: MarketCap2;
	volumeAllCurrencies: VolumeAllCurrencies2;
	strikePrice: StrikePrice2;
	averageVolume: AverageVolume;
	priceToSalesTrailing12Months: PriceToSalesTrailing12Months;
	dayLow: DayLow;
	ask: Ask;
	ytdReturn: YtdReturn;
	askSize: AskSize;
	volume: Volume;
	fiftyTwoWeekHigh: FiftyTwoWeekHigh;
	forwardPE: ForwardPe;
	maxAge: number;
	fromCurrency: any;
	fiveYearAvgDividendYield: FiveYearAvgDividendYield;
	fiftyTwoWeekLow: FiftyTwoWeekLow;
	bid: Bid;
	tradeable: boolean;
	dividendYield: DividendYield;
	bidSize: BidSize;
	dayHigh: DayHigh;
}

export interface PreviousClose {
	raw: number;
	fmt: string;
}

export interface RegularMarketOpen2 {
	raw: number;
	fmt: string;
}

export interface TwoHundredDayAverage {
	raw: number;
	fmt: string;
}

export interface TrailingAnnualDividendYield {
	raw: number;
	fmt: string;
}

export interface PayoutRatio {
	raw: number;
	fmt: string;
}

export interface Volume24Hr2 {
	raw: number;
	fmt: string;
}

export interface RegularMarketDayHigh2 {
	raw: number;
	fmt: string;
}

export interface NavPrice {
	raw: number;
	fmt: string;
}

export interface AverageDailyVolume10Day2 {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface TotalAssets {
	raw: number;
	fmt: string;
}

export interface RegularMarketPreviousClose2 {
	raw: number;
	fmt: string;
}

export interface FiftyDayAverage {
	raw: number;
	fmt: string;
}

export interface TrailingAnnualDividendRate {
	raw: number;
	fmt: string;
}

export interface Open {
	raw: number;
	fmt: string;
}

export interface AverageVolume10days {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface ExpireDate {
	raw: number;
	fmt: string;
}

export interface Yield {
	raw: number;
	fmt: string;
}

export interface DividendRate {
	raw: number;
	fmt: string;
}

export interface ExDividendDate {
	raw: number;
	fmt: string;
}

export interface Beta {
	raw: number;
	fmt: string;
}

export interface CirculatingSupply2 {
	raw: number;
	fmt: string;
}

export interface StartDate {
	raw: number;
	fmt: string;
}

export interface RegularMarketDayLow2 {
	raw: number;
	fmt: string;
}

export interface PriceHint2 {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface RegularMarketVolume2 {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface MaxSupply {
	raw: number;
	fmt: string;
}

export interface OpenInterest2 {
	raw: number;
	fmt: string;
}

export interface MarketCap2 {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface VolumeAllCurrencies2 {
	raw: number;
	fmt: string;
}

export interface StrikePrice2 {
	raw: number;
	fmt: string;
}

export interface AverageVolume {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface PriceToSalesTrailing12Months {
	raw: number;
	fmt: string;
}

export interface DayLow {
	raw: number;
	fmt: string;
}

export interface Ask {
	raw: number;
	fmt: string;
}

export interface YtdReturn {
	raw: number;
	fmt: string;
}

export interface AskSize {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface Volume {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface FiftyTwoWeekHigh {
	raw: number;
	fmt: string;
}

export interface ForwardPe {
	raw: number;
	fmt: string;
}

export interface FiveYearAvgDividendYield {
	raw: number;
	fmt: string;
}

export interface FiftyTwoWeekLow {
	raw: number;
	fmt: string;
}

export interface Bid {
	raw: number;
	fmt: string;
}

export interface DividendYield {
	raw: number;
	fmt: string;
}

export interface BidSize {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface DayHigh {
	raw: number;
	fmt: string;
}

export interface PageViews {
	shortTermTrend: string;
	midTermTrend: string;
	longTermTrend: string;
	maxAge: number;
}

export interface DefaultKeyStatistics {
	annualHoldingsTurnover: AnnualHoldingsTurnover;
	enterpriseToRevenue: EnterpriseToRevenue;
	beta3Year: Beta3Year;
	profitMargins: ProfitMargins;
	enterpriseToEbitda: EnterpriseToEbitda;
	'52WeekChange': N52WeekChange;
	morningStarRiskRating: MorningStarRiskRating;
	forwardEps: ForwardEps;
	revenueQuarterlyGrowth: RevenueQuarterlyGrowth;
	sharesOutstanding: SharesOutstanding;
	fundInceptionDate: FundInceptionDate;
	annualReportExpenseRatio: AnnualReportExpenseRatio;
	totalAssets: TotalAssets2;
	bookValue: BookValue;
	sharesShort: SharesShort;
	sharesPercentSharesOut: SharesPercentSharesOut;
	fundFamily: any;
	lastFiscalYearEnd: LastFiscalYearEnd;
	heldPercentInstitutions: HeldPercentInstitutions;
	netIncomeToCommon: NetIncomeToCommon;
	trailingEps: TrailingEps;
	lastDividendValue: LastDividendValue;
	SandP52WeekChange: SandP52WeekChange;
	priceToBook: PriceToBook;
	heldPercentInsiders: HeldPercentInsiders;
	nextFiscalYearEnd: NextFiscalYearEnd;
	yield: Yield2;
	mostRecentQuarter: MostRecentQuarter;
	shortRatio: ShortRatio;
	sharesShortPreviousMonthDate: SharesShortPreviousMonthDate;
	floatShares: FloatShares;
	beta: Beta2;
	enterpriseValue: EnterpriseValue;
	priceHint: PriceHint3;
	threeYearAverageReturn: ThreeYearAverageReturn;
	lastSplitDate: LastSplitDate;
	lastSplitFactor: string;
	legalType: any;
	morningStarOverallRating: MorningStarOverallRating;
	earningsQuarterlyGrowth: EarningsQuarterlyGrowth;
	priceToSalesTrailing12Months: PriceToSalesTrailing12Months2;
	dateShortInterest: DateShortInterest;
	pegRatio: PegRatio;
	ytdReturn: YtdReturn2;
	forwardPE: ForwardPe2;
	maxAge: number;
	lastCapGain: LastCapGain;
	shortPercentOfFloat: ShortPercentOfFloat;
	sharesShortPriorMonth: SharesShortPriorMonth;
	category: any;
	fiveYearAverageReturn: FiveYearAverageReturn;
}

export interface AnnualHoldingsTurnover {
	raw: number;
	fmt: string;
}

export interface EnterpriseToRevenue {
	raw: number;
	fmt: string;
}

export interface Beta3Year {
	raw: number;
	fmt: string;
}

export interface ProfitMargins {
	raw: number;
	fmt: string;
}

export interface EnterpriseToEbitda {
	raw: number;
	fmt: string;
}

export interface N52WeekChange {
	raw: number;
	fmt: string;
}

export interface MorningStarRiskRating {
	raw: number;
	fmt: string;
}

export interface ForwardEps {
	raw: number;
	fmt: string;
}

export interface RevenueQuarterlyGrowth {
	raw: number;
	fmt: string;
}

export interface SharesOutstanding {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface FundInceptionDate {
	raw: number;
	fmt: string;
}

export interface AnnualReportExpenseRatio {
	raw: number;
	fmt: string;
}

export interface TotalAssets2 {
	raw: number;
	fmt: string;
}

export interface BookValue {
	raw: number;
	fmt: string;
}

export interface SharesShort {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface SharesPercentSharesOut {
	raw: number;
	fmt: string;
}

export interface LastFiscalYearEnd {
	raw: number;
	fmt: string;
}

export interface HeldPercentInstitutions {
	raw: number;
	fmt: string;
}

export interface NetIncomeToCommon {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface TrailingEps {
	raw: number;
	fmt: string;
}

export interface LastDividendValue {
	raw: number;
	fmt: string;
}

export interface SandP52WeekChange {
	raw: number;
	fmt: string;
}

export interface PriceToBook {
	raw: number;
	fmt: string;
}

export interface HeldPercentInsiders {
	raw: number;
	fmt: string;
}

export interface NextFiscalYearEnd {
	raw: number;
	fmt: string;
}

export interface Yield2 {
	raw: number;
	fmt: string;
}

export interface MostRecentQuarter {
	raw: number;
	fmt: string;
}

export interface ShortRatio {
	raw: number;
	fmt: string;
}

export interface SharesShortPreviousMonthDate {
	raw: number;
	fmt: string;
}

export interface FloatShares {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface Beta2 {
	raw: number;
	fmt: string;
}

export interface EnterpriseValue {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface PriceHint3 {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface ThreeYearAverageReturn {
	raw: number;
	fmt: string;
}

export interface LastSplitDate {
	raw: number;
	fmt: string;
}

export interface MorningStarOverallRating {
	raw: number;
	fmt: string;
}

export interface EarningsQuarterlyGrowth {
	raw: number;
	fmt: string;
}

export interface PriceToSalesTrailing12Months2 {
	raw: number;
	fmt: string;
}

export interface DateShortInterest {
	raw: number;
	fmt: string;
}

export interface PegRatio {
	raw: number;
	fmt: string;
}

export interface YtdReturn2 {
	raw: number;
	fmt: string;
}

export interface ForwardPe2 {
	raw: number;
	fmt: string;
}

export interface LastCapGain {
	raw: number;
	fmt: string;
}

export interface ShortPercentOfFloat {
	raw: number;
	fmt: string;
}

export interface SharesShortPriorMonth {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface FiveYearAverageReturn {
	raw: number;
	fmt: string;
}

export interface FinancialData {
	ebitdaMargins: EbitdaMargins;
	profitMargins: ProfitMargins2;
	grossMargins: GrossMargins;
	operatingCashflow: OperatingCashflow;
	revenueGrowth: RevenueGrowth;
	operatingMargins: OperatingMargins;
	ebitda: Ebitda;
	targetLowPrice: TargetLowPrice;
	recommendationKey: string;
	grossProfits: GrossProfits;
	freeCashflow: FreeCashflow;
	targetMedianPrice: TargetMedianPrice;
	currentPrice: CurrentPrice;
	earningsGrowth: EarningsGrowth;
	currentRatio: CurrentRatio;
	returnOnAssets: ReturnOnAssets;
	numberOfAnalystOpinions: NumberOfAnalystOpinions;
	targetMeanPrice: TargetMeanPrice;
	debtToEquity: DebtToEquity;
	returnOnEquity: ReturnOnEquity;
	targetHighPrice: TargetHighPrice;
	totalCash: TotalCash;
	totalDebt: TotalDebt;
	totalRevenue: TotalRevenue;
	totalCashPerShare: TotalCashPerShare;
	financialCurrency: string;
	maxAge: number;
	revenuePerShare: RevenuePerShare;
	quickRatio: QuickRatio;
	recommendationMean: RecommendationMean;
}

export interface EbitdaMargins {
	raw: number;
	fmt: string;
}

export interface ProfitMargins2 {
	raw: number;
	fmt: string;
}

export interface GrossMargins {
	raw: number;
	fmt: string;
}

export interface OperatingCashflow {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface RevenueGrowth {
	raw: number;
	fmt: string;
}

export interface OperatingMargins {
	raw: number;
	fmt: string;
}

export interface Ebitda {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface TargetLowPrice {
	raw: number;
	fmt: string;
}

export interface GrossProfits {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface FreeCashflow {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface TargetMedianPrice {
	raw: number;
	fmt: string;
}

export interface CurrentPrice {
	raw: number;
	fmt: string;
}

export interface EarningsGrowth {
	raw: number;
	fmt: string;
}

export interface CurrentRatio {
	raw: number;
	fmt: string;
}

export interface ReturnOnAssets {
	raw: number;
	fmt: string;
}

export interface NumberOfAnalystOpinions {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface TargetMeanPrice {
	raw: number;
	fmt: string;
}

export interface DebtToEquity {
	raw: number;
	fmt: string;
}

export interface ReturnOnEquity {
	raw: number;
	fmt: string;
}

export interface TargetHighPrice {
	raw: number;
	fmt: string;
}

export interface TotalCash {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface TotalDebt {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface TotalRevenue {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface TotalCashPerShare {
	raw: number;
	fmt: string;
}

export interface RevenuePerShare {
	raw: number;
	fmt: string;
}

export interface QuickRatio {
	raw: number;
	fmt: string;
}

export interface RecommendationMean {
	raw: number;
	fmt: string;
}

export interface CalendarEvents {
	maxAge: number;
	earnings: Earnings;
	exDividendDate: ExDividendDate2;
	dividendDate: DividendDate;
}

export interface Earnings {
	earningsDate: EarningsDate[];
	earningsAverage: EarningsAverage;
	earningsLow: EarningsLow;
	earningsHigh: EarningsHigh;
	revenueAverage: RevenueAverage;
	revenueLow: RevenueLow;
	revenueHigh: RevenueHigh;
}

export interface EarningsDate {
	raw: number;
	fmt: string;
}

export interface EarningsAverage {
	raw: number;
	fmt: string;
}

export interface EarningsLow {
	raw: number;
	fmt: string;
}

export interface EarningsHigh {
	raw: number;
	fmt: string;
}

export interface RevenueAverage {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface RevenueLow {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface RevenueHigh {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface ExDividendDate2 {
	raw: number;
	fmt: string;
}

export interface DividendDate {
	raw: number;
	fmt: string;
}

export interface QuoteData {
	AMRN: Amrn;
}

export interface Amrn {
	sourceInterval: number;
	regularMarketOpen: RegularMarketOpen3;
	exchange: string;
	regularMarketTime: RegularMarketTime;
	fiftyTwoWeekRange: FiftyTwoWeekRange;
	sharesOutstanding: SharesOutstanding2;
	regularMarketDayHigh: RegularMarketDayHigh3;
	shortName: string;
	longName: string;
	exchangeTimezoneName: string;
	regularMarketChange: RegularMarketChange2;
	regularMarketPreviousClose: RegularMarketPreviousClose3;
	fiftyTwoWeekHighChange: FiftyTwoWeekHighChange;
	exchangeTimezoneShortName: string;
	fiftyTwoWeekLowChange: FiftyTwoWeekLowChange;
	exchangeDataDelayedBy: number;
	regularMarketDayLow: RegularMarketDayLow3;
	priceHint: number;
	currency: string;
	regularMarketPrice: RegularMarketPrice2;
	regularMarketVolume: RegularMarketVolume3;
	isLoading: boolean;
	triggerable: boolean;
	gmtOffSetMilliseconds: number;
	region: string;
	marketState: string;
	marketCap: MarketCap3;
	quoteType: string;
	invalid: boolean;
	symbol: string;
	language: string;
	fiftyTwoWeekLowChangePercent: FiftyTwoWeekLowChangePercent;
	regularMarketDayRange: RegularMarketDayRange;
	messageBoardId: string;
	fiftyTwoWeekHigh: FiftyTwoWeekHigh2;
	fiftyTwoWeekHighChangePercent: FiftyTwoWeekHighChangePercent;
	uuid: string;
	market: string;
	fiftyTwoWeekLow: FiftyTwoWeekLow2;
	regularMarketChangePercent: RegularMarketChangePercent2;
	fullExchangeName: string;
	tradeable: boolean;
}

export interface RegularMarketOpen3 {
	raw: number;
	fmt: string;
}

export interface RegularMarketTime {
	raw: number;
	fmt: string;
}

export interface FiftyTwoWeekRange {
	raw: string;
	fmt: string;
}

export interface SharesOutstanding2 {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface RegularMarketDayHigh3 {
	raw: number;
	fmt: string;
}

export interface RegularMarketChange2 {
	raw: number;
	fmt: string;
}

export interface RegularMarketPreviousClose3 {
	raw: number;
	fmt: string;
}

export interface FiftyTwoWeekHighChange {
	raw: number;
	fmt: string;
}

export interface FiftyTwoWeekLowChange {
	raw: number;
	fmt: string;
}

export interface RegularMarketDayLow3 {
	raw: number;
	fmt: string;
}

export interface RegularMarketPrice2 {
	raw: number;
	fmt: string;
}

export interface RegularMarketVolume3 {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface MarketCap3 {
	raw: number;
	fmt: string;
	longFmt: string;
}

export interface FiftyTwoWeekLowChangePercent {
	raw: number;
	fmt: string;
}

export interface RegularMarketDayRange {
	raw: string;
	fmt: string;
}

export interface FiftyTwoWeekHigh2 {
	raw: number;
	fmt: string;
}

export interface FiftyTwoWeekHighChangePercent {
	raw: number;
	fmt: string;
}

export interface FiftyTwoWeekLow2 {
	raw: number;
	fmt: string;
}

export interface RegularMarketChangePercent2 {
	raw: number;
	fmt: string;
}

export interface MktmData {
	raw: number;
	fmt: string;
}
