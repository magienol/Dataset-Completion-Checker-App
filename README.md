#     Dataset-Completion-Checker-App


**A Custom DHIS2 custom application** for monitoring dataset reporting, verifying data availability, and managing dataset completion status.

The application enables users to identify whether datasets contain submitted data, determine whether they have been marked as complete, and track completion activities through user and timestamp information.

---

## Features

### 📊 Dataset Reporting & Completion Monitoring

The application provides a clear overview of dataset reporting status through two key indicators:

* **Has Data** — Indicates whether the dataset contains submitted data.
* **Completion Status** — Indicates whether the dataset has been marked as complete.
* **Complete** — The dataset has been successfully completed.
* **Not Complete** — The dataset contains data but has not yet been marked complete.
* **No Data** — No data has been submitted for the selected dataset, period, and organisation unit.

### 📅 Flexible Reporting Periods

Supports multiple reporting period types:

* **Monthly** — `YYYYMM` (e.g., `202401`)
* **Quarterly** — `YYYYQ#` (e.g., `20241`)
* **Yearly** — `YYYY` (e.g., `2024`)

The application dynamically validates and adjusts the expected period format based on the selected period type.

### 🏢 Organisation Unit Search

Users can:

* Search organisation units by name or UID.
* Filter results while typing.
* Select an organisation unit from the search results.
* View confirmation of the selected organisation unit.
* Work with hierarchical organisation unit structures.

### 👤 User Accountability & Audit Trail

Completion activities are tracked using the authenticated DHIS2 user account.

The application records:

* User who completed the dataset.
* Date and time of completion.
* Completion metadata displayed in the results table.

### ✅ One-Click Dataset Completion

Users can mark eligible datasets as complete directly from the results table.

The **Mark Complete** action:

* Is available only when data exists.
* Is disabled when the dataset has already been completed.
* Provides confirmation feedback after successful completion.
* Displays detailed error information when an operation fails.

---

## User Interface

The application provides a responsive and user-friendly interface designed around the DHIS2 design system.

### Key UI Features

* Responsive desktop, tablet, and mobile layouts.
* Clear status indicators.
* Searchable organisation unit selection.
* Context-aware results display.
* Clear and reset functionality.
* Logged-in user information.
* Accessible navigation and focus states.
* Smooth interface transitions.

### Results Table

The dataset results table displays:

| Column               | Description                               |
| -------------------- | ----------------------------------------- |
| Dataset Name         | Name of the dataset                       |
| Data Presence        | Indicates whether data exists             |
| Completion Status    | Indicates whether the dataset is complete |
| Completed By         | User who completed the dataset            |
| Completion Date/Time | Date and time of completion               |
| Actions              | Available completion actions              |

---

## How It Works

The application follows a simple workflow:

1. Select the **reporting period type**.
2. Enter the **reporting period**.
3. Select the **organisation unit**.
4. Click **Analyze Datasets**.
5. The application retrieves the available datasets.
6. It checks whether each dataset contains data.
7. It checks the completion registration status.
8. Results are displayed in the dataset table.
9. Users can mark eligible datasets as complete.
10. The application records the completion user and timestamp.

---

## DHIS2 API Integration

The application integrates with the DHIS2 Web API using the following endpoints:

| Endpoint                            | Purpose                             |
| ----------------------------------- | ----------------------------------- |
| `/api/dataSets`                     | Retrieve available datasets         |
| `/api/organisationUnits`            | Retrieve organisation units         |
| `/api/me`                           | Retrieve the authenticated user     |
| `/api/dataValueSets`                | Check whether datasets contain data |
| `/api/completeDataSetRegistrations` | Retrieve completion status          |
| `/api/completeDataSetRegistrations` | Mark datasets as complete           |

---

## Technology Stack

The application is built using:

* **React 18** — Frontend framework
* **@dhis2/app-runtime** — DHIS2 data engine and API integration
* **@dhis2/ui** — DHIS2 UI component library
* **d2-app-scripts** — DHIS2 application build tooling
* **CSS3** — Application styling and responsive design

---

## Project Structure

```text
.
├── public/
│   └── index.html
│
├── src/
│   ├── index.js
│   ├── App.js
│   └── components/
│       └── DatasetRow.js
│
├── manifest.webapp
├── package.json
└── README.md
```

The main application component handles filtering and dataset analysis, while `DatasetRow` manages individual dataset completion information and actions.

---

## Installation

