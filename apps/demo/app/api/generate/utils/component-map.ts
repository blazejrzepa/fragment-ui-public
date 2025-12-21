/**
 * Component mapping for form fields
 * Maps field types to Fragment UI component names
 */

export const FORM_COMPONENT_MAP: Record<string, string> = {
  // Basic inputs
  "text": "Input",
  "email": "Input",
  "password": "Input",
  "number": "Input",
  "tel": "Input",
  "url": "Input",
  "search": "Input",
  
  // Text areas
  "textarea": "Textarea",
  
  // Selection components
  "select": "Select",
  "multiselect": "MultiSelect",
  "combobox": "Combobox",
  "radio": "RadioGroup",
  "checkbox": "Checkbox",
  
  // Date/Time
  "date": "DatePicker",
  "datepicker": "DatePicker",
  "datetime": "DatePicker",
  "time": "Input", // Can be enhanced with time picker
  
  // Toggle components
  "switch": "Switch",
  "toggle": "Toggle",
  
  // Range/Slider
  "slider": "Slider",
  "range": "Slider",
  
  // File upload
  "file": "FileUpload",
  "upload": "FileUpload",
  
  // Specialized
  "rating": "Rating",
  "color": "ColorPicker",
  "tags": "TagInput",
  
  // Buttons
  "button": "Button",
  "submit": "Button",
};

