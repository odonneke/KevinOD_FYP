import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingComponent from './LoadingComponent';
import placeholderImage from './assets/placeholder.jpg';
import './App.css';

const DisplayComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { weight, sex, age, budget, dietaryPreferences } = location.state || {};
  const { vegetarian, vegan, glutenFree, dairyFree } = dietaryPreferences || {};
  const [recipes, setRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [recipeCache, setRecipeCache] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [noMoreRecipes, setNoMoreRecipes] = useState(false);



  // Convert weight to kilograms if in pounds
  const weightInKg = weight ? parseFloat(weight) : 0;

  //Henry Oxford Equations
  const calculateCalories = (weight, age, sex) => {
    let dailyCalories = 0;
    if (sex === "male") {
      if (age >= 0 && age < 3) dailyCalories = 61 * weight - 33.7;
      else if (age < 10) dailyCalories = 23.3 * weight + 514;
      else if (age < 18) dailyCalories = 18.4 * weight + 581;
      else if (age < 30) dailyCalories = 16 * weight + 545;
      else if (age < 60) dailyCalories = 14.2 * weight + 593;
      else dailyCalories = 13.5 * weight + 514;
    } else if (sex === "female") {
      if (age >= 0 && age < 3) dailyCalories = 58.9 * weight - 23.1;
      else if (age < 10) dailyCalories = 20.1 * weight + 507;
      else if (age < 18) dailyCalories = 11.1 * weight + 761;
      else if (age < 30) dailyCalories = 13.1 * weight + 558;
      else if (age < 60) dailyCalories = 9.72 * weight + 694;
      else dailyCalories = 10.1 * weight + 569;
    }
    return dailyCalories * 0.35;
  };

  // Calculate Macros
  const calories = calculateCalories(weightInKg, age, sex);
  const caloriesFromCarbs = calories * 0.55;
  const caloriesFromProtein = calories * 0.15;
  const caloriesFromFat = calories * 0.30;

  const gramsOfCarbs = caloriesFromCarbs / 4;
  const gramsOfProtein = caloriesFromProtein / 4;
  const gramsOfFat = caloriesFromFat / 9;
  const maxPrice = budget;
  // Function to load more recipes
  
  const processAndMatchIngredients = useCallback(async (recipesToProcess) => {
    try {
      const matchedRecipes = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/findIngredients`, {
        recipes: recipesToProcess,
        calories, 
        gramsOfCarbs,
        gramsOfFat,
        gramsOfProtein,
        maxPrice
      });
       const matchedRecipes = response.data.recipes; 
    const comments = response.data.comments; 
    return { matchedRecipes, comments }; 
    } catch (error) {
      console.error("Error matching ingredients:", error);
      return []; //error
    }
  }, [calories,
    gramsOfCarbs,
    gramsOfFat,
    gramsOfProtein,
  maxPrice]);
  //for api call
  const generateDietaryTags = useCallback(() => {
    let tags = ['dinner', 'main dish']; // Default tags
    if (vegetarian) tags.push('vegetarian');
    if (vegan) tags.push('vegan');
    if (glutenFree) tags.push('gluten free');
    if (dairyFree) tags.push('dairy free');
    return tags.join(',');
  }, [vegetarian, vegan, glutenFree, dairyFree]);
  
  // api call
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      //fetch recipes
      const response = await axios({
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random',
        params: { tags: generateDietaryTags(), number: '100', limitLicense: 'true' },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
      });
      const newRecipes = response.data.recipes.filter(recipe => 
        recipe.readyInMinutes <= 30 && !recipeCache.has(recipe.id)
      );
      setRecipeCache(prevCache => {
        newRecipes.forEach(recipe => prevCache.add(recipe.id));
        return prevCache;
      });

      setRecipes(prevRecipes => [...prevRecipes, ...newRecipes]);
      
      const newVisibleRecipes = newRecipes.slice(0, 3);
      //call backend
      const processedRecipes = await processAndMatchIngredients(newVisibleRecipes);
      setVisibleRecipes(prevVisibleRecipes => [...prevVisibleRecipes, ...processedRecipes]);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [processAndMatchIngredients, generateDietaryTags, recipeCache]);
// click more
  const loadMoreRecipes = useCallback(async () => {
    const initialVisibleRecipesLength = visibleRecipes.length;
    const nextIndex = visibleRecipes.length;
    let nextRecipes = recipes.slice(nextIndex, nextIndex + 3);
  
    if (nextRecipes.length === 0) {
      await fetchRecipes();
      nextRecipes = recipes.slice(nextIndex); 
      nextRecipes = nextRecipes.filter(recipe => !recipeCache.has(recipe.id));
      if (nextRecipes.length === 0) {
        setNoMoreRecipes(true);
        return;
      }
    }
  
    if (nextRecipes.length > 0) {
      const processedNextRecipes = await processAndMatchIngredients(nextRecipes);
      setVisibleRecipes(prevVisibleRecipes => [...prevVisibleRecipes, ...processedNextRecipes]);
  
      if (visibleRecipes.length === initialVisibleRecipesLength) {
        setNoMoreRecipes(true);
      } else {
        setNoMoreRecipes(false); // New recipes were successfully loaded
      }
    }
  }, [recipes, visibleRecipes, processAndMatchIngredients, fetchRecipes, recipeCache]);
  

  
//init hook
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

//to leave webapp
  const confirmNavigation = () => {
    const userConfirmed = window.confirm("Are you sure you are ready to take the survey?");
    if (userConfirmed) {
     
      window.location.href = 'https://forms.gle/b8TfAZEz3EG5ayB1A'; 
    }
  };

  // for loading
  if (loading) {
    return <LoadingComponent />;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
//html return 
  return (
    <div>
    <div className="main-container">
      <h1 className="title">BudgetEatz</h1>
      <h3 className="under"> Scroll down to see more recipes or to load more!</h3>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          {visibleRecipes.length > 0 ? (
        visibleRecipes.map((recipe, index) => (
          <div key={index} className="ft-recipe">
            <div className="ft-recipe__thumb">
              <img src={recipe.image || placeholderImage} alt={recipe.title} />
              <h3>{recipe.title || 'Placeholder Name'}</h3>
            </div>
            <div className="ft-recipe__content">
              <header className="content__header">
                <h3 className="summary-title">Recipe Summary</h3> {/* Title outside the container */}
                <div className="summary-container">
                  <p>{recipe.e} The adjusted cost of this recipe is €{recipe.totalPrice || 'Calculating...'}</p>
                </div>
                  <div className="comments-container">
                      {comments && <p>{comments}</p>}
                  </div>
                <h3>Adjusted Recipe Macros:</h3>
                <table className="macros-table">
                  <tbody>
                    <tr>
                      <th>Calories</th>
                      <td>{recipe.recipeNutritionalInformation.calories.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>Protein</th>
                      <td>{recipe.recipeNutritionalInformation.protein.toFixed(2)} g</td>
                    </tr>
                    <tr>
                      <th>Fat</th>
                      <td>{recipe.recipeNutritionalInformation.fat.toFixed(2)} g</td>
                    </tr>
                    <tr>
                      <th>Carbs</th>
                      <td>{recipe.recipeNutritionalInformation.carbohydrates.toFixed(2)} g</td>
                    </tr>
                  </tbody>
                </table>
                <div className="edited-meal-info">
                  <strong>We have edited your meal to fit your calculated calories & budget:</strong>
                  <ul>
                    <li>Total Dinner Calories (kCals): {calories.toFixed(2)}</li>
                    <li>Budget: €{maxPrice.toFixed(2)}</li>
                  </ul>
                  <strong>Your ideal macros are:</strong>
                  <ul>
                    <li>Protein: {gramsOfProtein.toFixed(2)} g</li>
                    <li>Carbohydrates: {gramsOfCarbs.toFixed(2)} g</li>
                    <li>Fat: {gramsOfFat.toFixed(2)} g</li>
                  </ul>
                  <strong>Cooking Time:</strong>
                  <ul>
                    <li>All recipes should take less than 30 minutes to prepare!</li>
                  </ul>
                  <p><strong>Seasoning will be found at the link below. Please season to taste.</strong></p>
                </div>
              </header>
              <h3>Adjusted Ingredients: to be used in the recipe found below! </h3>
              {}
              <div className="ingredient-container">
                {recipe.extendedIngredients && recipe.extendedIngredients.map((ingredientPair, ingIndex, arr) => {
                  const isLastOdd = arr.length % 2 !== 0 && ingIndex === arr.length - 1;
                  return (
                    ingredientPair.matches && ingredientPair.matches.length > 0 && (
                      <div key={ingIndex} className={`ingredient-card ${isLastOdd ? 'centered' : ''}`}>
                        <div className="ingredient-details">
                          <h4 className="ingredient-title">{capitalizeFirstLetter(ingredientPair.original?.name) || "Unknown"}</h4>
                          {ingredientPair.matches.map((match, matchIndex) => (
                            <div key={matchIndex} className="ingredient-match">
                              <p>Price: €{ingredientPair.price || '0.00'}</p>
                              <p>Adjusted Weight: {ingredientPair.adjustedWeight} grams</p>
                              <p>Calories: {ingredientPair.nutritionalInfo.calories.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
              <footer className="content__footer">
              <div class="link-instructions-container">
              <p>You will find your pre-adjusted recipe by clicking the 'Go to Recipe' button.</p>
              <p>Remember to use the above adjusted ingredient weights instead!</p>
              <p>If the recipe does not appear or there was some error, please hover your cursor over the 'Invalid Link' button.</p>
            </div>
              <div className="button-group">
                <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="recipe-button">Go to Recipe</a>
                <a href="https://spoonacular.com/articles" target="_blank" rel="noopener noreferrer" className="recipe-button">Invalid Link
                  <span className="tooltip-text">
                    <div className="tooltip-item">
                      <strong>How to use?</strong>
                      <ul>
                        <li>Click this button 'Invalid link'</li>
                        <li>search the recipe title</li>
                        <li>filter by recipe</li>
                        <li>select recipe</li>
                      </ul>
                    </div>
                  </span>
                </a>
              </div>
            </footer>


            </div>
          </div>
        ))
        ) : (
          <div className="message">Recipes could not be found within your given budget. Please Return.</div>
        )}

        {noMoreRecipes && (
          <div className="message">No more recipes could not be found within your given budget.</div>
        )}
      </>
    )}
    {visibleRecipes.length < recipes.length && (
      <button onClick={loadMoreRecipes} className="load-more">Load More</button>
    )}
  </div>
  <button onClick={() => navigate('/form')} className="external-link-button-top-left">
      Back
  </button>
  <button onClick={confirmNavigation} className="external-link-button-top-right">
      Survey Link
  </button>
</div>
);
};

export default DisplayComponent;
