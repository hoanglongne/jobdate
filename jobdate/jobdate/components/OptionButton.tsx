export default function OptionButton({ option, onOptionClick, selectedOptions }: { option: any, onOptionClick: any, selectedOptions: { [key: string]: boolean } }) {

    const isSelected = selectedOptions[option.name] || false;

    return (
        <button key={option.name} onClick={() => onOptionClick(option.name)} className={`${isSelected ? "border-profile text-profile" : "border-card text-card"} font-medium text-sm md:text-base bg-foreground px-2 py-2 rounded-2xl border-2 duration-500 ease-out`}>
            {option.label}
        </button>
    );
}