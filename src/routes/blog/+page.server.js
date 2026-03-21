export async function load({ fetch }) {
  const getPosts = async () => {
    const res = await fetch('/api/posts');
    if (res.ok) {
      return await res.json();
    }
    return [];
  };

  return { 
    postsPromise: getPosts() 
  };
}
