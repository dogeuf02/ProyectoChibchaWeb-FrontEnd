const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

export default getTodayDate;