import React, { useState } from 'react';
import {ExportIcon, PrintIcon, TestInformationIcon, OptimizeResponseTimeIcon, MonitorPerformanceIcon, ScaleInfrastructureIcon, MaxUsersIcon, AvgResponseTimeIcon, PassRateIcon, TotalRequestsIcon , PerformanceReport } from '../icons';

// Main App component
export default function App() {
  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        body {
          margin: 0;
          font-family: 'Montserrat', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Nunito:wght@400;600;700&display=swap');

        .exportButtonOuter:hover {
          transform: scale(1.02);
        }

        .printButton:hover {
          transform: scale(1.02);
        }

        .dropdownItem:hover {
          background: rgba(210, 98, 34, 0.2);
        }

        .dropdownItem:last-child {
          border-bottom: none;
        }

        /* Print Styles - Hide modal and buttons when printing */
        @media print {
          .modal-overlay {
            display: none !important;
          }
          .action-buttons {
            display: none !important;
          }
          
          .main-content {
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
      <div style={styles.appContainer}>
        <MainContent />
      </div>
    </>
  );
}

// Main content area component
const MainContent = () => {
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [selectedFormat, setSelectedFormat] = React.useState('PDF');
  const [isExportHovered, setIsExportHovered] = React.useState(false);
  const [isPrintHovered, setIsPrintHovered] = React.useState(false);
  
  const exportAsJSON = () => {
    const reportData = {
      totalRequests: 15,
      avgResponseTime: '5.32s',
      passRate: '100%',
      maxUsers: '~150 VUs',
      testInformation: {
        testType: 'pure_npl_nfr',
        timestamp: '28/9/25, 27:45:09 am',
        apiTested: '28/9/25',
        authTime: '2.711'
      },
      apiPerformance: [
        { apiName: 'GET SIZES', endpoint: '/api/get_sizes', avgResponseTime: '6.80s', status: 'Fail' }
      ]
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'performance-report.json';
    link.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const exportAsCSV = () => {
    const csvContent = `API Name,Endpoint,Avg Response Time,Status
GET SIZES,/api/get_sizes,6.80s,Fail
GET SIZES,/api/get_sizes,6.80s,Fail`;
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'performance-report.csv';
    link.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const exportAsPDF = () => {
    window.print();
    setShowExportModal(false);
  };

  const handleExport = () => {
    if (selectedFormat === 'PDF') {
      exportAsPDF();
    } else if (selectedFormat === 'JSON') {
      exportAsJSON();
    } else if (selectedFormat === 'CSV') {
      exportAsCSV();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.mainContentContainer} className='custom-scrollbar main-content'>
      <div style={styles.contentPadding}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <PerformanceReport />
        </div>

        {/* Metric Cards */}
        <div style={styles.metricsGrid}>
          {/* Total Requests Card */}
          <div style={styles.metricCard}>
            <TotalRequestsIcon />
            <div style={styles.metricContent}>
              <span style={styles.metricLabel}>Total Requests</span>
              <span style={styles.metricValue}>15</span>
            </div>
          </div>

          {/* Avg Response Time Card */}
          <div style={styles.metricCard}>
            <AvgResponseTimeIcon />
            <div style={styles.metricContent}>
              <span style={styles.metricLabel}>Avg. Response time</span>
              <span style={styles.metricValue}>5.32s</span>
            </div>
          </div>

          {/* Pass Rate Card */}
          <div style={styles.metricCard}>
            <PassRateIcon />
            <div style={styles.metricContent}>
              <span style={styles.metricLabel}>Pass Rate</span>
              <span style={styles.metricValue}>100 %</span>
            </div>
          </div>

          {/* Max Users Card */}
          <div style={styles.metricCard}>
            <MaxUsersIcon />
            <div style={styles.metricContent}>
              <span style={styles.metricLabel}>Max Users</span>
              <span style={styles.metricValue}>~150 VUs</span>
            </div>
          </div>
        </div>

        {/* Two Column Section: Response Time + Pass Rate */}
        <div style={styles.twoColumnContainer}>
          {/* LEFT: Response Time Comparison */}
          <div style={styles.responseTimeContainer}>
            <h2 style={styles.sectionHeading}>Response Time Comparison</h2>
            
            <div style={styles.barsContainer}>
              {/* Get Sizes */}
              <div style={styles.barRow}>
                <span style={styles.barLabel}>Get Sizes</span>
                <div style={styles.barBackground}>
                  <div style={{...styles.barFill, width: '73%'}}></div>
                </div>
                <span style={styles.barValue}>6.80s</span>
              </div>

              {/* Get Crust */}
              <div style={styles.barRow}>
                <span style={styles.barLabel}>Get Crust</span>
                <div style={styles.barBackground}>
                  <div style={{...styles.barFill, width: '73%'}}></div>
                </div>
                <span style={styles.barValue}>6.80s</span>
              </div>

              {/* Get Toppings */}
              <div style={styles.barRow}>
                <span style={styles.barLabel}>Get Toppings</span>
                <div style={styles.barBackground}>
                  <div style={{...styles.barFill, width: '30%'}}></div>
                </div>
                <span style={styles.barValue}>6.80s</span>
              </div>

              {/* Get Pizzas */}
              <div style={styles.barRow}>
                <span style={styles.barLabel}>Get Pizzas</span>
                <div style={styles.barBackground}>
                  <div style={{...styles.barFill, width: '30%'}}></div>
                </div>
                <span style={styles.barValue}>6.80s</span>
              </div>

              {/* User Profile */}
              <div style={styles.barRow}>
                <span style={styles.barLabel}>User Profile</span>
                <div style={styles.barBackground}>
                  <div style={{...styles.barFill, width: '73%'}}></div>
                </div>
                <span style={styles.barValue}>6.80s</span>
              </div>

              {/* Get Cart */}
              <div style={styles.barRow}>
                <span style={styles.barLabel}>Get Cart</span>
                <div style={styles.barBackground}>
                  <div style={{...styles.barFill, width: '27%'}}></div>
                </div>
                <span style={styles.barValue}>6.80s</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Pass Rate */}
          <div style={styles.passRateContainer}>
            <div style={styles.passRateLegend}>
              {/* Green dot - Input: 90% */}
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: 'rgba(91, 166, 1, 1)'}}></div>
                <span style={styles.legendText}>Input: 90%</span>
              </div>
              
              {/* Red dot - Fail Rate: 10% */}
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: 'rgba(206, 24, 24, 1)'}}></div>
                <span style={styles.legendText}>Fail Rate: 10%</span>
              </div>
            </div>
            
            <div style={styles.circularChartContainer}>
              <svg width="210" height="210" viewBox="0 0 210 210" style={styles.circularChart}>
                {/* Outer ring background (gray) */}
                <circle
                  cx="105"
                  cy="105"
                  r="91"
                  fill="none"
                  stroke="rgba(45, 45, 45, 1)"
                  strokeWidth="12"
                />
                
                {/* Outer ring progress (90% green) */}
                <circle
                  cx="105"
                  cy="105"
                  r="91"
                  fill="none"
                  stroke="rgba(91, 166, 1, 1)"
                  strokeWidth="12"
                  strokeDasharray="571.5"
                  strokeDashoffset="57.15"
                  strokeLinecap="round"
                  transform="rotate(-90 105 105)"
                />
                
                {/* Inner ring background (gray) */}
                <circle
                  cx="105"
                  cy="105"
                  r="71"
                  fill="none"
                  stroke="rgba(45, 45, 45, 1)"
                  strokeWidth="12"
                />
                
                {/* Inner ring progress (10% red) */}
                <circle
                  cx="105"
                  cy="105"
                  r="71"
                  fill="none"
                  stroke="rgba(206, 24, 24, 1)"
                  strokeWidth="12"
                  strokeDasharray="446.1"
                  strokeDashoffset="401.49"
                  strokeLinecap="round"
                  transform="rotate(-90 105 105)"
                />
              </svg>
              
              {/* Center text */}
              <div style={styles.circleTextContainer}>
                <div style={styles.circleMainText}>90 %</div>
                <div style={styles.circleSubText}>Pass Rate</div>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.sectionDivider}></div>

        {/* API Performance Details Section */}
        <div style={styles.apiPerformanceSection}>
          <h2 style={styles.apiSectionHeading}>API Performance Details</h2>

          <div style={styles.tableContainer}>
            {/* Table Header */}
            <div style={styles.tableHeader}>
              <div style={styles.tableHeaderCell}>API Name</div>
              <div style={styles.tableHeaderCell}>Endpoint</div>
              <div style={styles.tableHeaderCell}>Avg. Response Time</div>
              <div style={styles.tableHeaderCell}>Status</div>
            </div>

            {/* Table Rows */}
            <div style={styles.tableRow}>
              <div style={styles.tableCell}>GET SIZES</div>
              <div style={{...styles.tableCell, ...styles.endpointCell}}>/api/get_sizes</div>
              <div style={{...styles.tableCell, textAlign: 'center'}}>6.80s</div>
              <div style={{...styles.tableCell, ...styles.statusCell}}>Fair</div>
            </div>

            <div style={styles.tableRow}>
              <div style={styles.tableCell}>GET SIZES</div>
              <div style={{...styles.tableCell, ...styles.endpointCell}}>/api/get_sizes</div>
              <div style={{...styles.tableCell, textAlign: 'center'}}>6.80s</div>
              <div style={{...styles.tableCell, ...styles.statusCell}}>Fair</div>
            </div>

            <div style={styles.tableRow}>
              <div style={styles.tableCell}>GET SIZES</div>
              <div style={{...styles.tableCell, ...styles.endpointCell}}>/api/get_sizes</div>
              <div style={{...styles.tableCell, textAlign: 'center'}}>6.80s</div>
              <div style={{...styles.tableCell, ...styles.statusCell}}>Fair</div>
            </div>

            <div style={styles.tableRow}>
              <div style={styles.tableCell}>GET SIZES</div>
              <div style={{...styles.tableCell, ...styles.endpointCell}}>/api/get_sizes</div>
              <div style={{...styles.tableCell, textAlign: 'center'}}>6.80s</div>
              <div style={{...styles.tableCell, ...styles.statusCell}}>Fair</div>
            </div>
          </div>
        </div>
        <div style={styles.sectionDivider}></div>

        {/* Recommendations Section */}
        <div style={styles.recommendationsSection}>
          <h2 style={styles.recommendationsHeading}>Recommendations</h2>

          {/* Recommendation Card 1 */}
          <div style={styles.recommendationCard}>
            <OptimizeResponseTimeIcon />
            <div style={styles.recommendationContent}>
              <h3 style={styles.recommendationTitle}>Optimize Response Times</h3>
              <p style={styles.recommendationText}>
                Average response times exceed 5 seconds, which could affect user experience. Consider optimizing database queries and implementing caching.
              </p>
            </div>
          </div>

          {/* Recommendation Card 2 */}
          <div style={styles.recommendationCard}>
            <MonitorPerformanceIcon />
            <div style={styles.recommendationContent}>
              <h3 style={styles.recommendationTitle}>Monitor Performance</h3>
              <p style={styles.recommendationText}>
                Average response times exceed 5 seconds, which could affect user experience. Consider optimizing database queries and implementing caching.
              </p>
            </div>
          </div>

          {/* Recommendation Card 3 */}
          <div style={styles.recommendationCard}>
            <ScaleInfrastructureIcon />
            <div style={styles.recommendationContent}>
              <h3 style={styles.recommendationTitle}>Scale Infrastructure</h3>
              <p style={styles.recommendationText}>
                Average response times exceed 5 seconds, which could affect user experience. Consider optimizing database queries and implementing caching.
              </p>
            </div>
          </div>
        </div>
        <div style={styles.sectionDivider}></div>

        {/* Test Information Section */}
        <div style={styles.testInformationContainer}>
          <TestInformationIcon />
          <div style={styles.testInformationContent}>
            <h3 style={styles.testInformationTitle}>Test Information</h3>
            <div style={styles.testInfoGrid}>
              <div style={styles.testInfoItem}>
                <span style={styles.testInfoLabel}>Test Type: </span>
                <span style={styles.testInfoValue}>pure_npl_nfr</span>
              </div>
              <div style={styles.testInfoItem}>
                <span style={styles.testInfoLabel}>Timestamp: </span>
                <span style={styles.testInfoValue}>28/9/25, 27:45:09 am</span>
              </div>
              <div style={styles.testInfoItem}>
                <span style={styles.testInfoLabel}>API Tested: </span>
                <span style={styles.testInfoValue}>28/9/25</span>
              </div>
              <div style={styles.testInfoItem}>
                <span style={styles.testInfoLabel}>Auth Time: </span>
                <span style={styles.testInfoValue}>2.711</span>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.sectionDivider}></div>

        {/* System Resource Usage Section */}
        <div style={styles.systemResourceSection}>
          <h2 style={styles.systemResourceHeading}>System Resource Usage</h2>

          <div style={styles.resourceCardsGrid}>
            {/* Get Sizes Card */}
            <div style={styles.resourceCard}>
              <h4 style={styles.resourceCardTitle}>Get Sizes</h4>
              <div style={styles.resourceMetrics}>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>CPU Memory:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Memory:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(208, 93, 29, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Disk:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Network:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(208, 93, 29, 1)'}}>12.9%</span>
                </div>
              </div>
            </div>

            {/* Get Crusts Card */}
            <div style={styles.resourceCard}>
              <h4 style={styles.resourceCardTitle}>Get Crusts</h4>
              <div style={styles.resourceMetrics}>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>CPU Memory:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Memory:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Disk:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Network:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(208, 93, 29, 1)'}}>12.9%</span>
                </div>
              </div>
            </div>

            {/* Get Toppings Card */}
            <div style={styles.resourceCard}>
              <h4 style={styles.resourceCardTitle}>Get Toppings</h4>
              <div style={styles.resourceMetrics}>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>CPU Memory:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Memory:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(208, 93, 29, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Disk:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(208, 93, 29, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Network:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
              </div>
            </div>

            {/* Get Pizzas Card */}
            <div style={styles.resourceCard}>
              <h4 style={styles.resourceCardTitle}>Get Pizzas</h4>
              <div style={styles.resourceMetrics}>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>CPU Memory:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Memory:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Disk:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(208, 93, 29, 1)'}}>12.9%</span>
                </div>
                <div style={styles.resourceMetricRow}>
                  <span style={styles.resourceLabel}>Network:</span>
                  <span style={{...styles.resourceValue, color: 'rgba(139, 208, 55, 1)'}}>12.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.sectionDivider}></div>

        {/* Action Buttons */}
        <div className="action-buttons" style={styles.actionButtonsContainer}>
          {/* Export Report Button */}
          <div 
            style={{
              ...styles.exportButtonOuter,
              transform: isExportHovered ? 'scale(1.02)' : 'scale(1)',
            }}
            onClick={() => setShowExportModal(true)}
            onMouseEnter={() => setIsExportHovered(true)}
            onMouseLeave={() => setIsExportHovered(false)}
          >
            <div style={styles.exportButtonInner}>
              <ExportIcon />
              <span style={styles.buttonText}>Export Report</span>
            </div>
          </div>
          
          {/* Print Report Button */}
          <div 
            style={{
              ...styles.printButton,
              transform: isPrintHovered ? 'scale(1.02)' : 'scale(1)',
            }}
            onClick={handlePrint}
            onMouseEnter={() => setIsPrintHovered(true)}
            onMouseLeave={() => setIsPrintHovered(false)}
          >
            <PrintIcon />
            <span style={styles.buttonText}>Print Report</span>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="modal-overlay" style={styles.modalOverlay} onClick={() => setShowExportModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Export Performance Report</h3>
              <p style={styles.modalSubtitle}>Choose your preferred export format</p>
              
              <div style={styles.formatOptions}>
                <div 
                  style={{
                    ...styles.formatOption,
                    ...(selectedFormat === 'PDF' ? styles.formatOptionSelected : {})
                  }}
                  onClick={() => setSelectedFormat('PDF')}
                >
                  <div style={styles.formatRadio}>
                    {selectedFormat === 'PDF' && <div style={styles.formatRadioInner}></div>}
                  </div>
                  <div>
                    <div style={styles.formatName}>PDF Document</div>
                    <div style={styles.formatDesc}>Best for printing and sharing</div>
                  </div>
                </div>
                
                <div 
                  style={{
                    ...styles.formatOption,
                    ...(selectedFormat === 'JSON' ? styles.formatOptionSelected : {})
                  }}
                  onClick={() => setSelectedFormat('JSON')}
                >
                  <div style={styles.formatRadio}>
                    {selectedFormat === 'JSON' && <div style={styles.formatRadioInner}></div>}
                  </div>
                  <div>
                    <div style={styles.formatName}>JSON File</div>
                    <div style={styles.formatDesc}>For data processing and APIs</div>
                  </div>
                </div>
                
                <div 
                  style={{
                    ...styles.formatOption,
                    ...(selectedFormat === 'CSV' ? styles.formatOptionSelected : {})
                  }}
                  onClick={() => setSelectedFormat('CSV')}
                >
                  <div style={styles.formatRadio}>
                    {selectedFormat === 'CSV' && <div style={styles.formatRadioInner}></div>}
                  </div>
                  <div>
                    <div style={styles.formatName}>CSV File</div>
                    <div style={styles.formatDesc}>For Excel and spreadsheets</div>
                  </div>
                </div>
              </div>
              
              <div style={styles.modalActions}>
                <button 
                  style={styles.modalCancelBtn}
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={styles.modalExportBtn}
                  onClick={handleExport}
                >
                  Export as {selectedFormat}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles object
const styles = {
  appContainer: {
    backgroundColor: '#111217',
    color: '#f9fafb',
    minHeight: '100vh',
    fontFamily: "'Montserrat', sans-serif",
  },
  mainContentContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: '#101010',
  },
  contentPadding: {
    padding: '32px 64px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  systemResourceSection: {
    width: '100%',
    marginBottom: '40px',
  },
  systemResourceHeading: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
    margin: '0 0 24px 0',
  },
  resourceCardTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
    margin: '0 0 12px 0',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '40px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '40px',
  },
  metricCard: {
    width: '100%',
    maxWidth: '385px',
    height: '144px',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)',
    borderRadius: '12px',
    borderTop: 'none',
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    borderImage: 'linear-gradient(176.72deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.12) 101.18%)',
    padding: '24px 19px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxSizing: 'border-box',
  },
  metricContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  metricLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
  },
  metricValue: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '700',
    fontSize: '36px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(208, 93, 29, 1)',
  },
  responseTimeContainer: {
    width: '100%',
    height: 'auto',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)',
    borderRadius: '12px',
    borderTop: 'none',
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '24px',
    boxSizing: 'border-box',
  },
  sectionHeading: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
    margin: '0 0 24px 0',
  },
  barsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  barLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
    minWidth: '150px',
    textAlign: 'left',
  },
  barBackground: {
    flex: 1,
    height: '20px',
    borderRadius: '12px',
    backgroundColor: 'rgba(32, 32, 32, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '12px',
    backgroundColor: 'rgba(208, 93, 29, 1)',
    transition: 'width 0.3s ease',
  },
  barValue: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
    minWidth: '60px',
    textAlign: 'right',
  },
  passRateContainer: {
    width: '100%',
    height: 'auto',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)',
    borderRadius: '12px',
    borderTop: 'none',
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '24px',
    boxSizing: 'border-box',
  },
  twoColumnContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '40px',
  },
  passRateLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '12px',
    justifyContent: 'flex-start',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
  },
  legendDot: {
    width: '23px',
    height: '23px',
    borderRadius: '50%',
  },
  legendText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '14px',
    color: 'rgba(248, 248, 248, 0.98)',
  },
  circularChartContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '250px',
  },
  circularChart: {
    transform: 'rotate(0deg)',
  },
  circleTextContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '11px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  circleMainText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '700',
    fontSize: '40px',
    lineHeight: '100%',
    letterSpacing: '0px',
    textAlign: 'center',
    color: 'rgba(248, 248, 248, 1)',
  },
  circleSubText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '100%',
    letterSpacing: '0px',
    textAlign: 'center',
    color: 'rgba(248, 248, 248, 0.98)',
  },
  apiPerformanceSection: {
    width: '100%',
    marginBottom: '40px',
  },
  apiSectionHeading: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
    margin: '0 0 24px 0',
  },
  tableContainer: {
    width: '100%',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    borderTop: 'none',
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    height: '87px',
    background: 'radial-gradient(146.53% 593.43% at 100% 0%, rgba(255, 255, 255, 0.13) 0%, rgba(30, 30, 30, 0.5) 100%)',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    alignItems: 'center',
    paddingLeft: '32px',
    paddingRight: '32px',
    boxSizing: 'border-box',
  },
  tableHeaderCell: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
    textAlign: 'center',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    minHeight: '87px',
    alignItems: 'center',
    paddingLeft: '32px',
    paddingRight: '32px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxSizing: 'border-box',
    background: 'transparent',
  },
  tableCell: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
    textAlign: 'center',
  },
  endpointCell: {
    fontWeight: '400',
    color: 'rgba(163, 163, 163, 0.98)',
    textAlign: 'center',
  },
  statusCell: {
    fontWeight: '500',
    color: 'rgba(208, 93, 29, 1)',
    textAlign: 'center',
  },
  recommendationsSection: {
    width: '100%',
    marginBottom: '40px',
  },
  recommendationsHeading: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(248, 248, 248, 0.98)',
    margin: '0 0 24px 0',
  },
  recommendationCard: {
    width: '100%',
    minHeight: '169px',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)',
    borderRadius: '12px',
    borderTop: 'none',
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '24px 32px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
    boxSizing: 'border-box',
  },
  recommendationContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  recommendationTitle: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: '600',
    fontSize: '32px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: 'rgba(208, 93, 29, 1)',
    margin: 0,
  },
  recommendationText: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: '400',
    fontSize: '24px',
    lineHeight: '140%',
    letterSpacing: '0%',
    color: 'rgba(255, 255, 255, 1)',
    margin: 0,
  },
  testInformationContainer: {
    width: '100%',
    minHeight: '169px',
    background: 'radial-gradient(146.53% 593.43% at 100% 0%, rgba(255, 255, 255, 0.13) 0%, rgba(30, 30, 30, 0.5) 100%)',
    borderRadius: '12px',
    borderTop: 'none',
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '24px 32px',
    marginBottom: '40px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
    boxSizing: 'border-box',
    backdropFilter: 'blur(4px)',
  },
  testInformationContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  testInformationTitle: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: '600',
    fontSize: '32px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: 'rgba(208, 93, 29, 1)',
    margin: 0,
  },
  testInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  testInfoItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },
  testInfoLabel: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: 'rgba(163, 163, 163, 1)',
  },
  testInfoValue: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: 'rgba(248, 248, 248, 1)',
  },
  resourceMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  resourceMetricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: 'rgba(163, 163, 163, 0.98)',
  },
  resourceValue: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0px',
  },
  resourceCard: {
    width: '100%',
    minHeight: '202px',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)',
    borderRadius: '12px',
    borderTop: 'none',
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '21px 29px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxSizing: 'border-box',
    backdropFilter: 'blur(4px)',
  },
  resourceCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    width: '100%',
  },
  actionButtonsContainer: {
    display: 'flex',
    gap: '24px',
    marginTop: '40px',
    marginBottom: '40px',
  },
  exportButtonWrapper: {
    position: 'relative',
  },
  exportButtonOuter: {
    width: '254px',
    height: '50px',
    border: '1px solid rgba(210, 98, 34, 1)',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  exportButtonInner: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(83, 83, 83, 0.1) 100%)',
    border: '0.5px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '20px',
    padding: '9px 35px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '-1px 2px 4.8px 0px rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box',
  },
  printButton: {
    width: '236px',
    height: '45px',
    background: 'rgba(208, 93, 29, 1)',
    border: '0.5px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '15px',
    padding: '9px 35px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'transform 0.2s',
  },
  buttonText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0%',
    textAlign: 'center',
    color: 'rgba(248, 248, 248, 1)',
  },
  exportDropdown: {
    position: 'absolute',
    top: '55px',
    left: '0',
    width: '254px',
    background: 'rgba(30, 30, 30, 0.95)',
    border: '1px solid rgba(210, 98, 34, 1)',
    borderRadius: '12px',
    overflow: 'hidden',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  dropdownItem: {
    padding: '15px 20px',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '18px',
    color: 'rgba(248, 248, 248, 1)',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'background 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    background: 'radial-gradient(146.53% 593.43% at 100% 0%, rgba(255, 255, 255, 0.13) 0%, rgba(30, 30, 30, 0.95) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    padding: '40px',
    width: '500px',
    maxWidth: '90%',
    backdropFilter: 'blur(10px)',
  },
  modalTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '28px',
    color: 'rgba(248, 248, 248, 1)',
    margin: '0 0 8px 0',
  },
  modalSubtitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '16px',
    color: 'rgba(163, 163, 163, 1)',
    margin: '0 0 30px 0',
  },
  formatOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px',
  },
  formatOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  formatOptionSelected: {
    background: 'rgba(210, 98, 34, 0.15)',
    border: '1px solid rgba(210, 98, 34, 1)',
  },
  formatRadio: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid rgba(163, 163, 163, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  formatRadioInner: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'rgba(210, 98, 34, 1)',
  },
  formatName: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '18px',
    color: 'rgba(248, 248, 248, 1)',
    marginBottom: '4px',
  },
  formatDesc: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '14px',
    color: 'rgba(163, 163, 163, 1)',
  },
  modalActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
  },
  modalCancelBtn: {
    padding: '12px 30px',
    background: 'transparent',
    border: '1px solid rgba(163, 163, 163, 0.5)',
    borderRadius: '10px',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '16px',
    color: 'rgba(248, 248, 248, 1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modalExportBtn: {
    padding: '12px 30px',
    background: 'rgba(210, 98, 34, 1)',
    border: 'none',
    borderRadius: '10px',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '16px',
    color: 'rgba(248, 248, 248, 1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sectionDivider: {
    width: '100%',
    height: '1px',
    border: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    margin: '32px 0',
  },
};
