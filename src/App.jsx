import React, { useState, useEffect } from 'react';
import './App.css';
import foodData from './foodData'; // Import food data

const App = () => {
  const [food, setFood] = useState('');
  const [weight, setWeight] = useState('');
  const [entries, setEntries] = useState(() => {
    const stored = localStorage.getItem('foodEntries');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('foodEntries', JSON.stringify(entries));
  }, [entries]);

  // Regex for validating food input (only alphabetic characters and spaces)
  const isValidFoodName = (food) => {
    const regex = /^[A-Za-z\s0-9]+$/;
    return regex.test(food);
  };

  // Calculate nutrition based on weight
  const calculateNutrition = (food, weight) => {
    const info = foodData[food]; // Use imported food data
    if (!info) return { calories: 0, protein: 0 };

    const [standardWeight, caloriesPerStandardWeight, proteinPerStandardWeight] = info;

    // Calculate the nutrition based on the input weight
    const calories = ((weight * caloriesPerStandardWeight) / standardWeight).toFixed(2);  // Limiting to 3 decimal places
    const protein = ((weight * proteinPerStandardWeight) / standardWeight).toFixed(2);  // Limiting to 3 decimal places

    return {
      calories,
      protein
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the food name is valid before proceeding
    if (!isValidFoodName(food)) {
      alert("Please enter a valid food name!");
      return;
    }

    const { calories, protein } = calculateNutrition(food, weight);
    setEntries([...entries, { food, weight, calories, protein }]);
    setFood('');
    setWeight('');
  };

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleUpdate = (index, updatedFood, updatedWeight) => {
    const { calories, protein } = calculateNutrition(updatedFood, updatedWeight);
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      food: updatedFood,
      weight: updatedWeight,
      calories,
      protein,
    };
    setEntries(updatedEntries);
  };

  // Calculate total calories and total protein
  const calculateTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;

    entries.forEach(entry => {
      totalCalories += parseFloat(entry.calories);
      totalProtein += parseFloat(entry.protein);
    });

    return { totalCalories, totalProtein };
  };

  const { totalCalories, totalProtein } = calculateTotals();

  return (
    <div className="app">
      <div className="tracker-container">
        <h1 className="title">🍽️ Food Nutrition Tracker</h1>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            placeholder="Food name"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Weight (gms)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <button type="submit">Add</button>
        </form>

        <div className="entries">
          {entries.map((entry, idx) => (
            <div key={idx} className="entry">
              <div>
                <input
                  type="text"
                  value={entry.food}
                  onChange={(e) => handleUpdate(idx, e.target.value, entry.weight)}
                  className="editable-input"
                />
                <input
                  type="number"
                  value={entry.weight}
                  onChange={(e) => handleUpdate(idx, entry.food, e.target.value)}
                  className="editable-input"
                />
                <p className="nutrient">Calories: <span>{entry.calories}</span> kcal</p>
                <p className="nutrient">Protein: <span>{entry.protein}</span> g</p>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(idx)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Total Calories and Protein Table */}
        <div className="totals">
          <h2>Total Nutrition</h2>
          <table>
            <thead>
              <tr>
                <th>Total Calories</th>
                <th>Total Protein</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalCalories.toFixed(2)} kcal</td> {/* Limit to 3 decimal places */}
                <td>{totalProtein.toFixed(2)} g</td> {/* Limit to 3 decimal places */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
