export const authStyles = () => ({
    form: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    input: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px'
      }
    },
    button: {
      py: 1.5,
      borderRadius: '12px',
      textTransform: 'none',
      fontSize: '1rem',
      fontWeight: 600
    }
  });