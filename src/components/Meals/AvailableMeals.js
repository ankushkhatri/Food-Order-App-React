import { useEffect, useState } from "react";

import classes from "./AvailableMeals.module.css";
import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = () => {
   const [meals, setMeals] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [httpError, setHttpError] = useState();

   useEffect(() => {
      const fetchMeals = async () => {
         const response = await fetch(
            "https://react-http-9c349-default-rtdb.firebaseio.com/meals.json"
         );

         if (!response.ok) {
            throw new Error("Something went wrong!");
         }

         const responseData = await response.json(); // this will return an object, but we want array, thats why new loadedMeals

         const loadedMeals = [];

         for (const key in responseData) {
            loadedMeals.push({
               id: key,
               name: responseData[key].name,
               description: responseData[key].description,
               price: responseData[key].price,
            });
         }

         setMeals(loadedMeals);
         setIsLoading(false);
      };

      // Handling error inside of a promise, we can't use try catch just like that here
      fetchMeals().catch((error) => {
         setIsLoading(false);
         setHttpError(error.message);
      });
   }, []);

   if (isLoading) {
      return (
         <section className={classes.mealsLoading}>
            <p>Loading...</p>
         </section>
      );
   }

   if (httpError) {
      return (
         <section className={classes.mealsError}>
            <p>{httpError}</p>
         </section>
      );
   }

   const mealslist = meals.map((meal) => (
      <MealItem
         id={meal.id}
         key={meal.id}
         name={meal.name}
         description={meal.description}
         price={meal.price}
      />
   ));

   return (
      <section className={classes.meals}>
         <Card>
            <ul>{mealslist}</ul>
         </Card>
      </section>
   );
};

export default AvailableMeals;
