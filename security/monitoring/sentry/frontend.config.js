const Sentry = require('@sentry/react');
const { Integrations } = require('@sentry/tracing');

module.exports = {
    init: (environment) => {
        const environmentConfig = {
            production: {
                dsn: process.env.SENTRY_DSN_FRONTEND_PROD,
                tracesSampleRate: 0.2,
                environment: 'production',
                replaysSessionSampleRate: 0.1,
                replaysOnErrorSampleRate: 1.0
            },
            staging: {
                dsn: process.env.SENTRY_DSN_FRONTEND_STAGING,
                tracesSampleRate: 1.0,
                environment: 'staging',
                replaysSessionSampleRate: 0.5,
                replaysOnErrorSampleRate: 1.0
            },
            development: {
                dsn: process.env.SENTRY_DSN_FRONTEND_DEV,
                tracesSampleRate: 1.0,
                environment: 'development',
                replaysSessionSampleRate: 1.0,
                replaysOnErrorSampleRate: 1.0
            }
        };

        const config = environmentConfig[environment] || environmentConfig.development;

        Sentry.init({
            ...config,
            integrations: [
                new Integrations.BrowserTracing({
                    tracingOrigins: [
                        "localhost",
                        /^\//,
                        /^https:\/\/api\.maskly\.com/,
                        /^wss:\/\/ws\.maskly\.com/
                    ]
                }),
                new Sentry.Replay()
            ],
            denyUrls: [
                /localhost/,
                /127\.0\.0\.1/
            ],
            ignoreErrors: [
                'ResizeObserver loop limit exceeded',
                'Network request failed'
            ],
            beforeSend: (event) => {
                if (event.user) {
                    delete event.user.ip_address;
                }
                return event;
            }
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
