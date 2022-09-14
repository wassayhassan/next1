import axios from "axios";

function Posts({posts}){
    return (
        <>
        {posts.map(post=> {
            return(
                <div className="post" key={post.id}>
                    <p>{post.id}</p>
                   <p>{post.title}</p>
                   <p>{post.body}</p>
                </div>
            )
        })}
        </>
    )
}

export async function getStaticProps(){
    const data = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts  =await data.json();
    return {
        props: {
            posts
        }
    }
}

export default Posts;