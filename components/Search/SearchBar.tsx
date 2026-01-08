import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type SearchBarProps = {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getWeather: () => void;
  loadingWeather: boolean;
  hasValidSelection: boolean;
  onInputRef?: (ref: HTMLInputElement | null) => void;
};

export default function SearchBar({
  input,
  onChange,
  getWeather,
  loadingWeather,
  hasValidSelection,
  onInputRef,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (hasValidSelection) {
        getWeather();
      } else {
        console.log("No valid suggestion selected.");
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        ref={(el) => onInputRef?.(el)}
        value={input}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter city or province"
        className="flex-1"
      />
      <Button onClick={getWeather} disabled={loadingWeather || !hasValidSelection}>
        {loadingWeather ? <Spinner className="w-4 h-4" /> : "Get Weather"}
      </Button>
    </div>
  );
}
