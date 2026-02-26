import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function RaceCategorySelect({ value, onChange }) {
  return (
    <div className="w-full max-w-xs">
      <label htmlFor="race-category" className="block text-sm font-semibold text-gray-900 mb-1">
        Race Category
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="race-category" className="w-full cursor-pointer">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="varsity-boys">Varsity Boys</SelectItem>
          <SelectItem value="varsity-girls">Varsity Girls</SelectItem>
          <SelectItem value="jv-boys">JV Boys</SelectItem>
          <SelectItem value="jv-girls">JV Girls</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default RaceCategorySelect
