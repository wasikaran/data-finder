document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('json-upload');
    const analyzeBtn = document.getElementById('analyze-btn');
    const vipBtn = document.getElementById('vip-insights-btn');
    const originalJsonEl = document.getElementById('original-json');
    const transformedJsonEl = document.getElementById('transformed-json');
    
    let transformedData = null;
    
    analyzeBtn.addEventListener('click', processData);
    vipBtn.addEventListener('click', showVipInsights);
    
    async function processData() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a JSON file first');
            return;
        }
        
        try {
            const rawData = await readFile(file);
            originalJsonEl.textContent = JSON.stringify(JSON.parse(rawData), null, 2);
            
            const transformer = new ExpenseTransformer(JSON.parse(rawData));
            transformedData = transformer.transform();
            transformedJsonEl.textContent = JSON.stringify(transformedData, null, 2);
            
            renderCharts(transformedData);
        } catch (error) {
            console.error('Error processing data:', error);
            alert('Error processing JSON file: ' + error.message);
        }
    }
    
    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => resolve(event.target.result);
            reader.onerror = error => reject(error);
            reader.readAsText(file);
        });
    }
    
    function renderCharts(data) {
        renderMonthlySummaryChart(data.monthly_summary);
        renderCategoryChart(data.category_summary);
    }
    
    function renderMonthlySummaryChart(monthlyData) {
        const months = Object.keys(monthlyData);
        const totals = months.map(month => monthlyData[month].total);
        
        const ctx = document.getElementById('summary-chart');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Total Spending',
                    data: totals,
                    backgroundColor: '#4361ee',
                    borderColor: '#3f37c9',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    function renderCategoryChart(categoryData) {
        const categories = Object.keys(categoryData);
        const amounts = Object.values(categoryData);
        
        // Sort by amount (descending)
        const combined = categories.map((category, i) => ({
            category,
            amount: amounts[i]
        })).sort((a, b) => b.amount - a.amount);
        
        const sortedCategories = combined.map(item => item.category);
        const sortedAmounts = combined.map(item => item.amount);
        
        const ctx = document.getElementById('category-chart');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sortedCategories,
                datasets: [{
                    data: sortedAmounts,
                    backgroundColor: [
                        '#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', 
                        '#f72585', '#7209b7', '#3a0ca3', '#f8961e'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    },
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }
    
    function showVipInsights() {
        if (!transformedData) {
            alert('Please analyze data first');
            return;
        }
        
        renderTrendsChart(transformedData.monthly_summary);
        renderAnomaliesChart(transformedData.monthly_summary);
    }
});