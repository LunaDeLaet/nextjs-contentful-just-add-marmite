import { createClient } from "contentful";
import RecipeCard from "../components/RecipeCard";
import { useState } from "react";

// connect to contentful space
export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: "recipe" });

  return {
    props: {
      recipes: res.items,
      // ISR
      revalidate: 1,
    },
  };
}

export default function Home({ recipes }) {
  // let name = "mario";
  const [name, setName] = useState("mario");
  const [age, setAge] = useState(25);

  // event handlers
  // const handleClick = (e) => {
  //  console.log("Button clicked!", e);
  // };

  // useState
  const handleClick = () => {
    setName("luigi");
    setAge("30");
  };

  const handleClickAgain = (e) => {
    console.log("Hello " + name, e.target);
  };

  return (
    <div className="home">
      <h2>Homepage</h2>

      <button onClick={handleClick}>Click me!</button>
      {/* when button clicked: fire function {handleClickAgain("Mario")} */}
      <button onClick={(e) => handleClickAgain("Mario", e)}>
        Click me, too!
      </button>
      <p>
        {name} is {age} years old.
      </p>

      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.sys.id} recipe={recipe} />
        ))}

        <style jsx>{`
          .recipe-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px 60px;
          }
        `}</style>
      </div>
    </div>
  );
}