### Prerequisites

* DHIS2 instance **2.40–2.43.1.0**, including supported SNAPSHOT builds
* Node.js 16+
* npm 8+
* `@dhis2/cli-scripts`

### Clone the Project

```bash
git clone <repository-url>
cd <project-directory>
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

### Build for Production

```bash
npm run build
```

---

## Using the Application

### 1. Select Reporting Period

Choose one of:

* Monthly
* Quarterly
* Yearly

### 2. Enter Reporting Period

Enter the period using the format displayed by the application.

For example:

```text
202401
```

represents January 2024 for a monthly reporting period.

### 3. Select Organisation Unit

Search for an organisation unit using:

* Organisation unit name, or
* Organisation unit UID.

Select the appropriate organisation unit from the search results.

### 4. Analyze Datasets

Click **Analyze Datasets** to retrieve and evaluate the datasets for the selected:

* Period
* Organisation unit
* Reporting configuration

### 5. Review Dataset Status

Review the results table to determine:

* Whether data has been submitted.
* Whether the dataset has been marked complete.
* Who completed the dataset.
* When the dataset was completed.

### 6. Mark Dataset Complete

For datasets containing data but not yet marked complete:

1. Click **Mark Complete**.
2. Confirm the action.
3. Review the success message.
4. Verify the completion user and timestamp.

### 7. Clear Filters

Use **Clear** to reset the current selections and start a new analysis.

---

## Data Integrity & Security

The application includes several mechanisms to support reliable dataset completion management:

* Input validation before API requests.
* User-friendly error handling.
* Automatic refresh after completion.
* Authentication through DHIS2.
* No sensitive data stored locally.
* User accountability through completion records.
* Audit information for completion actions.

### Required DHIS2 Permissions

Users must have permission to:

* View datasets.
* View data values.
* Create complete dataset registrations.

---

## Performance

The application includes several performance optimizations:

* Efficient API queries using field selection.
* Pagination for organisation unit searches.
* Optimized React rendering.
* Automatic data refresh after completion.

Expected performance characteristics documented for the application include:

* Initial load: approximately **3–5 seconds**
* Dataset completion: approximately **1–2 seconds per dataset**
* Application bundle: approximately **45 KB**, with approximately **12 KB gzipped**.

---

## Troubleshooting

### No Matching Records

Check that:

* The organisation unit UID is correct.
* The reporting period uses the correct format.
* Data exists for the selected period and organisation unit.

### Mark Complete Is Disabled

Check that:

* The dataset contains data.
* The dataset has not already been completed.
* The user has the required DHIS2 permissions.

### Completion Fails

Check:

* Browser developer console.
* DHIS2 user permissions.
* Network connectivity.
* The `F_DATASET_COMPLETE` authority where applicable.

### Application Does Not Start

For permission errors involving the development environment:

```bash
mkdir -p .d2/shell/node_modules/.cache
chmod -R u+rwx .d2
npm cache clean --force
npm install
npm start
```

---

## Production Deployment

Build the application:

```bash
npm run build
```

The generated `build/` directory can then be deployed to the appropriate DHIS2 application environment.

For a DHIS2 instance, the application can be installed through:

```text
Apps → App Management
```

---

## Browser Compatibility

The documented supported browsers include:

* Chrome / Chromium
* Microsoft Edge
* Firefox
* Safari
* Mobile browsers

---

## Version History

### v2.0.0 — Professional Upgrade

* Added monthly, quarterly, and yearly reporting periods.
* Added searchable organisation unit selection.
* Added completion user tracking.
* Added completion timestamps and audit information.
* Improved user interface and responsive design.
* Improved accessibility.
* Enhanced error handling and user feedback.

### v1.0.0

* Basic dataset completion functionality.
* Period and organisation unit search.
* Data presence detection.
* Completion status display.

---

## Support & Maintenance

For issues, feature requests, or improvements:

1. Review this README.
2. Check the DHIS2 API documentation.
3. Test changes in a development environment.
4. Document custom modifications before deployment.

---

## Related Documentation

* [DHIS2 API Documentation](https://docs.dhis2.org/en/develop/using-the-api/)
* [DHIS2 UI Component Library](https://github.com/dhis2/ui)
* [DHIS2 App Runtime](https://github.com/dhis2/app-runtime)

---

## Author MOH Republic of South Sudan & HISP South Sudan 



See the `LICENSE` file for the complete license terms.
