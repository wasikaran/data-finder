// Criminal records database
const criminalRecordsDatabase = [
    {
        cnic: "4540355667789",
        records: [
            {
                caseNumber: "FIA/2022/1234",
                charges: "Cyber Crime, Fraud",
                status: "Under Trial",
                court: "Cyber Crime Court, Islamabad",
                date: "15-02-2022"
            },
            {
                caseNumber: "KP/2021/567",
                charges: "Property Dispute",
                status: "Closed",
                court: "District Court, Peshawar",
                date: "22-08-2021"
            }
        ]
    },
    {
        cnic: "3520298765431",
        records: [
            {
                caseNumber: "PB/2023/789",
                charges: "Traffic Violation",
                status: "Fine Paid",
                court: "Traffic Court, Lahore",
                date: "05-01-2023"
            }
        ]
    }
];

// Function to get criminal records by CNIC
function getCriminalRecords(cnic) {
    const citizenRecord = criminalRecordsDatabase.find(record => record.cnic === cnic);
    return citizenRecord ? citizenRecord.records : [];
}