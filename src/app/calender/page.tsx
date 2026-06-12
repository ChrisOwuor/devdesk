
export default async function page() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();

  return (
    <div className="cont p-2 w-full">
      <div
        id="application-container"
        className="w-full h-full transition-colors left-[72px] grid grid-cols-5 duration-200 px-5 py-6  shadow-custom rounded-sm "
      >
        <div className="cont">
          <h1 className="text-primary-custom">Posts</h1>
          <ul>
            {posts.slice(0, 5).map((post: any) => {
              return (
                <li className="text-primary-custom" key={post.id}>
                  {post.title}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
