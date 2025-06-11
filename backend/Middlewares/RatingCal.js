const calculateAverageRating = (portfolio) => {
  const ratings = portfolio.rating || [];
  if (ratings.length === 0) {
    portfolio.averageRating = 0;
  } else {
    const avg = ratings.reduce((sum, val) => sum + val, 0) / ratings.length;
    portfolio.averageRating = parseFloat(avg.toFixed(2));
  }
};

module.exports = { calculateAverageRating };
