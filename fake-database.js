// Sample citizen database
const citizenDatabase = [
    {
        cnic: "42201-1234567-8",
        name: "Muhammad Ali Khan",
        fatherName: "Abdul Khan",
        motherName: "Fatima Begum",
        dob: "15-03-1985",
        gender: "Male",
        maritalStatus: "Married",
        currentAddress: "House #12, Street 45, G-10/4, Islamabad",
        permanentAddress: "Village Kotli, District Sialkot",
        image: "images/person2.jpg",
        familyMembers: [
            { name: "Ayesha Khan", relation: "Wife", cnic: "42201-7654321-9" },
            { name: "Ahmed Khan", relation: "Son", cnic: "42201-1122334-1" },
            { name: "Sara Khan", relation: "Daughter", cnic: "42201-5566778-2" }
        ]
    },
    {
        cnic: "35202-9876543-1",
        name: "Fatima Bibi",
        fatherName: "Muhammad Aslam",
        motherName: "Amina Bibi",
        dob: "22-11-1990",
        gender: "Female",
        maritalStatus: "Single",
        currentAddress: "Flat #305, Gulberg Heights, Lahore",
        permanentAddress: "House #45, Model Town, Lahore",
        image: "images/person1.jpg",
        familyMembers: [
            { name: "Muhammad Aslam", relation: "Father", cnic: "35202-1234567-3" },
            { name: "Amina Bibi", relation: "Mother", cnic: "35202-2345678-4" }
        ]
    },
    {
        cnic: "45403-5566778-9",
        name: "Ali Raza",
        fatherName: "Raza Muhammad",
        motherName: "Zainab Bibi",
        dob: "05-09-1978",
        gender: "Male",
        maritalStatus: "Divorced",
        currentAddress: "Shop #12, Saddar Bazaar, Karachi",
        permanentAddress: "House #78, Nazimabad, Karachi",
        image: "images/person3.jpg",
        familyMembers: [
            { name: "Raza Muhammad", relation: "Father", cnic: "45403-1122334-5" },
            { name: "Hassan Raza", relation: "Brother", cnic: "45403-3344556-6" }
        ]
    }
];

// Function to find citizen by CNIC
function findCitizenByCNIC(cnic) {
    return citizenDatabase.find(citizen => citizen.cnic.replace(/-/g, '') === cnic);
}