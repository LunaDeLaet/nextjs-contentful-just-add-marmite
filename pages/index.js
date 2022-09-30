import { createClient } from "contentful";
import RecipeCard from "../components/RecipeCard";

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
  // click event
  const handleClick = (e) => {
    console.log("Button clicked!", e);
  };

  const handleClickAgain = (name, e) => {
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
