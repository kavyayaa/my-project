// Sample data to start with
let leaveRequests = [
    {
        id: 1,
        studentName: 'John Doe',
        studentId: 'STU001',
        leaveType: 'Medical',
        startDate: '2025-03-05',
        endDate: '2025-03-07',
        reason: 'Doctor appointment',
        status: 'Pending',
        createdAt: '2025-03-01T10:30:00'
    },
    {
        id: 2,
        studentName: 'Jane Smith',
        studentId: 'STU002',
        leaveType: 'Personal',
        startDate: '2025-03-10',
        endDate: '2025-03-12',
        reason: 'Family event',
        status: 'Pending',
        createdAt: '2025-03-02T09:15:00'
    }
];

// DOM elements
const leaveRequestForm = document.getElementById('leaveRequestForm');
const requestsTableBody = document.getElementById('requestsTableBody');
const requestCount = document.getElementById('requestCount');
const dateFilter = document.getElementById('dateFilter');
const studentFilter = document.getElementById('studentFilter');
const noRequestsMessage = document.getElementById('noRequestsMessage');

// Form submission handler
leaveRequestForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const studentName = document.getElementById('studentName').value;
    const studentId = document.getElementById('studentId').value;
    const leaveType = document.getElementById('leaveType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reason = document.getElementById('reason').value;
    
    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
        alert('End date cannot be before start date');
        return;
    }
    
    // Create new leave request
    const newRequest = {
        id: leaveRequests.length + 1,
        studentName,
        studentId,
        leaveType,
        startDate,
        endDate,
        reason,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    
    // Add to list
    leaveRequests.push(newRequest);
    
    // Reset form
    leaveRequestForm.reset();
    
    // Update display
    updateLeaveRequestsDisplay();
});

// Filter handlers
dateFilter.addEventListener('change', updateLeaveRequestsDisplay);
studentFilter.addEventListener('input', updateLeaveRequestsDisplay);

// Function to calculate days between dates
function getDayCount(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Function to get badge class for leave type
function getLeaveTypeBadgeClass(leaveType) {
    switch(leaveType) {
        case 'Medical': return 'badge-medical';
        case 'Personal': return 'badge-personal';
        case 'Family': return 'badge-family';
        case 'Academic': return 'badge-academic';
        default: return '';
    }
}

// Function to update the leave requests display
function updateLeaveRequestsDisplay() {
    // Get filter values
    const dateFilterValue = dateFilter.value;
    const studentFilterValue = studentFilter.value.toLowerCase();
    
    // Apply filters
    const filteredRequests = leaveRequests.filter(request => {
        // Filter by date
        const dateMatch = dateFilterValue 
            ? new Date(request.startDate) <= new Date(dateFilterValue) && 
              new Date(request.endDate) >= new Date(dateFilterValue)
            : true;
        
        // Filter by student name or ID
        const studentMatch = studentFilterValue
            ? request.studentName.toLowerCase().includes(studentFilterValue) ||
              request.studentId.toLowerCase().includes(studentFilterValue)
            : true;
        
        return dateMatch && studentMatch;
    });
    
    // Update request count
    requestCount.textContent = `${filteredRequests.length} requests`;
    
    // Show/hide no requests message
    if (filteredRequests.length === 0) {
        requestsTableBody.innerHTML = '';
        noRequestsMessage.style.display = 'block';
        return;
    } else {
        noRequestsMessage.style.display = 'none';
    }
    
    // Clear current table
    requestsTableBody.innerHTML = '';
    
    // Add each filtered request to the table
    filteredRequests.forEach(request => {
        const row = document.createElement('tr');
        
        // Student column
        const studentCell = document.createElement('td');
        studentCell.innerHTML = `
            <div class="student-info">
                <span class="student-name">${request.studentName}</span>
                <span class="student-id">${request.studentId}</span>
            </div>
        `;
        
        // Leave period column
        const periodCell = document.createElement('td');
        const dayCount = getDayCount(request.startDate, request.endDate);
        periodCell.innerHTML = `
            <div class="leave-period">
                <span class="leave-dates">${formatDate(request.startDate)} - ${formatDate(request.endDate)}</span>
                <span class="leave-days">${dayCount} days</span>
            </div>
        `;
        
        // Leave type column
        const typeCell = document.createElement('td');
        const typeBadgeClass = getLeaveTypeBadgeClass(request.leaveType);
        typeCell.innerHTML = `
            <span class="badge ${typeBadgeClass}">${request.leaveType}</span>
        `;
        
        // Status column
        const statusCell = document.createElement('td');
        statusCell.innerHTML = `
            <span class="badge badge-pending">${request.status}</span>
        `;
        
        // Add cells to row
        row.appendChild(studentCell);
        row.appendChild(periodCell);
        row.appendChild(typeCell);
        row.appendChild(statusCell);
        
        // Add row to table
        requestsTableBody.appendChild(row);
    });
}

// Initialize the display on page load
updateLeaveRequestsDisplay();