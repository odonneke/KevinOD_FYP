
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const corsOptions = {
  origin: 'https://fypkod.netlify.app', 
  optionsSuccessStatus: 200,
};



//descriptive words 
const descriptiveWords = [
    "fresh",
    "regular",
    "old", 
    "ripe", 
    "chopped", 
    "diced", 
    "sliced", 
    "crushed", 
    "minced", 
    "julienned", 
    "grated", 
    "shredded", 
    "cubed", 
    "whole", 
    "smashed", 
    "pureed", 
    "fermented", 
    "marinated", 
    "caramelized",
    "toasted",
    "roasted",
    "blanched",
    "braised",
    "stewed",
    "browned",
    "charred",
    "glazed",
    "emulsified",
    "seared",
    "poached",
    "simmered",
    "whipped",
    "zested",
    "flaked",
    "mashed",
    "pickled",
    "raw",
    "wilted",
    "dehydrated",
    "reduced",
    "clarified",
    "infused",
    "seasoned",
    "battered",
    "drizzled",
    "folded",
    "spiralized",
    "chilled",
    "frozen",
    "molten",
    "tenderized",
    "steamed",
    "purple"
  ];
  // seasonings
  const seasonings = [
    "salt",
    "garlic powder",
    "kosher salt",
    "kosher salt and pepper",
    "kosher salt & pepper",
    "sea salt", 
    "coarse salt",
    "oregano powder",
    "course salt & pepper",
    "coarse salt and ground pepper",
    "goya seasoning",
    "course salt & ground pepper",
    "pepper", 
    "ground pepper",
    "cracked pepper",
    "grill seasoning",
    "salt and pepper",
    "salt & pepper",
    "poultry seasoning",
    "teapoon pepper",
    "cayenne", 
    "chili powder", 
    "chilli",
    "cumin",
    "cumin powder",
    "curry leaves",
    "cilantro", 
    "paprika", 
    "turmeric", 
    "oregano", 
    "thyme", 
    "ground thyme",
    "rosemary", 
    "basil", 
    "basil leaves",
    "sage", 
    "coriander", 
    "cloves", 
    "nutmeg", 
    "cinnamon", 
    "bay leaf", 
    "chilis",
    "cardamom", 
    "ginger", 
    "garlic powder",
    "Garlic",
    "suya pepper",
    "corn starch",
    "onion powder",
    "mustard seeds",
    "fennel seeds",
    "dill",
    "mint",
    "parsley",
    "marjoram",
    "tarragon",
    "white pepper",
    "black pepper",
    "chili flakes",
    "lemon pepper",
    "curry powder",
    "garam masala",
    "za'atar",
    "sumac",
    "star anise",
    "saffron",
    "caraway seeds",
    "celery seed",
    "chervil",
    "ranch seasoning",
    "pork seasoning mix",
    "lovage",
    "fenugreek",
    "lavender",
    "lemongrass",
    "mace",
    "anise",
    "allspice",
    "juniper berries",
    "horseradish powder",
    "smoked paprika",
    "herbes de Provence",
    "italian seasoning",
    "old Bay seasoning",
    "ras el hanout",
    "chinese five spice",
    "water",
    "poultry seasoning",
    "cajun seasoning",
    "pepper flakes",
    "cilantro leaves"
  ];
  
  // sister words
  const sisterWords = {
    "prawns": "shrimp", 
    "sea bass": "fish fillets",
    "rotisserie": "whole",
    "craisins": "raisins",
    "prawn": "shrimp", 
    "hamburger": "burger",
    "guacamole": "avocado",
    "shrimp": "King Prawns", 
    "barbecue": "bbq",
    "breast": "fillet",
    "breasts": "fillets",
    "tenders": "fillets",
    "Philadelphia": "cream cheese",
    "Tortilla Wraps": "Tortillas",
    "Tortillas": "Tortilla Wraps",
    "broth": "stock", 
    "ground" : "mince",
    "aubergine": "eggplant", 
    "courgette": "zucchini", 
    "capsicum": "bell pepper", 
    "coriander": "cilantro", 
    "icing": "frosting", 
    "biscuit": "cookie", 
    "sultana": "raisin",
    "non-fat": "reduced fat",
    "reduced fat": "light",
    "reduced fat mayo": "mayonnaise light",
    "caster sugar": "superfine sugar",
    "mexican cheese": "White Reduced Fat Cheese",
    "icing sugar": "powdered sugar",
    "cornflour": "cornstarch",
    "spring onion": "scallions",
    "green onion tops": "scallions",
    "green onion": "scallions",
    "rocket": "arugula",
    "fillet": "filet",
    "gelatine": "gelatin",
    "beetroot": "beet",
    "marrow": "squash",
    "swede": "rutabaga",
    "tzatziki": "yogurt",
    "porridge oats": "rolled oats",
    "wholemeal flour": "whole wheat flour",
    "double cream": "heavy cream",
    "single cream": "light cream",
    "digestive biscuit": "graham cracker",
    "demerara sugar": "turbinado sugar",
    "mince": "ground meat",
    "cling film": "plastic wrap",
    "aluminium foil": "aluminum foil",
    "treacle": "molasses",
    "mangetout": "peas",
    "French beans": "green beans",
    "broad beans": "fava beans",
    "pepper": "capsicum", 
    "polenta": "cornmeal",
    "chilli": "chili",
    "soya": "soy",
    "tinned": "canned",
    "fairy cake": "cupcake",
    "stewing beef": "beef chuck",
    "gammon": "ham",
    "self-raising flour": "self-rising flour",
    "bicarbonate of soda": "baking soda",
    "tattie": "potato",
    "neep": "turnip",
    "fettucine": "spaghetti",
    "linguine": "spaghetti",
    "bucatini": "spaghetti",
    "Tagliatelle": "spaghetti",
    "ritoni": "Fusilli",
    "broccolini": "broccoli"
  };

  

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const pool = mysql.createPool({
  connectionLimit: 10, 
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// find Matches (api to database) rand
async function findIngredient(ingredientName) {
    
    let ingredientWords = ingredientName.toLowerCase().split(' ');
    
    ingredientWords = ingredientWords.filter(word => 
      !descriptiveWords.includes(word));

    
    let ingredientPhrase = ingredientWords.join(' ');

    if (seasonings.includes(ingredientPhrase)) {
        return []; 
    }

    //Prepare search patterns considering plurals and sister words
    let searchPatterns = ingredientWords.flatMap(word => {
        let patterns = [word];
        if (sisterWords[word]) {
            patterns.push(sisterWords[word]);
        }
        //plural/singular
        if (word.endsWith('s')) {
            patterns.push(word.slice(0, -1)); //single
        } else {
            patterns.push(word + 's'); //plural
        }
        return patterns;
    });

    //SQL query the database with created patterns
    const queryDatabase = async (searchTerm) => {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => { // Get a connection from the pool
          if (err) {
            return reject(err);
          }
          connection.query('SELECT name, price, unit, nutritional_unit, nutritional_value, calories, fat, saturates, carbohydrates, sugars, fibre, protein, salt FROM heroku_7f5184c88fb9883.ingredients ingredients WHERE name LIKE ?', [`%${searchTerm}%`], (error, results) => {
            connection.release(); // Release the connection back to the pool
            connection.end();
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
        });
      });
    };
    
    let combinedResults = [];
    for (let pattern of searchPatterns) {
      let results = await queryDatabase(pattern);
      combinedResults = [...combinedResults, ...results];
    }
  
    combinedResults = combinedResults.filter((result, index, self) => 
      index === self.findIndex((t) => t.place === result.place && t.name === result.name));

    //prioritizing exact or close matches
    combinedResults = combinedResults.map(result => {
      let resultWords = result.name.toLowerCase().split(' ');
      let overlap = searchPatterns.filter(pattern => resultWords.includes(pattern)).length;
      let extraWords = resultWords.length - overlap; 
      let isPerfectMatch = overlap === searchPatterns.length && extraWords === 0;
      let isCloseMatch = overlap === searchPatterns.length;

      //deduct if seasoning or descruptive is included 
      let penalty = resultWords.reduce((acc, word) => {
        if (seasonings.includes(word) || descriptiveWords.includes(word)) {
          return acc + 0.1;
        }
        return acc;
      }, 0);

      return { 
        ...result, 
        overlap, 
        extraWords, 
        isPerfectMatch, 
        isCloseMatch,
        score: overlap - extraWords * 0.1 - penalty
      };
    });

    //sort y best match 
    combinedResults.sort((a, b) => {
      if (a.isPerfectMatch && !b.isPerfectMatch) return -1;
      if (!a.isPerfectMatch && b.isPerfectMatch) return 1;
      if (a.isCloseMatch && !b.isCloseMatch) return -1;
      if (!a.isCloseMatch && b.isCloseMatch) return 1;
      if (a.score !== b.score) return b.score - a.score;
      
      //same score then prefer the one with less descriptive or seasoning words
      return a.extraWords - b.extraWords; 
    });
    
    return combinedResults.slice(0, 1); // Return top match
}


  
//fetch recipes and find ingredients in the database onlin
app.post('/api/findIngredients', async (req, res) => {
    try {
      const recipes = req.body.recipes;
      const targetCalories = req.body.calories;
      const maxTotalPrice = req.body.maxPrice;
      for (let recipe of recipes) {
        let totalRecipePrice = 0;
        const processedIngredients = new Set();
        //comment 
        let recipeNutritionalInformation = {
          calories: 0,
          fat: 0,
          saturates: 0,
          carbohydrates: 0,
          sugars: 0,
          fibre: 0,
          protein: 0,
          salt: 0,
        };
        const servings = recipe.servings;
        const ingredientPromises = recipe.extendedIngredients.filter(ingredient => {
          //check if ingredient has been processed; if not, add it to the set and proceed
          const ingredientName = ingredient.nameClean.toLowerCase();
          if (!processedIngredients.has(ingredientName)) {
            processedIngredients.add(ingredientName);
            return true; //keep this ingredient for processing
          }
          return false; // Skip dupe
        }).map(async ingredient => {
          const matchedIngredients = await findIngredient(ingredient.name);
          let ingredientPrice = 0;
          let nutritionalInfo = {};
          let ingredientWeight =0;
          if (matchedIngredients.length > 0) {
            // Assuming the first match is the best one
            const match = matchedIngredients[0];
            const pricePerUnit = parseFloat(match.price);
            const amount = parseFloat(ingredient.measures.metric.amount);
            const unit = ingredient.measures.metric.unitShort.toLowerCase();
            const databaseUnit = match.unit.toLowerCase();
            const normalizedUnit = normalizeUnit(unit);

          
            const isDescriptiveUnit = unit => ['small', 'medium', 'large', 'each'].includes(unit);
            const needsSpecialHandlingForStockOrBroth = ingredientName => {
              const lowerCaseName = ingredientName.toLowerCase();
              return lowerCaseName.includes("stock") || lowerCaseName.includes("broth");
            };
            
            const needsDiscrepancyHandling = (!(databaseUnit === 'each' && (unit === '' || isDescriptiveUnit(unit))) &&
                        !(normalizedUnit || (databaseUnit === 'each' && !normalizedUnit))) ||
                        (needsSpecialHandlingForStockOrBroth(ingredient.name) && (unit === 'g' || unit === 'ml'));

            
            if (needsDiscrepancyHandling) {
              //handleUnitDiscrepancy
              const grams = handleUnitDiscrepancy(ingredient.name, amount, unit); //get grams
              ingredientWeight = (grams/ servings) //divide by no.of sevrings - keeps ingreident balance
              ingredientPrice = pricePerUnit * ingredientWeight; // get new price
              nutritionalInfo = calculateNutritionalInfo(match, ingredientWeight); //
            } else {
              // Direct calculation if no discrepancy handling is needed
              ingredientWeight = (amount/ servings)
              ingredientPrice = pricePerUnit * ingredientWeight;
              nutritionalInfo = calculateNutritionalInfo(match, ingredientWeight);
              
            }
          
            
            totalRecipePrice += ingredientPrice ;
            for (const key in recipeNutritionalInformation) {
              recipeNutritionalInformation[key] += nutritionalInfo[key];
            }
          }
          return {
            original: ingredient, //original ingredient from API
            matches: matchedIngredients, //matched ingredients from the database
            price: ingredientPrice.toFixed(2),
            adjustedWeight: ingredientWeight.toFixed(2),
            nutritionalInfo
          }
        }); //perfect to here
      
        const matchedIngredients = await Promise.all(ingredientPromises);
        
      
        const actualCalories = recipeNutritionalInformation.calories;
        const factor = targetCalories / actualCalories;
        
    
        for (const key in recipeNutritionalInformation) {
          recipeNutritionalInformation[key] *= factor;
        }
        totalRecipePrice *= factor;// couldnt calculate it this way 
        
      // Adjust each matched ingredient's price and nutritional info based on the factor
      const adjustedMatchedIngredients = matchedIngredients.map(ingredient => {
        ingredient.price = (parseFloat(ingredient.price) * factor).toFixed(2);
        ingredient.adjustedWeight = (parseFloat(ingredient.adjustedWeight) * factor).toFixed(2);
        for (const key in ingredient.nutritionalInfo) {
          ingredient.nutritionalInfo[key] *= factor;
        }
        return ingredient;
      });
      

      
      let proportioanlityComments ="This meal is ";
      //const meetsFatCriteria = Math.abs(recipeNutritionalInformation.fat - targetFat) / targetFat;
      //const meetsCarbsCriteria = Math.abs(recipeNutritionalInformation.carbohydrates - targetCarbs) / targetCarbs ;
      //const meetsProteinCriteria = Math.abs(recipeNutritionalInformation.protein - targetProtein) / targetProtein ;

      // A high-fat diet (HFD) is a diet consisting of at least 35% of total calories is consumed from fats, both unsaturated and saturated.  https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/high-fat-diet
      // Low-fat diets are food where 30% or less of the calories come from fat. 

      // Low-carbohydrate (LC) diets, subdividable into very-low and low-CHO diets are defined by a proportion of less than 10% (20–50 g) and 26% (<130 g) of total caloric intake and a compensatory shift to proteins and fat as the energy source [3]. https://www.mdpi.com/2072-6643/14/3/423
      // In the high-carbohydrate diet, 25 percent of the energy was in the form of fat and 60 percent in the form of carbohydrates https://www.nejm.org/doi/full/10.1056/nejm198809293191304

      // a high protein (HP) meal (41% of energy from protein, 29% from carbohydrates) or isocaloric standard meal (15% from protein, 46% from carbohydrate). https://www.sciencedirect.com/science/article/pii/S0261561419302699

      const totalMacros = recipeNutritionalInformation.fat + recipeNutritionalInformation.carbohydrates + recipeNutritionalInformation.protein;
      
      const percentageFat = (recipeNutritionalInformation.fat / totalMacros) *100;
      const percentageProtein = (recipeNutritionalInformation.protein / totalMacros)*100;
      const percentageCarb = (recipeNutritionalInformation.carbohydrates / totalMacros)*100;

      console.log(`Proportions: total - ${totalMacros}, Fat: ${recipeNutritionalInformation.fat}, Pro: ${recipeNutritionalInformation.protein}, Carb: ${recipeNutritionalInformation.carbohydrates}}`);
      console.log(`      Fat: ${percentageFat}, Pro: ${percentageFat}, Carb: ${percentageCarb}}`);

      let valid = false; 
      if(totalMacros > 0 && recipeNutritionalInformation.fat >=0 && recipeNutritionalInformation.protein >=0 && recipeNutritionalInformation.carbohydrates >= 0){
        valid = true;
      }else{
        valid = false; 
      }
      // fat proportion
      if(percentageFat >= 35){
        proportioanlityComments += "high fat, ";
      } else if (percentageFat < 30) {
        proportioanlityComments += "low fat, ";
      } else if (percentageFat < 35 && percentageFat >= 30){
        proportioanlityComments += "within recommended fat levels, ";
      }

      // carb proportioanlity
      if(percentageCarb >= 60){
        proportioanlityComments += "high carb, ";
      } else if (percentageCarb < 26) {
        proportioanlityComments += "low carb, ";
      } else if (percentageCarb < 60 && percentageCarb >= 26){
        proportioanlityComments += "within recommended carbohydrate levels, ";
      }

      // protein proportioanlity
      if(percentageProtein >= 40){
        proportioanlityComments += "and high protein.";
      } else if (percentageProtein < 15) {
        proportioanlityComments += "and low protein.";
      } else if (percentageProtein < 40 && percentageProtein >= 15){
        proportioanlityComments += "and within recommended protein levels.";
      }

      if(totalRecipePrice.toFixed(2) <= maxTotalPrice && valid === true){
        // If the recipe meets all criteria, add it to the filtered list
      recipe.extendedIngredients =adjustedMatchedIngredients; 
      recipe.totalPrice = totalRecipePrice.toFixed(2);
      recipe.recipeNutritionalInformation = recipeNutritionalInformation;
      recipe.e = proportioanlityComments;
      }else{
        return;
      }
  }
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server failed to process request", error: error });
  }
});

 


  function calculateNutritionalInfo(ingredient, amount) {
    // Convert amount to g
    const gramAmount = amount;
    const factor = gramAmount / 100;
    
    return {
      calories: ingredient.calories * factor,
      fat: ingredient.fat * factor,
      saturates: ingredient.saturates * factor,
      carbohydrates: ingredient.carbohydrates * factor,
      sugars: ingredient.sugars * factor,
      fibre: ingredient.fibre * factor,
      protein: ingredient.protein * factor,
      salt: ingredient.salt * factor,
    };

  }
  function normalizeUnit(unit) {
    const unitsMap = {
      'g': true,
      'grams': true,
      'ml': true,
      'gs': true,
      'mls': true,
      'millilitres': true
    };
    return unitsMap[unit] ? true : false;
  }
  
  function handleUnitDiscrepancy(ingredient, amount, unit) {
    // Normalize 
    const normalizedUnit = unit.toLowerCase().replace('tbsps', 'tbsp').replace('tsps', 'tsp').replace('kgs', 'kilo').replace('cups', 'cup').replace('cans', 'can').replace('slices', 'slice');
    let grams = 0;
  
    // Basic conversions
    const conversions = {
      'kilo': 1000,
      'kilogram': 1000,
      'pkg': 1000,
      'tsp': 5,
      'tbsp': 15, 
      'cup': 240, 
      'can': 318, 
      'stick': 120, 
      'slice': 15
    };
  
    //pecific ingredient conversions
    const ingredientConversions = {
      'tomatoes': 40,
      'egg white': 30,
      'egg': 50,
      'tortilla': 60,
      'potato': 120,
      'potatoes': 120,
      'tomato': 40,
      'broccolini': 150,
      'bell pepper': 166,
      'mozzarella': 125, // assuming large only, for simplicity
      'parmesan cheese': 14.7,
      'pepperoni': 80,
      'rice': 60,
      'pasta': 75,
      'canned biscuits': 60,
      'breast': 174,
      'fillet': 174,
      'onion': 200,
      'slice': 30,
      'garlic': 6,
      'tortillas': 60,
      'asparagus': 20,
      'lime': 70,
      'sausage': 40,
      'buns': 80, 
      'pork sausages': 40,
      'jalapeño': 20,
      'pizza dough': 250,
      'pork': 120,
      'carrot': 75,
      'celery': 60,
      'broth': 7, // Handled separately
      'stock': 7,
      'cheese': 40
    };
  
    // Check for direct conversion
    if (conversions[normalizedUnit]) {
      grams = amount * conversions[normalizedUnit];
    } else {
  
      const ingredientName = ingredient.toLowerCase();
      for (let key in ingredientConversions) {
        if (ingredientName.includes(key) || ingredientName + 's' === key || key + 's' === ingredientName) {
          // chicken broth as it involves database unit conversion
          if ((key === 'chicken broth' || key === 'vegetable broth' || key === 'chicken stock' || key === 'vegetable stock' || key === 'fish stock' || key === 'fish broth'
          || key === 'beef broth' || key === 'beef stock') && (unit === 'ml' || unit==='gram' || unit ==='kg' || unit==='l')) {
            if(unit ==='kg' || unit==='l'){
              amount = amount * 1000; // amount in ml
            }
            grams = (amount / 500) * 7;
          } else {
            grams = amount * ingredientConversions[key];
          }
          break;
        }
      }
    }
  
    return grams;
  }
  


const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const gracefulShutdown = (signal) => {
  console.log(`${signal} signal received: closing HTTP server and MySQL pool.`);
  server.close(() => {
    console.log('HTTP server closed.');
    pool.end((err) => {
      if (err) {
        console.error('Failed to close MySQL pool', err);
      } else {
        console.log('MySQL pool closed');
      }
      process.exit(err ? 1 : 0);
    });
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
