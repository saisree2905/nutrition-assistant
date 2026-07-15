const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  return Math.round(bmi * 10) / 10;
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

const getCalorieNeeds = (weight, height, age, gender, activityLevel) => {
  let bmr;

  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else if (gender === 'female') {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  } else {
    return null;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
  
  return {
    bmr: Math.round(bmr),
    tdee,
    proteinGrams: Math.round(weight * 0.8),
    carbsGrams: Math.round((tdee * 0.5) / 4),
    fatGrams: Math.round((tdee * 0.3) / 9),
  };
};

module.exports = {
  calculateBMI,
  getBMICategory,
  getCalorieNeeds,
};
