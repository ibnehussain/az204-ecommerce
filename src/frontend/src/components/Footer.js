import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--text-primary)',
      color: 'white',
      padding: '2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Azure E-commerce Demo</h3>
            <p style={{ color: '#ccc', lineHeight: 1.6 }}>
              A progressive demonstration of Azure services integration in a real-world e-commerce application.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Azure Services</h4>
            <ul style={{ listStyle: 'none', color: '#ccc' }}>
              <li style={{ marginBottom: '0.5rem' }}>App Service</li>
              <li style={{ marginBottom: '0.5rem' }}>Azure Functions</li>
              <li style={{ marginBottom: '0.5rem' }}>Cosmos DB</li>
              <li style={{ marginBottom: '0.5rem' }}>Blob Storage</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Course Modules</h4>
            <ul style={{ listStyle: 'none', color: '#ccc' }}>
              <li style={{ marginBottom: '0.5rem' }}>Identity & Authentication</li>
              <li style={{ marginBottom: '0.5rem' }}>Key Vault</li>
              <li style={{ marginBottom: '0.5rem' }}>API Management</li>
              <li style={{ marginBottom: '0.5rem' }}>Application Insights</li>
            </ul>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid #555',
          paddingTop: '1rem',
          textAlign: 'center',
          color: '#ccc'
        }}>
          <p>&copy; 2025 Azhar. All rights reserved.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Azure Developer Course - Demo application for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;