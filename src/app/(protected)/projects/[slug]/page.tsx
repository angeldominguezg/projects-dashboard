

function Page({ params }) {
  const { slug } = params;
 // Access a specific query parameter

  return (
    <div>
      Project page [SLUG HERE]
      <div>
        <p>Slug: {slug}</p>
      </div>
    </div>
  );
}

export default Page;
