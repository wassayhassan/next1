


export async function getStaticPaths(){
  const data = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await data.json();
  
  const paths = posts.map((post)=> {
    return {params: {id: (post.id.toString())}}
   
  });
  console.log(paths);

  return {
      paths,
      fallback: false
  }
}
export async function getStaticProps({params}){
// console.log(params);
const data = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
const post = await data.json();
  // const post = {
  //   id: 1,
  //   title: 'adfdf',
  //   body: 'sdffsdfsf',
  // }

return {
  props: {
      post: post
  }
}
}


export default function Post({post}){


  return(
    <>
 
    <div className="post" key={post.id}>
        {/* <p>{id}</p> */}
        <p>{post.id}</p>
        <p>{post.title}</p>
        <p>{post.body}</p>
    </div>
    </>


  )
}
