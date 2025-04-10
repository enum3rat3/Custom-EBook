import React from 'react';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const CustomLoadingPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>
        <AutoStoriesIcon style={{ fontSize: 80, color: '#1F2937' }} />
      </div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 1s ease-in-out',
  },
  icon: {
    animation: 'bounce 2s infinite',
  },
  text: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#1F2937',
    fontWeight: '500',
    fontFamily: 'sans-serif',
  },
};

// Inject animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`, styleSheet.cssRules.length);

export default CustomLoadingPage;
