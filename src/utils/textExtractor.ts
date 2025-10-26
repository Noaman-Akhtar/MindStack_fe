export function extractTextFromDelta(delta:any) :string{
    if(!delta || !delta.ops || !Array.isArray(delta.ops)){
        return '';
    }
    return delta.ops.map((op:any)=>{
        if(typeof op.insert === 'string'){
            return op.insert;
        }
        return '' ;
    })
    .join('')
    .trim();
}

export function buildEmbeddingText(content:{
    title?:string;
    note?:string;
    richNoteDelta?:any;
    documents?: Array<{name:string}>;
}): string {
    const parts: string[] =[] ;

    if(content.title){
        parts.push(content.title);
    }

    if(content.note){
        parts.push(content.note);
    }

    if(content.richNoteDelta){
        const richText = extractTextFromDelta(content.richNoteDelta);
        if(richText){
            parts.push(richText);
        }
    }

    if(content.documents && content.documents.length >0){
        const docNames = content.documents.map(doc => doc.name).join(', ');
        parts.push(`Documents:${docNames}`);
    }
    return parts.join('. ').trim();
}