const Sentry = require('@sentry/node');
const { Integrations } = require('@sentry/tracing');

module.exports = {
    init: (environment) => {
        const environmentConfig = {
            production: {
                dsn: process.env.SENTRY_DSN_BACKEND_PROD,
                tracesSampleRate: 0.2,
                environment: 'production'
            },
            staging: {
                dsn: process.env.SENTRY_DSN_BACKEND_STAGING,
                tracesSampleRate: 1.0,
                environment: 'staging'
            },
            development: {
                dsn: process.env.SENTRY_DSN_BACKEND_DEV,
                tracesSampleRate: 1.0,
                environment: 'development'
            }
        };

        const config = environmentConfig[environment] || environmentConfig.development;

        Sentry.init({
            ...config,
            integrations: [
                new Sentry.Integrations.Http({ tracing: true }),
                new Integrations.Express({
                    app: require('../../../maskly/backend/server.js')
                })
            ],
            attachStacktrace: true,
            debug: environment === 'development',
            normalizeDepth: 5,
            ignoreErrors: [
                'Non-critical error',
                'Known issue #1234'
            ],
            denyUrls: [
                /localhost/,
                /127\.0\.0\.1/
            ]
        });

        console.log(`Sentry initialized for ${environment} environment`);
    },
    captureException: (error) => {
        if (process.env.NODE_ENV !== 'test') {
            Sentry.captureException(error);
        }
    },
    captureMessage: (message, level = 'info') => {
        if (process.env.NODE_ENV !== 'test') {
            Sentry.captureMessage(message, level);
        }
    }
};
