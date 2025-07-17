document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cnicInput = document.getElementById('cnic-input');
    const verifyBtn = document.getElementById('verify-btn');
    const resultsPanel = document.querySelector('.results-panel');
    const bioBtns = document.querySelectorAll('.bio-btn');
    const cnicField = document.querySelector('.cnic-field');
    const fingerprintField = document.querySelector('.fingerprint-field');
    
    // Event Listeners
    verifyBtn.addEventListener('click', verifyCitizen);
    
    // Biometric toggle
    bioBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            bioBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.type === 'cnic') {
                cnicField.style.display = 'block';
                fingerprintField.style.display = 'none';
            } else {
                cnicField.style.display = 'none';
                fingerprintField.style.display = 'block';
                simulateFingerprintScan();
            }
        });
    });
    
    // CNIC input formatting
    cnicInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 13) value = value.substring(0, 13);
        e.target.value = value;
    });
    
    // Print button
    document.getElementById('print-report').addEventListener('click', function() {
        window.print();
    });
    
    // Main verification function
    function verifyCitizen() {
        const cnic = cnicInput.value.trim();
        
        // Validation
        if (cnic.length !== 13) {
            alert('Please enter a valid 13-digit CNIC number');
            return;
        }
        
        // Format CNIC with dashes for display
        const formattedCnic = `${cnic.substring(0, 5)}-${cnic.substring(5, 12)}-${cnic.substring(12)}`;
        
        // Find citizen in database
        const citizen = citizenDatabase.find(c => c.cnic.replace(/-/g, '') === cnic);
        
        if (!citizen) {
            alert('No citizen found: try 4220112345678 or 4540355667789');
            return;
        }
        
        // Get criminal records
        const criminalRecords = getCriminalRecords(cnic);
        
        // Update UI with citizen data
        updateCitizenUI(citizen, criminalRecords);
        
        // Show results panel
        resultsPanel.style.display = 'block';
        
        // Scroll to results
        setTimeout(() => {
            resultsPanel.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
    
    function updateCitizenUI(citizen, criminalRecords) {
        // Personal Info
        document.getElementById('citizen-name').textContent = citizen.name;
        document.getElementById('info-cnic').textContent = citizen.cnic;
        document.getElementById('info-father').textContent = citizen.fatherName;
        document.getElementById('info-dob').textContent = citizen.dob;
        document.getElementById('info-gender').textContent = citizen.gender;
        document.getElementById('info-mother').textContent = citizen.motherName;
        document.getElementById('info-marital').textContent = citizen.maritalStatus;
        document.getElementById('info-address').textContent = citizen.currentAddress;
        document.getElementById('info-perm-address').textContent = citizen.permanentAddress;
        
        // Update image if available
        if (citizen.image) {
            document.getElementById('citizen-image').src = `${citizen.image}`;
        }
        
        // Family Members
        const familyContainer = document.getElementById('family-members');
        familyContainer.innerHTML = '';
        
        citizen.familyMembers.forEach(member => {
            const memberEl = document.createElement('div');
            memberEl.className = 'family-member';
            memberEl.innerHTML = `
                <h4>${member.name}</h4>
                <p>${member.relation}</p>
                <p>CNIC: ${member.cnic}</p>
            `;
            familyContainer.appendChild(memberEl);
        });
        
        // Criminal Records
        const recordsContainer = document.getElementById('criminal-records');
        recordsContainer.innerHTML = '';
        
        if (criminalRecords.length === 0) {
            recordsContainer.innerHTML = '<div class="record-row"><div colspan="3" style="text-align:center; padding:20px;">No criminal records found</div></div>';
            document.getElementById('crime-status').className = 'status-badge clean';
            document.getElementById('crime-status').innerHTML = '<i class="fas fa-check"></i> CLEAN RECORD';
        } else {
            // Add header
            const header = document.createElement('div');
            header.className = 'record-row header';
            header.innerHTML = `
                <div>Case No.</div>
                <div>Charges</div>
                <div>Status</div>
            `;
            recordsContainer.appendChild(header);
            
            // Add records
            criminalRecords.forEach(record => {
                const row = document.createElement('div');
                row.className = 'record-row';
                row.innerHTML = `
                    <div>${record.caseNumber}</div>
                    <div>${record.charges}</div>
                    <div>${record.status}</div>
                `;
                recordsContainer.appendChild(row);
            });
            
            // Update status badge
            document.getElementById('crime-status').className = 'status-badge danger';
            document.getElementById('crime-status').innerHTML = '<i class="fas fa-exclamation-triangle"></i> CRIMINAL RECORD';
        }
        
        // Update verification date/time
        const now = new Date();
        document.getElementById('verification-date').textContent = formatDate(now);
        document.getElementById('verification-time').textContent = formatTime(now);
    }
    
    function simulateFingerprintScan() {
        const scanner = document.querySelector('.fingerprint-scanner');
        scanner.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Scanning fingerprint...</p>';
        
        setTimeout(() => {
            // Simulate finding a match (in real app, would use biometric API)
            const matchedCnic = '4220112345678'; // Sample matched CNIC
            cnicInput.value = matchedCnic;
            verifyCitizen();
            
            scanner.innerHTML = '<i class="fas fa-fingerprint"></i><p>Fingerprint matched. Retrieving data...</p>';
        }, 2000);
    }
    
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    
    function formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
});