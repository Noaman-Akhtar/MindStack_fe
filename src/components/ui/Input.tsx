interface InputProps{
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=> void ;
    placeholder:string;
}
export  function Input({ onChange, placeholder }: InputProps) {
    return (
        <div>
            <input 
                placeholder={placeholder} 
                type="text" 
                className="w-full border rounded "
                onChange={onChange}
            />
        </div>
 )};