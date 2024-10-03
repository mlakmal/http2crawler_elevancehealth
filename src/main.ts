import { HttpCrawler, log, LogLevel } from 'crawlee';
import { writeFile } from 'fs';

// Crawlers come with various utilities, e.g. for logging.
// Here we use debug level of logging to improve the debugging experience.
// This functionality is optional!
log.setLevel(LogLevel.DEBUG);

// Create an instance of the HttpCrawler class - a crawler
// that automatically loads the URLs and saves their HTML.
const crawler = new HttpCrawler({
    // The crawler downloads and processes the web pages in parallel, with a concurrency
    // automatically managed based on the available system memory and CPU (see AutoscaledPool class).
    // Here we define some hard limits for the concurrency.
    minConcurrency: 10,
    maxConcurrency: 50,

    // On error, retry each page at most once.
    maxRequestRetries: 0,

    // Increase the timeout for processing of each page.
    requestHandlerTimeoutSecs: 120,

    // Limit to 10 requests per one crawl
    //maxRequestsPerCrawl: 10,

    // This function will be called for each URL to crawl.
    // It accepts a single parameter, which is an object with options as:
    // https://crawlee.dev/api/http-crawler/interface/HttpCrawlerOptions#requestHandler
    // We use for demonstration only 2 of them:
    // - request: an instance of the Request class with information such as the URL that is being crawled and HTTP method
    // - body: the HTML code of the current page
    async requestHandler({ pushData, request, body, enqueueLinks }) {
        log.debug(`Processing ${request.url}...`);

        // Store the results to the dataset. In local configuration,
        // the data will be stored as JSON files in ./storage
        writeFile(`${process.cwd()}/storage/${request.url.replace('.json', '').replace(/\//g, '_').replace(/\./g, '_').replace(/:/g, '_')}.json`, body, (err) => {
            console.error(err);
        })
    },

    // This function is called if the page processing failed more than maxRequestRetries + 1 times.
    failedRequestHandler({ request }) {
        log.debug(`Request ${request.url} failed.`);
    },
    preNavigationHooks: [
        async (_crawlingContext, gotOptions) => {
            // make sure http2 enabled
            gotOptions.http2 = true
        }
    ],
});

// Run the crawler and wait for it to finish.
// It will crawl a list of URLs from an external file, load each URL using a plain HTTP request, and save HTML
await crawler.run([
    'https://www22.elevancehealth.com/cms-data-index-json/Elevance-Health-Data-Index.json',
    'https://www22.elevancehealth.com/cms-data-index-json/Elevance-Health-Data-Index-KY.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_CT.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_FL.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_GA.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_IN.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_KY.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_ME.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_MO.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_NH.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_OH.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_TX.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_VA.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WI_1_OF_9.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WI_2_OF_9.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WI_3_OF_9.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WI_4_OF_9.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WI_5_OF_9.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WI_6_OF_9.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WI_7_OF_9.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WI_8_OF_9.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WI_9_OF_9.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_LAM.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_CAM.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_INM.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_WIM.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_KYM.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_VAM.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_NVM.json',
    'https://www22.elevancehealth.com/cms/PROVIDERS_OHM.json',
    'https://www22.elevancehealth.com/cms/PLANS_GA.json',
    'https://www22.elevancehealth.com/cms/PLANS_IN.json',
    'https://www22.elevancehealth.com/cms/PLANS_KY.json',
    'https://www22.elevancehealth.com/cms/PLANS_FL.json',
    'https://www22.elevancehealth.com/cms/PLANS_ME.json',
    'https://www22.elevancehealth.com/cms/PLANS_MO.json',
    'https://www22.elevancehealth.com/cms/PLANS_NH.json',
    'https://www22.elevancehealth.com/cms/PLANS_OH.json',
    'https://www22.elevancehealth.com/cms/PLANS_TX.json',
    'https://www22.elevancehealth.com/cms/PLANS_VA.json',
    'https://www22.elevancehealth.com/cms/PLANS_WI.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/32/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/34/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/102/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/235/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/35/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/36/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/37/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/39/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/236/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/40/drugs.json',
    'https://fm.formularynavigator.com/jsonFiles/publish/143/41/drugs.json']);

log.debug('Crawler finished.');