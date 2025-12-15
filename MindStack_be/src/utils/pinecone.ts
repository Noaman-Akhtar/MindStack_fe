import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from 'dotenv' ;
import { Interface } from "readline";

dotenv.config();

if(!process.env.PINECONE_API_KEY){
    throw new Error ("PINECONE_API_KEY environment variable is missing!");
}

const pc = new Pinecone({
    apiKey:process.env.PINECONE_API_KEY,
});

const indexName = process.env.PINECONE_INDEX_NAME! ;
type UpsertProps = {
userId: string,
  contentId: string,
  embeddingText: string,
  metadata: {
    title: string;
    type: string;
  }
};

export async function getUserNamespace(userId:string){
    const indexDescription = await pc.describeIndex(indexName);
    const indexHost = indexDescription.host;
    return pc.index(indexName,indexHost).namespace(`user-${userId}`);
}


export async function upsertToPinecone(
    props: UpsertProps
) {
    try{
  const namespace = await getUserNamespace(props.userId);

  await namespace.upsertRecords([
    {   userId:props.userId,
        id:props.contentId,
        text:props.embeddingText,
        title:props.metadata.title,
        type:props.metadata.type
    }
  ]);

  console.log(`Upserted to Pinecone:${props.contentId} in user-${props.userId}`);
  return true;
}
catch(error){
    console.error('Pinecone upsert error:',error);
    throw error;
} 
}

export async function searchInPinecone(
userId:string,
query:string,
topK:number = 10
){
    try{
        const namespace = await getUserNamespace(userId);
        
              console.log(`Searching in namespace: user-${userId} with query: ${query}`);

        const searchResults = await namespace.searchRecords({
            query:{
                topK: topK,
                inputs:{text:query}
            },
           fields: ['title','type'],
            
        });
                console.log(`Search results:`, searchResults.result.hits);
        return searchResults.result.hits;
    } catch (error: any) {
        console.error('Search error', error);
        throw error;
    }
}

export async function deleteFromPinecone(userId:string , contentId:string){
    try{
        const indexDescription = await pc.describeIndex(indexName);
        const indexHost =indexDescription.host;
        const index = pc.index(indexName,indexHost);

        await index.namespace(`user-${userId}`).deleteOne(contentId);
        return true;
    }
    catch(error){
        console.error('Pinecone delete error',error);
        throw error;
    }


}