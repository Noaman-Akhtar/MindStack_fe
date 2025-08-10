interface InputProps{
    variant:"primary"|"secondary";
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=> void ;
    placeholder:string;
    ref?:any;
}
const variantStyles={
    "primary":"bg-slate-50",
    "secondary":"bg-[#131318]  text-white placeholder:text-gray-400 "
}
export function Input(props: InputProps) {
    return (
        <div>
            <input 
            ref={props.ref}
                placeholder={props.placeholder} 
                type="text" 
                className={"w-full border border-purple-400/10 focus:border-purple-900/30 rounded h-13 pl-3 py-2  text-xlplaceholder:italic transition-colors duration-200"+" "+variantStyles[props.variant]}
                
            />
        </div>
 )};