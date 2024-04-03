import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FC.css'; 

const FormComponent = () => {
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [sex, setSex] = useState('');
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [dairyFree, setDairyFree] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmitted(true);
    let newErrors = {};
    if (!age || age < 0) newErrors.age = 'ERROR: Positive age is required';
    if (!sex) newErrors.sex = 'ERROR: Sex is required';
    if (!budget || budget < 0) newErrors.budget = 'ERROR: Positive Budget is required';
    if ((!weightKg && !weightLbs) || (weightKg && weightLbs) || weightKg < 0 || weightLbs < 0) {
      newErrors.weight = 'ERROR: Positive KG or Lbs weight, not both';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const userData = { 
        age, 
        weight: weightKg || (weightLbs * 0.45), 
        sex, 
        budget,
        dietaryPreferences: {
          vegetarian,
          vegan,
          glutenFree,
          dairyFree
        }
      };
      navigate('/display', { state: userData });
    }
    
  };

  return (
    <body id="specific-page">
    <div className="container">
      <h1 className="title">BudgetEatz</h1>
      <div className="descriptor-container">
      <div className="descriptor"> Enter your details and click 'Get Your Recipes' to find personalised dinner recipes! Each recipe is for one person. </div>
      </div>
      <div className="screen">
        <div className="screen__content">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__field">
            
              <div className="descriptor2"> Enter your details here </div>
      
              <i className="form__icon1 fas fa-user"></i>
              <input
                type="number"
                className="form__input"
                placeholder="Age"
                value={age}
                onChange={(e) => { setAge(e.target.value); setErrors({ ...errors, age: '' }); }}
              />
               {hasSubmitted && errors.age && <div className="form__error">{errors.age}</div>}
            </div>
            <div className="form__field">
              <i className="form__icon2 fas fa-weight"></i>
              <input
                type="number"
                className="form__input"
                placeholder="Weight Kg or..."
                value={weightKg}
                onChange={(e) => { setWeightKg(e.target.value); setErrors({ ...errors, weight: '' }); }}
              />
              <input
                type="number"
                className="form__input"
                placeholder="Weight Lbs"
                value={weightLbs}
                onChange={(e) => { setWeightLbs(e.target.value); setErrors({ ...errors, weight: '' }); }}
                style={{ marginTop: '10px' }}
              />
              {hasSubmitted && errors.weight && <div className="form__error_weight">{errors.weight}</div>}
            </div>
               <div className="form__field">
                <i className="form__icon3 fas fa-venus-mars"></i>
                <select
                  className="form__input"
                  placeholder="Sex"
                  value={sex}
                  onChange={(e) => { setSex(e.target.value); setErrors({ ...errors, sex: '' }); }}
                >
                  <option value="" disabled>Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {hasSubmitted && errors.sex && <div className="form__error">{errors.sex}</div>}
              </div>
            <div className="form__field">
              <i className="form__icon4 fas fa-euro-sign"></i>
              <input
                type="number"
                className="form__input"
                placeholder="Budget for this meal (€)"
                value={budget}
                onChange={(e) => { setBudget(parseFloat(e.target.value) || ''); setErrors({ ...errors, budget: '' }); }}
              />
               {hasSubmitted && errors.budget && <div className="form__error">{errors.budget}</div>}
            </div>
            <div className="dietary-requirements-container">
            <div className="form__field dietary-requirements">
              <h3>Dietary Requirements</h3>
              <div className="toggle-container">
                <label className="toggle" htmlFor="vegetarian">
                  <input type="checkbox" className="toggle__input" id="vegetarian" checked={vegetarian} onChange={(e) => setVegetarian(e.target.checked)} />
                  <span className="toggle-track">
                    <span className="toggle-indicator">
                      <span className="checkMark"></span>
                    </span>
                  </span>
                  Vegetarian
                </label>
                <label className="toggle" htmlFor="vegan">
                  <input type="checkbox" className="toggle__input" id="vegan" checked={vegan} onChange={(e) => setVegan(e.target.checked)} />
                  <span className="toggle-track">
                    <span className="toggle-indicator">
                      <span className="checkMark"></span>
                    </span>
                  </span>
                  Vegan
                </label>
                <label className="toggle" htmlFor="glutenFree">
                  <input type="checkbox" className="toggle__input" id="glutenFree" checked={glutenFree} onChange={(e) => setGlutenFree(e.target.checked)} />
                  <span className="toggle-track">
                    <span className="toggle-indicator">
                      <span className="checkMark"></span>
                    </span>
                  </span>
                  Coeliac
                </label>
                <label className="toggle" htmlFor="dairyFree">
                  <input type="checkbox" className="toggle__input" id="dairyFree" checked={dairyFree} onChange={(e) => setDairyFree(e.target.checked)} />
                  <span className="toggle-track">
                    <span className="toggle-indicator">
                      <span className="checkMark"></span>
                    </span>
                  </span>
                  Dairy-Free
                </label>
              </div>
            </div>
          </div>
            <button className="button form__submit">
              <span className="button__text">Get Your Recipes</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
    </body>
  );
};

export default FormComponent;
