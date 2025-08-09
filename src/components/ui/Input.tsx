interface InputProps{
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=> void ;
    placeholder:string;
}
export function Input({ onChange, placeholder }: InputProps) {
    return (
        <div>
            <input 
                placeholder={placeholder} 
                type="text" 
                className="w-full border border-purple-400/10 focus:border-purple-900/30 rounded h-13 pl-3 py-2 bg-[#131318] text-xl text-white placeholder:text-gray-400 placeholder:italic transition-colors duration-200"
                onChange={onChange}
            />
        </div>
 )};