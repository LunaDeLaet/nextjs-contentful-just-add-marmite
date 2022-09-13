import { createClient } from 'contentful'
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// connect to contentful space
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
})

// get items at build time
export const getStaticPaths = async () => {
  // store all recipes in items porperty in response
  const res = await client.getEntries({
    content_type: 'recipe',
  })

  // array of path objects for each recipe with slug as route parameters
  const paths = res.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    }
  })

  return {
    paths,
    fallback: false, // dont show fallback, but show 404 page instead
  }
}

// fetch single item based on page we are on, based on value of a field
export async function getStaticProps({ params }) {
  // run for each page
  const { items } = await client.getEntries({
    content_type: 'recipe',
    // we want each slug field to match params.slug
    'fields.slug': params.slug,
  })

  return {
    props: { recipe: items[0] }, // return only 1 item instead of array as prop
  }
}

export default function RecipeDetails({ recipe }) {
  const { featureImage, title, cookingTime, ingredients, method } =
    recipe.fields

  return (
    <div>
      <div className='banner'>
        <Image
          src={'https:' + featureImage.fields.file.url}
          width={featureImage.fields.file.details.image.width}
          height={featureImage.fields.file.details.image.height}
        />
        <h2>{title}</h2>
      </div>

      <div className='info'>
        <p>Takes about {cookingTime} mins to cook.</p>
        <h3>Ingredients:</h3>

        {ingredients.map((ing) => (
          <span key={ing}>{ing}</span>
        ))}
      </div>
      <div className='method'>
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>
      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ', ';
        }
        .info span:last-child::after {
          content: '.';
        }
      `}</style>
    </div>
  )
}
