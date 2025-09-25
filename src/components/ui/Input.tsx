interface InputProps{
    type: "text" | "password";
    variant:"primary"|"secondary";
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=> void ;
    placeholder:string;
    ref?:any;
    height?:string;
}
const variantStyles={
    "primary":"bg-gray-100",
    "secondary":"bg-[#131318]  text-white placeholder:text-gray-400 "
}
export function Input(props: InputProps) {
    return (
        <div>
            <input 
            ref={props.ref}
                placeholder={props.placeholder} 
                type={props.type} 
                className={"w-full tracking-wider border border-purple-400/10 focus:border-purple-900/30 rounded h-13 pl-3 py-2  text-xl placeholder:italic transition-colors duration-200"+" "+variantStyles[props.variant]}
style={props.height?{height:props.height}:undefined}
            />
        </div>
 )};