const config = {
    type: 'app',
    name: 'dataset-Completion-checker',
    title: 'Dataset Completion Checker App',
    description: 'A Custom DHIS2 application designed to monitor dataset reporting by checking whether datasets contain submitted data and verifying whether they have been marked as complete. The application provides a clear and consolidated overview of data availability and completion status, enabling users to efficiently track reporting progress, identify incomplete or missing submissions, and support timely data quality monitoring and follow-up.',
    minDHIS2Version: '2.40-SNAPSHOT',
    maxDHIS2Version: '2.43.1.0',
    entryPoints: {
        app: './src/App.jsx',
    },
}

module.exports = config
